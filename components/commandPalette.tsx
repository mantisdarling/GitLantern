"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { gitScenarios } from "@/lib/scenariosData";
import { diagnosticCases } from "@/lib/diagnosticsData";
import { sounds } from "@/lib/soundEffects";
import {
  Search,
  Terminal,
  LifeBuoy,
  Layers,
  Award,
  Download,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Command,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioId: string) => void;
  onSelectDiagnostic: (diagnosticId: string) => void;
  onOpenTerminal: () => void;
  onOpenBadges: () => void;
  onDownloadCheatsheet: () => void;
  onOpenWizard: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: "Scenarios" | "Diagnostics" | "Quick Actions";
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectScenario,
  onSelectDiagnostic,
  onOpenTerminal,
  onOpenBadges,
  onDownloadCheatsheet,
  onOpenWizard,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // Quick Actions
    list.push({
      id: "action-terminal",
      title: "Interactive Terminal Simulator",
      category: "Quick Actions",
      subtitle: "Jump to sandbox terminal to test Git commands",
      icon: <Terminal className="w-4 h-4 text-gitOrange" />,
      action: () => {
        onOpenTerminal();
        onClose();
      },
    });

    list.push({
      id: "action-wizard",
      title: "Guided Undo My Mistake Wizard",
      category: "Quick Actions",
      subtitle: "Answer quick Yes/No questions to resolve errors",
      icon: <Sparkles className="w-4 h-4 text-gitOrange" />,
      action: () => {
        onOpenWizard();
        onClose();
      },
    });

    list.push({
      id: "action-badges",
      title: "View Achievements & Badges",
      category: "Quick Actions",
      subtitle: "Check unlocked Git mastery milestones",
      icon: <Award className="w-4 h-4 text-gitOrange" />,
      action: () => {
        onOpenBadges();
        onClose();
      },
    });

    list.push({
      id: "action-download",
      title: "Download Markdown Cheat Sheet",
      category: "Quick Actions",
      subtitle: "Export session commands as git-lantern-cheatsheet.md",
      icon: <Download className="w-4 h-4 text-gitOrange" />,
      action: () => {
        onDownloadCheatsheet();
        onClose();
      },
    });

    // Scenarios
    gitScenarios.forEach((scenario) => {
      list.push({
        id: "scenario-" + scenario.id,
        title: scenario.title,
        category: "Scenarios",
        subtitle: scenario.subtitle,
        icon: <Layers className="w-4 h-4 text-gitOrange" />,
        action: () => {
          onSelectScenario(scenario.id);
          onClose();
        },
      });
    });

    // Diagnostics
    diagnosticCases.forEach((diag) => {
      list.push({
        id: "diag-" + diag.id,
        title: diag.title,
        category: "Diagnostics",
        subtitle: diag.summary,
        icon: <LifeBuoy className="w-4 h-4 text-gitOrange" />,
        action: () => {
          onSelectDiagnostic(diag.id);
          onClose();
        },
      });
    });

    return list;
  }, [
    onOpenTerminal,
    onOpenWizard,
    onOpenBadges,
    onDownloadCheatsheet,
    onSelectScenario,
    onSelectDiagnostic,
    onClose,
  ]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      sounds.playClick();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      sounds.playClick();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = filteredItems[selectedIndex];
      if (selectedItem) {
        sounds.playClick();
        selectedItem.action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Palette Container */}
      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl bg-githubDark-card border border-githubDark-border rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-githubDark-border bg-githubDark-deep">
          <Search className="w-4 h-4 text-gitOrange shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, scenario, or error keyword... (e.g. merge, rebase, hotfix)"
            className="flex-1 bg-transparent text-sm text-githubDark-text placeholder:text-githubDark-faint focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-githubDark-surface border border-githubDark-border text-githubDark-muted">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-githubDark-muted text-xs">
              No matching commands or diagnostics found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors border ${
                    isSelected
                      ? "bg-gitOrange/10 border-gitOrange/40 text-gitOrange font-medium"
                      : "bg-transparent border-transparent hover:bg-githubDark-surface text-githubDark-text"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-githubDark-surface border border-githubDark-border flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-githubDark-surface border border-githubDark-border text-githubDark-faint">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-githubDark-muted truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-githubDark-faint shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Palette Footer Navigation Help */}
        <div className="px-4 py-2.5 bg-githubDark-deep border-t border-githubDark-borderSubtle flex items-center justify-between text-[11px] text-githubDark-faint font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Git Lantern Palette</span>
        </div>
      </div>
    </div>
  );
}
