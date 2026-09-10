"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  initialSimulatedState,
  executeSimulatedCommand,
  detectErrorSignature,
  SimulatedGitState,
} from "@/lib/terminalCommands";
import { TerminalEntry } from "@/lib/types";
import { sounds } from "@/lib/soundEffects";
import { Terminal, Send, Trash2, ArrowUpRight, ClipboardPaste } from "lucide-react";

interface TerminalSimulatorProps {
  onMatchedDiagnostic: (diagnosticId: string) => void;
  onRecordCommand?: (command: string, explanation: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

const autocompletions = [
  "git status",
  "git add .",
  "git add -A",
  "git commit -m",
  "git branch",
  "git checkout -b",
  "git checkout",
  "git log --oneline",
  "git log",
  "git diff",
  "git push",
  "git stash",
  "git stash pop",
  "clear",
  "help",
];

export function TerminalSimulator({
  onMatchedDiagnostic,
  onRecordCommand,
  onUnlockBadge,
}: TerminalSimulatorProps) {
  const [gitState, setGitState] = useState<SimulatedGitState>(initialSimulatedState);
  const [inputCommand, setInputCommand] = useState<string>("");
  const [commandCount, setCommandCount] = useState<number>(0);
  const [commandHistoryStack, setCommandHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: "entry-init",
      command: "welcome",
      output:
        "Git Lantern Terminal Simulator v1.0 [FirstCommit Hackathon Edition]\nType Git commands (e.g. 'git status', 'git add .', 'git log') or paste a real error message.\nPro-tip: Press TAB for autocompletion and UP/DOWN arrows for command history.",
      type: "system",
      timestamp: "09:00",
    },
  ]);

  const [pastedErrorInput, setPastedErrorInput] = useState<string>("");
  const [pasteMatchMessage, setPasteMatchMessage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const handleCommandSubmit = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) {
      return;
    }

    sounds.playClick();

    if (trimmed === "clear") {
      setEntries([]);
      setInputCommand("");
      setCommandHistoryStack((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);
      return;
    }

    const result = executeSimulatedCommand(trimmed, gitState);
    setGitState(result.newState);

    const newEntry: TerminalEntry = {
      id: "entry-" + Date.now(),
      command: trimmed,
      output: result.output,
      type: result.matchedDiagnosticId ? "error" : "success",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setEntries((prev) => [...prev, newEntry]);
    setCommandHistoryStack((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);
    setInputCommand("");

    if (!result.matchedDiagnosticId) {
      sounds.playSuccess();
    }

    const newCount = commandCount + 1;
    setCommandCount(newCount);
    if (newCount >= 5 && onUnlockBadge) {
      onUnlockBadge("terminalApprentice");
    }

    if (onRecordCommand) {
      onRecordCommand(trimmed, "Executed via Interactive Terminal");
    }

    if (result.matchedDiagnosticId) {
      onMatchedDiagnostic(result.matchedDiagnosticId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommandSubmit(inputCommand);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistoryStack.length === 0) {
        return;
      }
      const nextIdx = Math.min(historyIndex + 1, commandHistoryStack.length - 1);
      setHistoryIndex(nextIdx);
      setInputCommand(commandHistoryStack[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputCommand("");
      } else {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputCommand(commandHistoryStack[prevIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputCommand.trim().toLowerCase();
      if (!current) {
        return;
      }
      const match = autocompletions.find((cmd) => cmd.startsWith(current));
      if (match) {
        setInputCommand(match);
        sounds.playClick();
      }
    }
  };

  const handlePastedErrorParse = () => {
    if (!pastedErrorInput.trim()) {
      return;
    }
    sounds.playClick();
    const match = detectErrorSignature(pastedErrorInput);
    if (match) {
      setPasteMatchMessage(`Matched: ${match.title}! Scrolling to diagnostic card...`);
      onMatchedDiagnostic(match.id);
      setTimeout(() => {
        setPasteMatchMessage(null);
        setPastedErrorInput("");
      }, 3500);
    } else {
      setPasteMatchMessage(
        "Could not detect a specific failure signature. Try running through the Guided Undo Wizard!"
      );
    }
  };

  const quickPresets = [
    "git status",
    "git add .",
    'git commit -m "feat: scaffold"',
    "git branch",
    "git log --oneline",
    "git push",
  ];

  return (
    <section id="terminal" className="py-16 scroll-mt-20 border-t border-githubDark-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gitOrange mb-2">
              <Terminal className="w-4 h-4" />
              <span>POWER TOOL : INTERACTIVE TERMINAL & ERROR PARSER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-githubDark-text tracking-tight">
              Interactive Terminal Simulator
            </h2>
            <p className="text-sm text-githubDark-muted mt-1 max-w-2xl">
              Practice real Git commands in an isolated sandbox with history and autocompletion, or paste real terminal errors to auto-match diagnostic solutions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-githubDark-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gitOrange inline-block animate-pulse" />
              <span>Branch: ({gitState.currentBranch})</span>
            </span>
          </div>
        </div>

        {/* Real Error Parser Input Box */}
        <div className="mb-6 p-4 rounded-2xl glassCard flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-xs text-githubDark-text shrink-0">
            <ClipboardPaste className="w-4 h-4 text-gitOrange" />
            <span className="font-semibold">Paste Real Git Error:</span>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={pastedErrorInput}
              onChange={(e) => setPastedErrorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePastedErrorParse();
                }
              }}
              placeholder="e.g. fatal: refusing to merge unrelated histories or error: failed to push some refs"
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-githubDark-deep border border-githubDark-border text-githubDark-text placeholder:text-githubDark-faint focus:outline-none focus:border-gitOrange"
            />
            <button
              type="button"
              onClick={handlePastedErrorParse}
              className="px-3.5 py-1.5 rounded-lg bg-gitOrange hover:bg-gitOrange-600 text-white text-xs font-medium transition-colors focus:outline-none shrink-0"
            >
              Analyze
            </button>
          </div>
          {pasteMatchMessage && (
            <div className="text-xs font-mono text-gitOrange animate-in fade-in">
              {pasteMatchMessage}
            </div>
          )}
        </div>

        {/* Terminal Chrome Window with Atmospheric Halo */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gitOrange/20 via-orange-500/10 to-gitOrange/20 rounded-3xl blur-xl -z-10 opacity-70 pointer-events-none" />

          <div className="rounded-2xl border border-githubDark-border bg-githubDark-deep shadow-2xl overflow-hidden font-mono ring-1 ring-white/5">
            {/* Titlebar */}
            <div className="px-4 py-3 border-b border-githubDark-border bg-githubDark-card/95 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                <span className="ml-2 text-xs text-githubDark-muted">
                  bash — ~/gitlantern ({gitState.currentBranch})
                </span>
              </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setEntries([]);
                }}
                className="text-githubDark-muted hover:text-githubDark-text text-xs flex items-center gap-1 transition-colors"
                title="Clear screen"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-5 min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 text-xs">
            {entries.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.command !== "welcome" && (
                  <div className="flex items-center gap-2 text-githubDark-muted">
                    <span className="text-gitOrange font-bold">gitlantern:</span>
                    <span className="text-gitOrange/80">({gitState.currentBranch})</span>
                    <span className="text-githubDark-text font-semibold">$ {item.command}</span>
                  </div>
                )}
                {item.output && (
                  <div
                    className={`whitespace-pre-wrap leading-relaxed pl-2 border-l-2 ${
                      item.type === "error"
                        ? "text-red-400 border-red-500/40"
                        : item.type === "system"
                        ? "text-gitOrange border-gitOrange/40"
                        : "text-githubDark-text border-githubDark-border"
                    }`}
                  >
                    {item.output}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Interactive Command Input Line */}
          <div className="p-3 bg-githubDark-card/60 border-t border-githubDark-border flex items-center gap-2">
            <span className="text-gitOrange font-bold select-none pl-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Git command (TAB autocomplete, UP/DOWN history, e.g. git status)..."
              className="flex-1 bg-transparent text-xs text-githubDark-text placeholder:text-githubDark-faint focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleCommandSubmit(inputCommand)}
              className="p-1.5 rounded-md bg-gitOrange text-white hover:bg-gitOrange-600 transition-colors"
              aria-label="Send command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="px-4 py-2.5 bg-githubDark-deep border-t border-githubDark-borderSubtle flex items-center justify-between gap-2 overflow-x-auto text-[11px] text-githubDark-muted">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-githubDark-faint">Try:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleCommandSubmit(preset)}
                  className="px-2 py-0.5 rounded bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-text border border-githubDark-border shrink-0 transition-colors flex items-center gap-1"
                >
                  <span>{preset}</span>
                  <ArrowUpRight className="w-3 h-3 text-gitOrange" />
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-githubDark-faint shrink-0">
              <kbd className="px-1.5 py-0.2 rounded bg-githubDark-surface border border-githubDark-border">TAB</kbd>
              <span>autocomplete</span>
              <kbd className="px-1.5 py-0.2 rounded bg-githubDark-surface border border-githubDark-border">↑↓</kbd>
              <span>history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
