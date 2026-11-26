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
        "Git Lantern Terminal Simulator v1.0\nType Git commands (e.g. 'git status', 'git add .', 'git log') or paste a real error message.\nPro-tip: Press TAB for autocompletion and UP/DOWN arrows for command history.",
      type: "system",
      timestamp: "09:00",
    },
  ]);

  const [pastedErrorInput, setPastedErrorInput] = useState<string>("");
  const [pasteMatchMessage, setPasteMatchMessage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (entries.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
    <section id="terminal" className="commonPadding scroll-mt-16 bg-white border-t border-slate-200/70">
      <div className="screenMaxWidth">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="sectionHeading">
              Terminal Sandbox
            </h2>
            <p className="sectionSubheading mt-4">
              Test Git commands safely in the browser with tab autocomplete, or paste an error message from your terminal to jump to the matching fix.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80">
              <span className="text-[#2563EB] font-semibold">HEAD: {gitState.currentBranch}</span>
            </span>
          </div>
        </div>

        {/* Real Error Parser Input Box */}
        <div className="mb-8 p-5 rounded-md archSubCard flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#0B1221] shrink-0 font-mono">
            <ClipboardPaste className="w-4 h-4 text-[#2563EB]" />
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
              className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#0B1221] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
            />
            <button
              type="button"
              onClick={handlePastedErrorParse}
              className="px-5 py-2 rounded-full archBtnPrimary text-xs font-semibold transition-colors focus:outline-none shrink-0"
            >
              Analyze
            </button>
          </div>
          {pasteMatchMessage && (
            <div className="text-xs font-mono text-[#2563EB] animate-in fade-in">
              {pasteMatchMessage}
            </div>
          )}
        </div>

        {/* Terminal Window */}
        <div className="relative">
          <div className="rounded-md overflow-hidden font-mono archCard">
            {/* Titlebar */}
            <div className="px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
                <span className="ml-2 text-xs text-[#64748B]">
                  sh ~/gitlantern ({gitState.currentBranch})
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

          {/* Terminal Body with Subtle CRT Scanline Effect */}
          <div className="p-5 min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 text-xs bg-[#020306] crtScanlines">
            {entries.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.command !== "welcome" && (
                  <div className="flex items-center gap-2 text-neutral-400 font-mono">
                    <span className="text-cyan-400 font-bold">gitlantern:</span>
                    <span className="text-cyan-400/80">({gitState.currentBranch})</span>
                    <span className="text-white font-semibold">$ {item.command}</span>
                  </div>
                )}
                {item.output && (
                  <div
                    className={`whitespace-pre-wrap leading-relaxed pl-2 border-l-2 font-mono ${
                      item.type === "error"
                        ? "text-red-400 border-red-500/40"
                        : item.type === "system"
                        ? "text-cyan-400 border-cyan-400/40"
                        : "text-neutral-300 border-[#182030]"
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
          <div className="p-3 bg-[#07090e] border-t border-[#182030] flex items-center gap-2">
            <span className="text-cyan-400 font-bold select-none pl-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Git command (TAB autocomplete, UP/DOWN history, e.g. git status)..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => handleCommandSubmit(inputCommand)}
              className="p-1.5 rounded-md bg-cyan-400 text-black hover:bg-cyan-300 transition-colors cyberBoxGlowSmall"
              aria-label="Send command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="px-4 py-2.5 bg-[#040508] border-t border-[#182030] flex items-center justify-between gap-2 overflow-x-auto text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-neutral-500 font-mono">Try:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleCommandSubmit(preset)}
                  className="px-2 py-0.5 rounded bg-[#07090e] hover:bg-[#0c1018] text-neutral-300 hover:text-cyan-400 border border-[#182030] hover:border-cyan-400/40 shrink-0 transition-colors flex items-center gap-1 font-mono"
                >
                  <span>{preset}</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-neutral-500 shrink-0 font-mono">
              <kbd className="px-1.5 py-0.2 rounded bg-[#07090e] border border-[#182030]">TAB</kbd>
              <span>autocomplete</span>
              <kbd className="px-1.5 py-0.2 rounded bg-[#07090e] border border-[#182030]">↑↓</kbd>
              <span>history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
