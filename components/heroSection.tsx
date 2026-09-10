"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Terminal, Layers, ShieldCheck, Check } from "lucide-react";

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
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-gitOrange/10 via-gitOrange/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Hackathon Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gitOrange/30 bg-gitOrange/10 text-gitOrange text-xs font-mono mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Built for FirstCommit Hackathon</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-githubDark-text tracking-tight max-w-4xl leading-[1.15]"
        >
          Git made intuitive.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gitOrange via-orange-400 to-gitOrange">
            From plain scenario to live command.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-5 text-base sm:text-lg text-githubDark-muted max-w-2xl leading-relaxed"
        >
          Junior developers shouldn&apos;t fear Git. Pick your scenario, fill the simple fields,
          and watch exact copy-paste terminal commands synthesize live alongside real-time
          state pipelines and diagnostic recovery wizards.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#synthesis"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gitOrange hover:bg-gitOrange-600 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-gitOrange/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gitOrange"
          >
            <span>Launch Command Engine</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-githubDark-border bg-githubDark-card hover:bg-githubDark-surface text-githubDark-text font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            <Layers className="w-4 h-4 text-gitOrange" />
            <span>Explore State Pipeline</span>
          </a>
          <a
            href="#terminal"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-githubDark-border bg-githubDark-card hover:bg-githubDark-surface text-githubDark-muted hover:text-githubDark-text font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            <Terminal className="w-4 h-4 text-gitOrange" />
            <span>Interactive Terminal</span>
          </a>
        </motion.div>

        {/* Autoplay Live Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="mt-14 w-full max-w-3xl rounded-xl border border-githubDark-border bg-githubDark-card/90 shadow-2xl backdrop-blur-sm overflow-hidden text-left"
        >
          {/* Terminal Window Chrome */}
          <div className="px-4 py-3 border-b border-githubDark-border bg-githubDark-deep flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
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
                  className="text-[11px] font-mono text-gitOrange px-2 py-0.5 rounded bg-gitOrange/10 border border-gitOrange/30"
                >
                  Stage: {activeStep.currentStage}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Terminal Live Content */}
          <div className="p-5 font-mono space-y-4">
            <div className="flex items-center justify-between text-xs text-githubDark-muted border-b border-githubDark-borderSubtle pb-2">
              <span>Scenario: <strong className="text-githubDark-text">{activeStep.scenarioTitle}</strong></span>
              <span className="text-gitOrange font-medium">auto-synthesizing...</span>
            </div>

            <div className="bg-githubDark-deep/70 p-3.5 rounded-lg border border-githubDark-border/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gitOrange select-none">$</span>
                <span className="text-githubDark-text text-sm font-semibold">
                  {displayedText}
                </span>
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-gitOrange"
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-githubDark-surface border border-githubDark-border text-githubDark-muted shrink-0">
                {activeStep.copied ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Check className="w-3.5 h-3.5 text-gitOrange" />
                  </motion.span>
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-gitOrange" />
                )}
                <span>Ready</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.explanation}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-sans text-githubDark-muted flex items-start gap-2 bg-githubDark-surface/40 p-3 rounded-lg border border-githubDark-borderSubtle"
              >
                <span className="text-gitOrange font-mono font-bold text-xs shrink-0">Why:</span>
                <span className="leading-relaxed">{activeStep.explanation}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

