"use client";

import React from "react";
import Link from "next/link";
import { Flame, Github, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-githubDark-border/60 bg-githubDark-deep mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gitOrange/10 border border-gitOrange/30 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-gitOrange" />
              </div>
              <span className="text-sm font-semibold text-githubDark-text">
                Git Lantern
              </span>
              <span className="text-xs text-githubDark-muted">
                — Built for FirstCommit Hackathon
              </span>
            </div>
            <p className="text-xs text-githubDark-muted max-w-md text-center md:text-left">
              Transforming plain English developer scenarios into exact, copy-paste ready
              Git commands with real-time state visualization.
            </p>
          </div>

          {/* Navigation & Links */}
          <div className="flex items-center gap-6 text-xs text-githubDark-muted">
            <Link
              href="/privacy"
              className="hover:text-githubDark-text transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Privacy Policy
            </Link>
            <Link
              href="/profile"
              className="hover:text-githubDark-text transition-colors"
            >
              Account & Data
            </Link>
            <a
              href="https://github.com/mantisdarling/GitLantern"
              target="blank"
              rel="noopener noreferrer"
              className="hover:text-githubDark-text transition-colors flex items-center gap-1.5 text-gitOrange"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Repo
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-githubDark-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-githubDark-faint">
          <p>© {new Date().getFullYear()} Git Lantern. Open source under MIT License.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-gitOrange inline" /> for junior developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
