import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MDN",
  description: "Mohamed Deraz Nasr - Software Engineer & ML Researcher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
