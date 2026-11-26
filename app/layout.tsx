import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Git Lantern | Visual Git Learning & Synthesis Engine",
  description:
    "A visual developer tool for learning Git. Transforms everyday scenarios into verified terminal commands, live state visualizations, and recovery diagnostics.",
  keywords: [
    "Git",
    "Developer Tools",
    "Git Commands",
    "Visual State Mapping",
    "Merge Conflict Fixes",
  ],
  authors: [{ name: "Git Lantern" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB] antialiased">
        {children}
      </body>
    </html>
  );
}
