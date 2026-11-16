import { NextResponse } from "next/server";
import { serverAuth } from "../../../lib/auth/server";
import { safeNextPath } from "../../../lib/auth/config";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") === "/reset-password" ? "/reset-password" : safeNextPath(url.searchParams.get("next"));
  const client = await serverAuth();
  if (client && code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/login?error=expired", url.origin));
}
