import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { authConfigured, authEnabled, safeNextPath } from "./lib/auth/config";
import { authFetch } from "./lib/auth/fetch";
import { authUser } from "./lib/auth/user";

export async function proxy(request) {
  if (!authEnabled) {
    const path = request.nextUrl.pathname;
    if (["/login", "/signup", "/forgot-password", "/reset-password", "/auth/callback"].includes(path)) {
      const url = request.nextUrl.clone();
      url.pathname = safeNextPath(url.searchParams.get("next"));
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (!authConfigured) return NextResponse.next();
  let response = NextResponse.next({ request });
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: { fetch: authFetch },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data, error } = await authUser(client);
  const path = request.nextUrl.pathname;
  const protectedPage = ["/studio", "/profile", "/experiences", "/reset-password"].some(
    route => path === route || path.startsWith(`${route}/`),
  );
  if (protectedPage && (error || !data.user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", path);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/studio/:path*", "/profile/:path*", "/experiences/:path*", "/login", "/signup", "/forgot-password", "/reset-password", "/auth/:path*", "/api/:path*"],
};
