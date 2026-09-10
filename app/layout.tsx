import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Git Lantern — Visual Git Learning & Synthesis Engine",
  description:
    "An award-winning developer tool for junior developers. Transforms everyday scenarios into verified terminal commands, live state visualizations, and recovery diagnostics. Built for FirstCommit Hackathon.",
  keywords: [
    "Git",
    "Developer Tools",
    "Junior Developers",
    "Git Commands",
    "Visual State Mapping",
    "Merge Conflict Fixes",
    "FirstCommit",
  ],
  authors: [{ name: "Git Lantern Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-githubDark-bg text-githubDark-text selection:bg-gitOrange/30 selection:text-gitOrange antialiased">
        {children}
      </body>
    </html>
  );
}
