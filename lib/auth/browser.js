import { createBrowserClient } from "@supabase/ssr";
import { authConfigured } from "./config";

let client;

export function browserAuth() {
  if (!authConfigured) return null;
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  return client;
}
