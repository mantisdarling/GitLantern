"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { BadgeItem } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

const storageBadgesKey = "gitLanternBadges";

export const initialBadgesList: BadgeItem[] = [
  {
    id: "firstBranch",
    title: "First Branch",
    description: "Created an isolated feature or hotfix branch.",
    icon: "GitBranch",
    category: "gettingStarted",
    isUnlocked: false,
  },
  {
    id: "firstCommit",
    title: "First Commit",
    description: "Successfully recorded a snapshot in the local repository.",
    icon: "GitCommitHorizontal",
    category: "gettingStarted",
    isUnlocked: false,
  },
  {
    id: "firstPush",
    title: "First Push",
    description: "Transferred local commits to a remote GitHub repository.",
    icon: "UploadCloud",
    category: "gettingStarted",
    isUnlocked: false,
  },
  {
    id: "conflictCrusher",
    title: "Conflict Crusher",
    description: "Mastered merge conflicts and rebase workflows.",
    icon: "ShieldAlert",
    category: "resilience",
    isUnlocked: false,
  },
  {
    id: "timeTraveler",
    title: "Time Traveler",
    description: "Rewound history safely using git reset or reflog.",
    icon: "History",
    category: "resilience",
    isUnlocked: false,
  },
  {
    id: "terminalApprentice",
    title: "Terminal Apprentice",
    description: "Executed 5 or more commands in the terminal simulator.",
    icon: "Terminal",
    category: "mastery",
    isUnlocked: false,
  },
  {
    id: "lanternMaster",
    title: "Lantern Master",
    description: "Explored all four stages of the state pipeline.",
    icon: "Sparkles",
    category: "mastery",
    isUnlocked: false,
  },
];

export function useBadges() {
  const [badges, setBadges] = useState<BadgeItem[]>(initialBadgesList);
  const [latestBadge, setLatestBadge] = useState<BadgeItem | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageBadgesKey);
      if (stored) {
        const parsedIds: string[] = JSON.parse(stored);
        setBadges((prev) =>
          prev.map((b) => ({
            ...b,
            isUnlocked: parsedIds.includes(b.id),
          }))
        );
      }
    } catch (err) {
      console.warn("Could not load badges from localStorage", err);
    }
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (!target || target.isUnlocked) {
        return prev;
      }

      const updated = prev.map((b) =>
        b.id === badgeId
          ? {
              ...b,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
            }
          : b
      );

      const unlockedIds = updated.filter((b) => b.isUnlocked).map((b) => b.id);
      try {
        localStorage.setItem(storageBadgesKey, JSON.stringify(unlockedIds));
      } catch (err) {
        console.warn("Could not save badges to localStorage", err);
      }

      const unlockedItem = updated.find((b) => b.id === badgeId) || null;
      setLatestBadge(unlockedItem);

      // Trigger celebratory confetti in Git Orange palette
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#f05032", "#ea580c", "#ffedd5", "#f97316"],
        });
      } catch (err) {
        // Confetti fallback
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            supabase
              .from("badges")
              .insert({
                userId: data.user.id,
                badgeId,
                title: target.title,
              })
              .then(
                () => {},
                () => {}
              );
          }
        });
      }

      return updated;
    });
  }, []);

  const dismissLatestBadge = useCallback(() => {
    setLatestBadge(null);
  }, []);

  return { badges, unlockBadge, latestBadge, dismissLatestBadge };
}
