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
  Sun,
  Moon,
  HelpCircle,
  Compass,
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
  onOpenTour?: () => void;
  onOpenShortcuts?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
  userEmail?: string | null;
}

export function Header({
  badges,
  historyItems,
  onOpenHistory,
  onOpenBadges,
  onOpenAuth,
  onOpenPalette,
  onOpenTour,
  onOpenShortcuts,
  onToggleTheme,
  isDark = true,
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
    <header className="sticky top-0 z-40 w-full border-b border-[#182030] bg-[#040508]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Technical Coordinates */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-md p-1"
          >
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all duration-200 cyberBoxGlowMedium">
              <span className="text-cyan-400 font-mono text-sm font-bold">λ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-cyber font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors uppercase">
                  Git Lantern
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Clean Section Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono text-neutral-400">
          <a
            href="#synthesis"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Synthesis
          </a>
          <a
            href="#pipeline"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            State Pipeline
          </a>
          <a
            href="#diagnostics"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Recovery
          </a>
          <a
            href="#terminal"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Terminal
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cyber Audio Equalizer Ticker */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
            title={soundActive ? "Mute ambient audio" : "Enable ambient audio"}
          >
            <span className="text-[11px] uppercase tracking-wider">
              {soundActive ? "Audio" : "Mute"}
            </span>
            <span className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5" aria-hidden="true">
              {soundActive ? (
                <>
                  <span className="w-0.5 bg-cyan-400 rounded-full animateEqOne" />
                  <span className="w-0.5 bg-[#f05032] rounded-full animateEqTwo" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animateEqThree" />
                </>
              ) : (
                <>
                  <span className="w-0.5 h-1 bg-neutral-600 rounded-full" />
                  <span className="w-0.5 h-1 bg-neutral-600 rounded-full" />
                  <span className="w-0.5 h-1 bg-neutral-600 rounded-full" />
                </>
              )}
            </span>
          </button>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <kbd className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0d1017] border border-[#182030] text-neutral-400">
              <Command className="w-2.5 h-2.5 mr-0.5" />K
            </kbd>
          </button>

          {/* Tour Replay Trigger */}
          {onOpenTour && (
            <button
              type="button"
              onClick={onOpenTour}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
              title="Replay Interactive Spotlight Tour"
              aria-label="Replay tour"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Tour</span>
            </button>
          )}

          {/* Shortcuts HUD Trigger */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
              title="Keyboard Shortcuts (?)"
              aria-label="View keyboard shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-neutral-400 font-mono">?</span>
            </button>
          )}

          {/* Theme Toggle Trigger */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-cyan-400 text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          )}

          {/* Badges Button */}
          <button
            type="button"
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
            aria-label="View achievements and badges"
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-400">
              {unlockedCount}/{badges.length}
            </span>
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-neutral-300 hover:text-white text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
            aria-label="View session command history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log</span>
            {historyItems.length > 0 && (
              <span className="px-1 text-cyan-400 text-[10px] font-mono">
                ({historyItems.length})
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 text-[#f0f6fc] text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            {userEmail ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[90px] truncate text-[11px]">
                  {userEmail}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[11px] text-neutral-400 hover:text-white">
                  PASS
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
