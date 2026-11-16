import "./globals.css";
import Workspace from "./Workspace";
import { serverAuth } from "../lib/auth/server";
import { authUser } from "../lib/auth/user";

export const metadata = {
  title: "BestFit Application Studio",
  description: "Generate role-specific resumes from a job link and experience bank.",
};

export default async function RootLayout({ children }) {
  const client = await serverAuth();
  let account = null;
  if (client) {
    const { data } = await authUser(client);
    if (data.user) account = { id: data.user.id, email: data.user.email };
  }
  return (
    <html lang="en">
      <body><Workspace account={account} />{children}</body>
    </html>
  );
}
