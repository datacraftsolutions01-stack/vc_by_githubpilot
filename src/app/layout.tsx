import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VC Briefing - AI-Powered Venture Capital Analysis",
  description: "Generate concise VC briefs from pitch deck text using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
