"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { BadgeItem } from "@/lib/types";

interface ToastProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

export function BadgeUnlockToast({ badge, onClose }: ToastProps) {
  if (!badge) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 bg-githubDark-card border border-gitOrange/40 rounded-xl shadow-2xl max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-2 rounded-lg bg-gitOrange/15 text-gitOrange border border-gitOrange/30">
        <Sparkles className="w-5 h-5 animate-spin" />
      </div>
      <div className="flex-1 pr-2">
        <p className="text-xs font-mono uppercase tracking-wider text-gitOrange font-semibold">
          Achievement Unlocked
        </p>
        <h4 className="text-sm font-semibold text-githubDark-text mt-0.5">
          {badge.title}
        </h4>
        <p className="text-xs text-githubDark-muted mt-1 leading-relaxed">
          {badge.description}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-githubDark-muted hover:text-githubDark-text p-1 rounded-md transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
