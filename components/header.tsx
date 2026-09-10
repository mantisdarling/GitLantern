"use client";

import React from "react";
import Link from "next/link";
import { Flame, History, Award, TerminalSquare, User, ShieldCheck } from "lucide-react";
import { BadgeItem, CommandHistoryItem } from "@/lib/types";

interface HeaderProps {
  badges: BadgeItem[];
  historyItems: CommandHistoryItem[];
  onOpenHistory: () => void;
  onOpenBadges: () => void;
  onOpenAuth: () => void;
  userEmail?: string | null;
}

export function Header({
  badges,
  historyItems,
  onOpenHistory,
  onOpenBadges,
  onOpenAuth,
  userEmail,
}: HeaderProps) {
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-githubDark-border/70 bg-githubDark-deep/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Hackathon Tag */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-gitOrange/50 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gitOrange/10 border border-gitOrange/30 flex items-center justify-center group-hover:bg-gitOrange/20 transition-all duration-200">
              <Flame className="w-4 h-4 text-gitOrange animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-githubDark-text group-hover:text-gitOrange transition-colors">
                  Git Lantern
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-gitOrange/10 text-gitOrange border border-gitOrange/25">
                  FirstCommit
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Section Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-githubDark-muted">
          <a
            href="#synthesis"
            className="hover:text-githubDark-text transition-colors focus:outline-none focus:text-gitOrange"
          >
            Command Engine
          </a>
          <a
            href="#pipeline"
            className="hover:text-githubDark-text transition-colors focus:outline-none focus:text-gitOrange"
          >
            State Pipeline
          </a>
          <a
            href="#diagnostics"
            className="hover:text-githubDark-text transition-colors focus:outline-none focus:text-gitOrange"
          >
            Diagnostics & Wizard
          </a>
          <a
            href="#terminal"
            className="hover:text-githubDark-text transition-colors focus:outline-none focus:text-gitOrange flex items-center gap-1.5"
          >
            <TerminalSquare className="w-3.5 h-3.5 text-gitOrange" />
            Terminal
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badges Button */}
          <button
            type="button"
            onClick={onOpenBadges}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-githubDark-border bg-githubDark-card hover:bg-githubDark-surface text-githubDark-muted hover:text-githubDark-text text-xs transition-all focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
            aria-label="View achievements and badges"
          >
            <Award className="w-3.5 h-3.5 text-gitOrange" />
            <span className="font-mono text-[11px] font-semibold text-gitOrange">
              {unlockedCount}/{badges.length}
            </span>
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-githubDark-border bg-githubDark-card hover:bg-githubDark-surface text-githubDark-muted hover:text-githubDark-text text-xs transition-all focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
            aria-label="View session command history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {historyItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-gitOrange/20 border border-gitOrange/40 text-gitOrange text-[10px] font-mono flex items-center justify-center">
                {historyItems.length}
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-githubDark-border bg-githubDark-card hover:bg-githubDark-surface text-githubDark-text text-xs transition-all focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            {userEmail ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-gitOrange" />
                <span className="max-w-[100px] truncate text-[11px] font-mono">
                  {userEmail}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-githubDark-muted" />
                <span className="text-[11px] text-githubDark-muted hover:text-githubDark-text">
                  Sign In
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
