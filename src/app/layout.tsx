import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIGNA • Crypto Trading AI",
  description: "Educational crypto signal generator with AI reasoning",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-bg text-text">
        {children}
      </body>
    </html>
  );
}