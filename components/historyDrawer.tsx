"use client";

import React from "react";
import { CommandHistoryItem } from "@/lib/types";
import { CopyButton } from "@/components/ui/copyButton";
import { downloadCheatsheet } from "@/lib/exportCheatsheet";
import { X, Download, Trash2, History, Clock } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: CommandHistoryItem[];
  onClearHistory: () => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
}: HistoryDrawerProps) {
  if (!isOpen) {
    return null;
  }

  const handleDownload = () => {
    downloadCheatsheet(historyItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-githubDark-card border-l border-githubDark-border h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-githubDark-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-githubDark-text">
                Session Command History
              </h3>
              <p className="text-xs text-githubDark-muted">
                {historyItems.length} command{historyItems.length === 1 ? "" : "s"} recorded
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-githubDark-muted hover:text-githubDark-text hover:bg-githubDark-surface transition-colors"
            aria-label="Close history drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Actions Toolbar */}
        <div className="p-3 bg-githubDark-deep border-b border-githubDark-borderSubtle flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gitOrange hover:bg-gitOrange-600 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cheat Sheet (.md)</span>
          </button>

          {historyItems.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-githubDark-muted hover:text-red-400 hover:bg-red-950/20 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Drawer Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyItems.length === 0 ? (
            <div className="text-center py-16 text-githubDark-muted space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40 text-gitOrange" />
              <p className="text-xs">No commands in this session yet.</p>
              <p className="text-[11px] text-githubDark-faint">
                Commands you synthesize or execute will automatically appear here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-githubDark-deep border border-githubDark-border space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-githubDark-muted font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gitOrange" />
                    {item.timestamp}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-githubDark-surface border border-githubDark-border text-githubDark-faint uppercase text-[10px]">
                    {item.source}
                  </span>
                </div>

                <div className="font-mono text-xs text-githubDark-text bg-githubDark-surface p-2 rounded-lg border border-githubDark-borderSubtle select-all">
                  $ {item.command}
                </div>

                {item.explanation && (
                  <p className="text-[11px] text-githubDark-muted leading-relaxed">
                    {item.explanation}
                  </p>
                )}

                <div className="pt-1 flex justify-end">
                  <CopyButton textToCopy={item.command} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
