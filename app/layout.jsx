import "./globals.css";

export const metadata = {
  title: "BestFit Application Studio",
  description: "Generate role-specific resumes from a job link and experience bank.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
