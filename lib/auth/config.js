export const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

export const authConfigured = Boolean(
  authEnabled && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export function safeNextPath(value) {
  return ["/studio", "/profile", "/experiences"].includes(value) ? value : "/studio";
}
