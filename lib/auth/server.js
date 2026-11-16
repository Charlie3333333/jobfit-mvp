import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authConfigured } from "./config";
import { authFetch } from "./fetch";

export async function serverAuth() {
  if (!authConfigured) return null;
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: { fetch: authFetch },
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          try {
            values.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            // Server components read cookies; proxy refreshes them on the response.
          }
        },
      },
    },
  );
}
