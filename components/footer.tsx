"use client";

import React from "react";
import Link from "next/link";
import { Flame, Github, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#182030] bg-[#040508] mt-24 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-sm font-cyber font-bold uppercase tracking-wider text-white">
                Git Lantern
              </span>
              <span className="text-xs font-mono text-neutral-400">
                // PORTAL SPEC 2200
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md text-center md:text-left leading-relaxed">
              Transforming plain English developer scenarios into exact, copy-paste ready
              Git commands with real-time state visualization.
            </p>
          </div>

          {/* Navigation & Links */}
          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <Link
              href="/privacy"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Privacy Policy
            </Link>
            <Link
              href="/profile"
              className="hover:text-cyan-400 transition-colors"
            >
              Portal Pass
            </Link>
            <a
              href="https://github.com/mantisdarling/GitLantern"
              target="blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-cyan-400"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#182030] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <p>© {new Date().getFullYear()} Git Lantern. Open source under MIT License.</p>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
            <span>SYS REG: 64.1355° N, 21.8954° W</span>
            <span className="text-cyan-400">•</span>
            <span>FREQ: 142.8 MHz</span>
            <span className="text-cyan-400">•</span>
            <span>PASS: GRANTED</span>
          </div>
          <p className="flex items-center gap-1 font-mono text-neutral-400 text-[11px]">
            Crafted with <Heart className="w-3 h-3 text-[#f05032] inline" /> for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
