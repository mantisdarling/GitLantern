"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Layers,
  ShieldCheck,
  Check,
  Zap,
  HelpCircle,
  Command,
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
    scenarioTitle: "Starting a New Feature",
    branchInput: "feature/payment-gate",
    commandText: "git checkout -b feature/payment-gate",
    explanation: "Creates and switches to an isolated branch for the payment gate.",
    currentStage: "Working Directory",
    copied: false,
  },
  {
    scenarioTitle: "Staging Modified Files",
    branchInput: "feature/payment-gate",
    commandText: "git add src/payments/checkout.tsx",
    explanation: "Moves the modified checkout code into Git's preparation index.",
    currentStage: "Staging Area",
    copied: true,
  },
  {
    scenarioTitle: "Committing Snapshot",
    branchInput: "feature/payment-gate",
    commandText: 'git commit -m "feat: connect stripe checkout webhook"',
    explanation: "Permanently records your verified staged changes into the local commit history.",
    currentStage: "Local Repository",
    copied: false,
  },
  {
    scenarioTitle: "Publishing to GitHub",
    branchInput: "feature/payment-gate",
    commandText: "git push -u origin feature/payment-gate",
    explanation: "Uploads commits to the remote cloud server and establishes upstream tracking.",
    currentStage: "Remote Server",
    copied: true,
  },
];

export function HeroSection() {
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const activeStep = previewCycleSteps[cycleIndex];

  // Auto-playing live typewriter preview
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
    }, 45);

    const advanceTimer = setTimeout(() => {
      setCycleIndex((prev) => (prev + 1) % previewCycleSteps.length);
    }, 4200);

    return () => {
      clearInterval(typewriterInterval);
      clearTimeout(advanceTimer);
    };
  }, [cycleIndex, activeStep.commandText]);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-28">
      {/* Background Ambient Conic Halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-gradient-to-b from-gitOrange/15 via-gitOrange/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
        {/* Hackathon Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="shimmerSweep inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gitOrange/35 bg-githubDark-card/80 backdrop-blur-md text-gitOrange text-xs font-mono mb-6 shadow-lg shadow-gitOrange/5"
        >
          <span className="w-2 h-2 rounded-full bg-gitOrange animate-ping inline-block" />
          <span className="font-semibold tracking-wide">FirstCommit Hackathon Winner Entry</span>
          <span className="text-githubDark-border select-none">•</span>
          <span className="text-githubDark-muted">Git Synthesis Engine</span>
        </motion.div>

        {/* Hero Title with Sculpted Gradient Mask */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.035em] max-w-4xl leading-[1.08]"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
            Master Git without
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-gitOrange to-orange-400 font-black">
            the fear of breaking things.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-base sm:text-lg md:text-xl text-githubDark-muted max-w-2xl leading-relaxed font-normal"
        >
          Turns plain everyday developer scenarios into exact, copy-paste ready terminal commands
          with live state mapping, visual branch trees, and interactive recovery wizards.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <a
            href="#synthesis"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gitOrange hover:bg-gitOrange-600 text-white font-semibold text-sm transition-all duration-150 shadow-xl shadow-gitOrange/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gitOrange glowAccent"
          >
            <span>Launch Command Engine</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glassCardInteractive text-githubDark-text font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            <Layers className="w-4 h-4 text-gitOrange" />
            <span>State Pipeline & Tree</span>
          </a>
          <a
            href="#terminal"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glassCardInteractive text-githubDark-muted hover:text-githubDark-text font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            <Terminal className="w-4 h-4 text-gitOrange" />
            <span>Sandbox Terminal</span>
          </a>
        </motion.div>

        {/* Micro-Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-githubDark-muted font-mono"
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gitOrange" />
            <span>Typewriter Live Generation</span>
          </div>
          <span className="text-githubDark-border select-none hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gitOrange" />
            <span>4-Stage State Pipeline</span>
          </div>
          <span className="text-githubDark-border select-none hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-gitOrange" />
            <span>Guided Undo Wizard</span>
          </div>
          <span className="text-githubDark-border select-none hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-gitOrange" />
            <span>Cmd+K Palette</span>
          </div>
        </motion.div>

        {/* Autoplay Live Preview Card with Illuminated Halo */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="mt-12 w-full max-w-3xl relative"
        >
          {/* Subtle Orange Atmospheric Glow Behind Terminal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gitOrange/20 via-orange-500/10 to-gitOrange/20 rounded-2xl blur-xl -z-10 opacity-70 pointer-events-none" />

          <div className="w-full rounded-2xl border border-githubDark-border bg-githubDark-card/90 shadow-2xl backdrop-blur-xl overflow-hidden text-left ring-1 ring-white/5">
            {/* Terminal Window Chrome */}
            <div className="px-4 py-3 border-b border-githubDark-border bg-githubDark-deep/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                <span className="ml-3 text-xs font-mono text-githubDark-muted">
                  live preview : {activeStep.scenarioTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeStep.currentStage}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-[11px] font-mono text-gitOrange px-2.5 py-0.5 rounded-md bg-gitOrange/10 border border-gitOrange/30 font-medium"
                  >
                    Stage: {activeStep.currentStage}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Terminal Live Content */}
            <div className="p-5 font-mono space-y-4">
              <div className="flex items-center justify-between text-xs text-githubDark-muted border-b border-githubDark-borderSubtle pb-2.5">
                <span>Scenario: <strong className="text-githubDark-text font-semibold">{activeStep.scenarioTitle}</strong></span>
                <span className="text-gitOrange font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gitOrange animate-pulse" />
                  auto-synthesizing
                </span>
              </div>

              <div className="bg-githubDark-deep/90 p-4 rounded-xl border border-githubDark-border flex items-center justify-between gap-4 shadow-inner">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-gitOrange select-none font-bold">$</span>
                  <span className="text-githubDark-text text-sm font-semibold tracking-wide">
                    {displayedText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.85, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-gitOrange shadow-sm shadow-gitOrange"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-githubDark-surface border border-githubDark-border text-githubDark-muted shrink-0 font-sans">
                  {activeStep.copied ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Check className="w-3.5 h-3.5 text-gitOrange" />
                    </motion.span>
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-gitOrange" />
                  )}
                  <span className="text-[11px] font-medium">Ready</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.explanation}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-sans text-githubDark-muted flex items-start gap-2.5 bg-githubDark-surface/50 p-3.5 rounded-xl border border-githubDark-borderSubtle"
                >
                  <span className="text-gitOrange font-mono font-bold text-xs shrink-0 mt-0.5">Why:</span>
                  <span className="leading-relaxed text-githubDark-text/90">{activeStep.explanation}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
