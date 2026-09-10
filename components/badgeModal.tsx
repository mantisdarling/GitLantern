"use client";

import React from "react";
import { BadgeItem } from "@/lib/types";
import {
  X,
  Award,
  Lock,
  Sparkles,
  GitBranch,
  GitCommitHorizontal,
  UploadCloud,
  ShieldAlert,
  History,
  Terminal,
} from "lucide-react";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeItem[];
}

export function BadgeModal({ isOpen, onClose, badges }: BadgeModalProps) {
  if (!isOpen) {
    return null;
  }

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / badges.length) * 100);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "GitBranch":
        return <GitBranch className="w-5 h-5" />;
      case "GitCommitHorizontal":
        return <GitCommitHorizontal className="w-5 h-5" />;
      case "UploadCloud":
        return <UploadCloud className="w-5 h-5" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5" />;
      case "History":
        return <History className="w-5 h-5" />;
      case "Terminal":
        return <Terminal className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-githubDark-card border border-githubDark-border rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-githubDark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-githubDark-text">
                Git Mastery Badges
              </h3>
              <p className="text-xs text-githubDark-muted">
                Achievements unlocked automatically as you explore scenarios and terminal commands
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-githubDark-muted hover:text-githubDark-text hover:bg-githubDark-surface transition-colors"
            aria-label="Close badges dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="px-6 py-4 bg-githubDark-deep border-b border-githubDark-borderSubtle">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-githubDark-muted">Total Completion</span>
            <span className="text-gitOrange font-bold">
              {unlockedCount} of {badges.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-githubDark-surface overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gitOrange to-orange-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 max-h-[480px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.isUnlocked
                    ? "bg-githubDark-deep border-gitOrange/40 shadow-sm ring-1 ring-gitOrange/10"
                    : "bg-githubDark-deep/50 border-githubDark-borderSubtle opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.isUnlocked
                        ? "bg-gitOrange/15 text-gitOrange border border-gitOrange/30"
                        : "bg-githubDark-surface text-githubDark-faint border border-githubDark-border"
                    }`}
                  >
                    {badge.isUnlocked ? (
                      getBadgeIcon(badge.icon)
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-githubDark-text">
                        {badge.title}
                      </h4>
                      {badge.isUnlocked && (
                        <span className="text-[10px] font-mono text-gitOrange bg-gitOrange/10 px-1.5 py-0.2 rounded border border-gitOrange/30">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-githubDark-muted leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
