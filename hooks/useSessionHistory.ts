"use client";

import { useState, useEffect, useCallback } from "react";
import { CommandHistoryItem } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

const storageKey = "gitLanternHistory";

export function useSessionHistory() {
  const [historyItems, setHistoryItems] = useState<CommandHistoryItem[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setHistoryItems(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Could not read local session history", err);
    }
    setIsReady(true);
  }, []);

  const addHistoryItem = useCallback(
    (command: string, explanation: string = "", source: "synthesis" | "terminal" | "diagnostic" = "synthesis") => {
      if (!command) {
        return;
      }
      const newItem: CommandHistoryItem = {
        id: "hist-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        command,
        explanation,
        source,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };

      setHistoryItems((prev) => {
        const next = [newItem, ...prev].slice(0, 100);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (err) {
          console.warn("Could not save session history to localStorage", err);
        }
        return next;
      });

      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            supabase
              .from("commandHistory")
              .insert({
                userId: data.user.id,
                command: newItem.command,
                explanation: newItem.explanation,
                source: newItem.source,
              })
              .then(
                () => {},
                () => {}
              );
          }
        });
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.warn("Could not clear localStorage history", err);
    }
  }, []);

  return { historyItems, addHistoryItem, clearHistory, isReady };
}
