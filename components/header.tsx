"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Award,
  User,
  ShieldCheck,
  Search,
  HelpCircle,
  Compass,
  Plus,
  X,
  Volume2,
  VolumeX,
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
  userEmail,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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
    <>
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none px-4 sm:px-8 pt-4 sm:pt-5">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-3">
          {/* Top-left architectural menu & quick badge button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-[4px] bg-[#0A0A0A] hover:bg-[#27272A] text-white flex items-center justify-center transition-colors focus:outline-none"
            >
              {menuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <span className="flex flex-col gap-1 w-4" aria-hidden="true">
                  <span className="h-[1.5px] w-full bg-white block" />
                  <span className="h-[1.5px] w-3 bg-white block" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBadges}
              aria-label="View achievements"
              title={`Achievements (${unlockedCount}/${badges.length})`}
              className="h-9 sm:h-10 px-2.5 rounded-[4px] bg-white border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] flex items-center gap-1.5 text-[11px] font-mono transition-colors focus:outline-none"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">
                {unlockedCount}/{badges.length}
              </span>
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
