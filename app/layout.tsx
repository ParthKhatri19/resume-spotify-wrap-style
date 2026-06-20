import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parth Khatri — Dev Wrapped",
  description: "Parth Khatri's interactive developer resume — Spotify Wrapped style",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
