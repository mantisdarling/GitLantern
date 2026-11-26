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

            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command search"
              title="Command Palette (Ctrl+K)"
              className="hidden sm:flex h-10 px-3 rounded-[4px] bg-white border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] items-center gap-2 text-[11px] font-mono transition-colors focus:outline-none"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[#71717A]">CMD+K</span>
            </button>
          </div>

          {/* Top-right architectural CTA bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <a
              href="#synthesis"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-[4px] bg-[#0A0A0A] hover:bg-[#27272A] text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.12em] flex items-center gap-2.5 sm:gap-4 transition-colors"
            >
              <span>CHOOSE A COMMAND</span>
              <Plus className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Architectural Navigation Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full bg-white border-r border-[#E4E4E7] p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E4E4E7]">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-[4px] bg-[#0A0A0A] text-white flex items-center justify-center font-mono text-xs font-bold">
                    λ
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-[#0A0A0A] uppercase">
                    Git Lantern
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation"
                  className="p-1.5 rounded-[4px] hover:bg-[#F4F4F5] text-[#0A0A0A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="mt-6 space-y-1">
                {[
                  { label: "01 / Command Generator", href: "#synthesis" },
                  { label: "02 / Where Your Files Live", href: "#pipeline" },
                  { label: "03 / Repository Topology Map", href: "#topology" },
                  { label: "04 / Fix Common Mistakes", href: "#diagnostics" },
                  { label: "05 / Terminal Sandbox", href: "#terminal" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 text-xs font-mono uppercase tracking-wider text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-[4px] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-[#E4E4E7] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPalette();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] border border-[#E4E4E7] hover:border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" />
                    Command Palette
                  </span>
                  <span className="text-[10px] text-[#71717A]">Ctrl+K</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenHistory();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] border border-[#E4E4E7] hover:border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    Session Log
                  </span>
                  <span className="text-[10px] font-semibold">
                    {historyItems.length}
                  </span>
                </button>

                {onOpenTour && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenTour();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[4px] border border-[#E4E4E7] hover:border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Quick Tour
                  </button>
                )}

                {onOpenShortcuts && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenShortcuts();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] border border-[#E4E4E7] hover:border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Keyboard Shortcuts
                    </span>
                    <span className="text-[10px] text-[#71717A]">?</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] border border-[#E4E4E7] hover:border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {soundActive ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    Sound Effects
                  </span>
                  <span className="text-[10px] text-[#71717A]">
                    {soundActive ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full h-10 rounded-[4px] bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                {userEmail ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[180px]">{userEmail}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
