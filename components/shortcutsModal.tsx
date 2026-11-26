"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  action: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  { keys: ["Ctrl", "K"], action: "Open Command Palette", category: "Navigation" },
  { keys: ["C"], action: "Copy active command to clipboard", category: "Commands" },
  { keys: ["1"], action: "Focus Stage 1: Working Directory", category: "Navigation" },
  { keys: ["2"], action: "Focus Stage 2: Staging Index", category: "Navigation" },
  { keys: ["3"], action: "Focus Stage 3: Local Repository", category: "Navigation" },
  { keys: ["4"], action: "Focus Stage 4: Remote Upstream", category: "Navigation" },
  { keys: ["?"], action: "Open keyboard shortcuts", category: "Help" },
  { keys: ["Esc"], action: "Close any open modal or panel", category: "Navigation" },
];

const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#101010] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black border-b border-[#27272a] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#2997FF]" />
                <span className="text-sm font-semibold text-white">
                  Keyboard Shortcuts
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#86868b] hover:text-white transition-colors focus:outline-none"
                aria-label="Close shortcuts"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-1">
              {categories.map((category) => (
                <div key={category}>
                  <p className="font-mono text-[10px] text-[#86868b] uppercase tracking-widest py-2">
                    {category}
                  </p>
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between py-2 border-b border-[#27272a]/70 last:border-0"
                      >
                        <span className="text-sm text-[#afafaf]">{shortcut.action}</span>
                        <div className="flex items-center gap-1 shrink-0 ml-3">
                          {shortcut.keys.map((key, idx) => (
                            <React.Fragment key={key}>
                              {idx > 0 && (
                                <span className="text-[#6e6e73] text-[10px] font-mono">+</span>
                              )}
                              <kbd className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-black border border-[#27272a] text-[#2997FF]">
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 pt-2 border-t border-[#27272a]">
              <p className="text-[11px] font-mono text-[#86868b] text-center">
                Press{" "}
                <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-black border border-[#27272a] text-[#afafaf]">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
