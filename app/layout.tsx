import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eszti & Peti | Meghívó",
  description: "Cinematikus, fantasy hangulatú esküvői meghívó mobilra tervezve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
