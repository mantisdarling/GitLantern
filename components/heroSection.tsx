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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#1e2330]">
      {/* Mesh3D / Cerebrium Technical Matrix Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Technical Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1e2330] text-[11px] font-mono text-githubDark-muted uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f05032] animate-pulse inline-block" />
            <span className="text-[#f0f6fc]">GIT LANTERN // DEV TOOLS</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>[ SYSTEM: OPERATIONAL ]</span>
            <span>[ LATENCY: 0MS ]</span>
            <span>[ REGION: GLOBAL EDGE ]</span>
            <span className="text-[#f05032] font-semibold">[ FIRSTCOMMIT 2026 ]</span>
          </div>
        </div>

        {/* Hero Headline Section */}
        <div className="pt-12 pb-14 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono uppercase tracking-widest text-[#f05032] mb-4 flex items-center gap-2"
          >
            <span className="text-githubDark-faint">[01]</span>
            <span>INTERACTIVE GIT SYNTHESIS & RECOVERY INFRASTRUCTURE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-[#f0f6fc] leading-[1.0] uppercase font-display"
          >
            The State of Your Git Repository.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-githubDark-muted max-w-3xl leading-relaxed font-normal"
          >
            Zero guesswork. Transform plain scenarios into verified copy-ready terminal commands
            with live state mapping, DAG commit visualization, and guided recovery decision trees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4 font-mono text-xs"
          >
            <a
              href="#synthesis"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#f05032] hover:bg-[#ea580c] text-white font-bold transition-all duration-150 shadow-lg shadow-[#f05032]/20 active:scale-95 focus:outline-none focus:ring-1 focus:ring-white uppercase tracking-wider"
            >
              <span>Initialize Engine</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-[#f0f6fc] font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Layers className="w-4 h-4 text-[#f05032]" />
              <span>Inspect DAG Pipeline</span>
            </a>
            <a
              href="#terminal"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md border border-[#1e2330] bg-[#0f131a] hover:bg-[#141923] text-githubDark-muted hover:text-[#f0f6fc] font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4 text-[#f05032]" />
              <span>Sandbox Console</span>
            </a>
          </motion.div>
        </div>

        {/* Cerebrium-style Two-Column Live Console Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#1e2330] rounded-lg overflow-hidden bg-[#08090d] shadow-2xl">
          {/* Left Column: Live Telemetry & Scenario Parameters */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#1e2330] bg-[#0b0e14] flex flex-col justify-between">
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2330]">
                <span className="text-githubDark-faint">[TELEMETRY]</span>
                <span className="text-[#f05032] flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f05032] animate-ping" />
                  SYNTHESIZING
                </span>
              </div>

              <div>
                <span className="text-[10px] text-githubDark-faint uppercase block">Active Scenario</span>
                <div className="text-sm font-bold text-[#f0f6fc] mt-1">
                  {activeStep.scenarioTitle}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-githubDark-faint uppercase block">Target Identifier</span>
                <div className="text-xs text-[#f05032] mt-1 bg-[#141923] p-2 rounded border border-[#1e2330]">
                  {activeStep.branchInput}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-githubDark-faint uppercase block">Lifecycle Stage</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.currentStage}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    className="text-xs text-githubDark-muted mt-1"
                  >
                    {activeStep.currentStage}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1e2330] font-mono text-[11px] text-githubDark-faint">
              <div className="flex items-center justify-between">
                <span>EXEC: BASH</span>
                <span>STATUS: 200 OK</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Terminal Window */}
          <div className="lg:col-span-8 p-6 bg-[#08090d] font-mono flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-githubDark-muted pb-3 border-b border-[#1e2330]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#1e2330] border border-white/20 inline-block" />
                  <span className="text-[11px] uppercase tracking-wider">TERMINAL // LIVE EXECUTION</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Cpu className="w-3.5 h-3.5 text-[#f05032]" />
                  <span>OUTPUT: READY</span>
                </div>
              </div>

              {/* Main Code Block with Line Numbers */}
              <div className="p-4 rounded-md bg-[#0f131a] border border-[#1e2330] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto text-sm font-semibold">
                  <span className="text-githubDark-faint select-none text-xs">01</span>
                  <span className="text-[#f05032] select-none">$</span>
                  <span className="text-[#f0f6fc] tracking-wide">
                    {displayedText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-[#f05032]"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141923] border border-[#1e2330] text-githubDark-muted shrink-0 text-xs font-mono">
                  {activeStep.copied ? (
                    <span className="flex items-center gap-1 text-[#f05032]">
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#f05032]" />
                      <span>VALID</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Mental Model Context Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.explanation}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-md bg-[#0b0e14] border border-[#1e2330] text-xs leading-relaxed text-githubDark-muted flex items-start gap-2.5"
                >
                  <CornerDownRight className="w-4 h-4 text-[#f05032] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#f0f6fc] font-bold uppercase tracking-wider mr-2 font-mono">
                      Mental Model:
                    </span>
                    <span>{activeStep.explanation}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-6 border-t border-[#1e2330] flex items-center justify-between text-[11px] font-mono text-githubDark-faint">
              <span>SANDBOX: ISOLATED</span>
              <span>100% GUEST ACCESSIBLE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
