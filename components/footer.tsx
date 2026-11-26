"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-white border-t border-[#27272A]">
      <div className="screenMaxWidth py-16 sm:py-20">
        {/* Top Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#27272A]">
          {/* Brand & Tagline */}
          <div className="md:col-span-6 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#71717A]">
              THE ARCHITECTURE OF GIT WORKFLOWS
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white">
              GIT LANTERN
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-md leading-relaxed">
              Turn Git tasks into ready to run commands, inspect where your files live at every stage, and recover broken repository states.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#71717A]">
              SECTIONS
            </div>
            <ul className="space-y-2.5 text-sm text-[#E4E4E7]">
              <li>
                <a href="#synthesis" className="hover:text-white transition-colors">
                  Command Generator
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-white transition-colors">
                  Where Your Files Live
                </a>
              </li>
              <li>
                <a href="#topology" className="hover:text-white transition-colors">
                  Topology Map
                </a>
              </li>
              <li>
                <a href="#diagnostics" className="hover:text-white transition-colors">
                  Fix Common Mistakes
                </a>
              </li>
              <li>
                <a href="#terminal" className="hover:text-white transition-colors">
                  Terminal Sandbox
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#71717A]">
              RESOURCES
            </div>
            <ul className="space-y-2.5 text-sm text-[#E4E4E7]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/mantisdarling/GitLantern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.12em] text-[#71717A]">
          <p>© {new Date().getFullYear()} GIT LANTERN</p>
          <div className="flex flex-wrap items-center gap-6">
            <span>MIT LICENSE</span>
            <span>BUILT FOR DEVELOPERS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
