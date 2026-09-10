"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Layers,
  ShieldCheck,
  Check,
  Cpu,
  CornerDownRight,
} from "lucide-react";

interface HeroPreviewState {
  scenarioTitle: string;
  branchInput: string;
  commandText: string;
  explanation: string;
  currentStage: string;
  copied: boolean;
}

const previewCycleSteps: HeroPreviewState[] = [
  {
    scenarioTitle: "FEATURE WORKFLOW",
    branchInput: "feature/payment-gate",
    commandText: "git checkout -b feature/payment-gate",
    explanation: "Creates isolated feature branch and re-points HEAD instantly.",
    currentStage: "STAGE 01 // WORKING TREE",
    copied: false,
  },
  {
    scenarioTitle: "INDEX PREPARATION",
    branchInput: "feature/payment-gate",
    commandText: "git add src/payments/checkout.tsx",
    explanation: "Curates modified blobs into Git's preparation index.",
    currentStage: "STAGE 02 // STAGING INDEX",
    copied: true,
  },
  {
    scenarioTitle: "COMMIT SNAPSHOT",
    branchInput: "feature/payment-gate",
    commandText: 'git commit -m "feat: connect stripe checkout webhook"',
    explanation: "Permanently records verified snapshot into local DAG graph.",
    currentStage: "STAGE 03 // LOCAL REPO",
    copied: false,
  },
  {
    scenarioTitle: "REMOTE SYNCHRONIZATION",
    branchInput: "feature/payment-gate",
    commandText: "git push -u origin feature/payment-gate",
    explanation: "Broadcasts branch commits to cloud upstream with tracking.",
    currentStage: "STAGE 04 // REMOTE ORIGIN",
    copied: true,
  },
];

export function HeroSection() {
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const activeStep = previewCycleSteps[cycleIndex];

  useEffect(() => {
    let currentPos = 0;
    const fullText = activeStep.commandText;
    setDisplayedText("");
    setIsTyping(true);

    const typewriterInterval = setInterval(() => {
      if (currentPos < fullText.length) {
        setDisplayedText(fullText.substring(0, currentPos + 1));
        currentPos += 1;
      } else {
        setIsTyping(false);
        clearInterval(typewriterInterval);
      }
    }, 40);

    const advanceTimer = setTimeout(() => {
      setCycleIndex((prev) => (prev + 1) % previewCycleSteps.length);
    }, 4000);

    return () => {
      clearInterval(typewriterInterval);
      clearTimeout(advanceTimer);
    };
  }, [cycleIndex, activeStep.commandText]);

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[#182030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Top Status Tag */}
        <div className="flex items-center justify-between pb-4 border-b border-[#182030]/60 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
            <span className="text-white font-medium">Git Lantern</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">Visual Git Learning & Synthesis</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-medium">● 4 Stages Synced</span>
            <span className="text-neutral-500">100% Client-Side</span>
          </div>
        </div>

        {/* Hero Headline Section */}
        <div className="pt-10 pb-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono">
              <span>✦</span>
              <span>Interactive Git Workflow & Command Engine</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-cyber"
          >
            Understand Git <span className="text-cyan-400">Visually.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed"
          >
            No more dreading merge conflicts or guessing command flags. Choose your scenario,
            customize your branch and files, and receive verified, copy-ready commands with clear mental models.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs"
          >
            <a
              href="#synthesis"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-bold transition-all duration-150 cyberBoxGlowSmall active:scale-95 uppercase tracking-wider"
            >
              <span>Synthesize Commands</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 hover:bg-[#0c1018] text-white font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>State Pipeline</span>
            </a>
            <a
              href="#terminal"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 hover:bg-[#0c1018] text-neutral-300 hover:text-white font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4 text-[#f05032]" />
              <span>Terminal Sandbox</span>
            </a>
          </motion.div>
        </div>

        {/* Clean Interactive Preview Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#182030] rounded-xl overflow-hidden bg-[#040508] shadow-xl">
          {/* Left Column: Live Context */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-[#182030] bg-[#07090e] flex flex-col justify-between">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#182030]">
                <span className="text-neutral-400 font-medium">Scenario Preview</span>
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live Cycle
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Current Workflow</span>
                <div className="text-sm font-bold text-white mt-0.5 font-cyber">
                  {activeStep.scenarioTitle}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Branch Identifier</span>
                <div className="text-xs text-cyan-400 mt-0.5 bg-[#0b0e16] px-2.5 py-1.5 rounded border border-[#182030] font-mono">
                  {activeStep.branchInput}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Storage Stage</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.currentStage}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    className="text-xs text-neutral-300 mt-0.5 font-mono"
                  >
                    {activeStep.currentStage}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-4 border-t border-[#182030] font-mono text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Auto-updating</span>
              <span className="text-cyan-400">Step {cycleIndex + 1} of {previewCycleSteps.length}</span>
            </div>
          </div>

          {/* Right Column: Interactive Code Terminal */}
          <div className="lg:col-span-8 p-5 bg-[#040508] font-mono flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#182030]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 inline-block" />
                  <span className="text-[11px] font-medium text-neutral-300">Generated Command</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shell: Bash / Zsh</span>
                </div>
              </div>

              {/* Main Code Block */}
              <div className="p-3.5 rounded-lg bg-[#07090e] border border-[#182030] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 overflow-x-auto text-sm font-medium">
                  <span className="text-cyan-400 font-bold select-none">$</span>
                  <span className="text-white tracking-wide font-mono">
                    {displayedText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-cyan-400"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b0e16] border border-[#182030] text-xs font-mono shrink-0">
                  {activeStep.copied ? (
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Mental Model Context Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.explanation}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-lg bg-[#07090e] border border-[#182030] text-xs leading-relaxed text-neutral-300 flex items-start gap-2.5"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold uppercase tracking-wider mr-2 font-mono text-[10px]">
                      Mental Model:
                    </span>
                    <span>{activeStep.explanation}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Ready for copy & execution</span>
              <span className="text-neutral-400">Press C to copy active command</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
