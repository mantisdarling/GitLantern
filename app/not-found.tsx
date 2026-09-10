"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-githubDark-bg flex flex-col items-center justify-center px-4 text-center">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gitOrange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gitOrange/10 border border-gitOrange/30 flex items-center justify-center">
            <Search className="w-7 h-7 text-gitOrange opacity-60" />
          </div>
        </div>

        {/* Error Code */}
        <div className="font-mono text-7xl font-extrabold text-githubDark-border select-none">
          404
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold text-githubDark-text">
            Page not found
          </h1>
          <p className="text-sm text-githubDark-muted mt-2 leading-relaxed">
            This branch doesn&apos;t exist — or it got reset with{" "}
            <code className="font-mono text-gitOrange text-xs">git reset --hard</code> before you arrived.
          </p>
        </div>

        {/* Git Lantern Branding */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-githubDark-faint">
          <Flame className="w-3.5 h-3.5 text-gitOrange" />
          <span>Git Lantern — FirstCommit Hackathon</span>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gitOrange hover:bg-orange-600 text-white text-sm font-medium transition-all shadow-lg shadow-gitOrange/20 focus:outline-none focus:ring-2 focus:ring-gitOrange"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Git Lantern Dashboard
        </Link>
      </div>
    </div>
  );
}
