"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      <div className="relative space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#2997FF]/10 border border-[#2997FF]/30 flex items-center justify-center">
            <Search className="w-7 h-7 text-[#2997FF] opacity-80" />
          </div>
        </div>

        {/* Error Code */}
        <div className="font-mono text-7xl font-extrabold text-[#27272a] select-none">
          404
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold text-white">
            Page not found
          </h1>
          <p className="text-sm text-[#86868b] mt-2 leading-relaxed">
            This branch does not exist, or it got reset with{" "}
            <code className="font-mono text-[#2997FF] text-xs">git reset --hard</code> before you arrived.
          </p>
        </div>

        {/* Git Lantern Branding */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#6e6e73]">
          <Flame className="w-3.5 h-3.5 text-[#2997FF]" />
          <span>Git Lantern</span>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2997FF] hover:bg-[#47a6ff] text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#2997FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Git Lantern Dashboard
        </Link>
      </div>
    </div>
  );
}
