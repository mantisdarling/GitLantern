"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Award,
  TerminalSquare,
  User,
  ShieldCheck,
  Search,
  Command,
} from "lucide-react";
import { BadgeItem, CommandHistoryItem } from "@/lib/types";
import { sounds } from "@/lib/soundEffects";

interface HeaderProps {
  badges: BadgeItem[];
  historyItems: CommandHistoryItem[];
  onOpenHistory: () => void;
  onOpenBadges: () => void;
  onOpenAuth: () => void;
  onOpenPalette: () => void;
  userEmail?: string | null;
}

export function Header({
  badges,
  historyItems,
  onOpenHistory,
  onOpenBadges,
  onOpenAuth,
  onOpenPalette,
  userEmail,
}: HeaderProps) {
  const [soundActive, setSoundActive] = useState<boolean>(sounds.isEnabled());
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundActive(newState);
    if (newState) {
      sounds.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#08090d]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Technical Coordinates */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-gitOrange rounded-md p-1"
          >
            <div className="w-8 h-8 rounded-md bg-[#f05032]/10 border border-[#f05032]/30 flex items-center justify-center group-hover:bg-[#f05032]/20 transition-all duration-200">
              <span className="text-[#f05032] font-mono text-sm font-bold">λ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#f0f6fc] group-hover:text-gitOrange transition-colors uppercase font-mono">
                  Git Lantern
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono font-medium rounded bg-[#f05032]/10 text-[#f05032] border border-[#f05032]/25">
                  SYS//01
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Section Navigation (Cerebrium Technical Nav) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-githubDark-muted uppercase tracking-wider">
          <a
            href="#synthesis"
            className="hover:text-[#f0f6fc] transition-colors focus:outline-none focus:text-gitOrange flex items-center gap-1.5"
          >
            <span className="text-gitOrange opacity-60">[01]</span>
            <span>Synthesis</span>
          </a>
          <a
            href="#pipeline"
            className="hover:text-[#f0f6fc] transition-colors focus:outline-none focus:text-gitOrange flex items-center gap-1.5"
          >
            <span className="text-gitOrange opacity-60">[02]</span>
            <span>Pipeline</span>
          </a>
          <a
            href="#diagnostics"
            className="hover:text-[#f0f6fc] transition-colors focus:outline-none focus:text-gitOrange flex items-center gap-1.5"
          >
            <span className="text-gitOrange opacity-60">[03]</span>
            <span>Recovery</span>
          </a>
          <a
            href="#terminal"
            className="hover:text-[#f0f6fc] transition-colors focus:outline-none focus:text-gitOrange flex items-center gap-1.5"
          >
            <span className="text-gitOrange opacity-60">[04]</span>
            <span>Sandbox</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mesh3D-style Audio Equalizer Ticker */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-githubDark-muted hover:text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-gitOrange"
            title={soundActive ? "Mute ambient audio" : "Enable ambient audio"}
          >
            <span className="text-[11px] uppercase tracking-wider">
              {soundActive ? "Audio" : "Mute"}
            </span>
            <span className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5" aria-hidden="true">
              {soundActive ? (
                <>
                  <span className="w-0.5 bg-[#f05032] rounded-full animateEqOne" />
                  <span className="w-0.5 bg-[#f05032] rounded-full animateEqTwo" />
                  <span className="w-0.5 bg-[#f05032] rounded-full animateEqThree" />
                </>
              ) : (
                <>
                  <span className="w-0.5 h-1 bg-githubDark-faint rounded-full" />
                  <span className="w-0.5 h-1 bg-githubDark-faint rounded-full" />
                  <span className="w-0.5 h-1 bg-githubDark-faint rounded-full" />
                </>
              )}
            </span>
          </button>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-githubDark-muted hover:text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-gitOrange"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-gitOrange" />
            <kbd className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#141923] border border-[#1e2330] text-githubDark-muted">
              <Command className="w-2.5 h-2.5 mr-0.5" />K
            </kbd>
          </button>

          {/* Badges Button */}
          <button
            type="button"
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-githubDark-muted hover:text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-gitOrange"
            aria-label="View achievements and badges"
          >
            <Award className="w-3.5 h-3.5 text-gitOrange" />
            <span className="text-[11px] font-bold text-gitOrange">
              {unlockedCount}/{badges.length}
            </span>
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-githubDark-muted hover:text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-gitOrange"
            aria-label="View session command history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log</span>
            {historyItems.length > 0 && (
              <span className="px-1 text-gitOrange text-[10px] font-mono">
                ({historyItems.length})
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-gitOrange"
          >
            {userEmail ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-gitOrange" />
                <span className="max-w-[90px] truncate text-[11px]">
                  {userEmail}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-githubDark-muted" />
                <span className="text-[11px] text-githubDark-muted hover:text-[#f0f6fc]">
                  AUTH
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
