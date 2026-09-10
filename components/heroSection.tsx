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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#182030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Cyber Telemetry Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#182030] text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
            <span className="text-white font-cyber font-semibold">THE NIFTY PORTAL // GIT LANTERN</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px]">
            <span>[ STATUS: 200 ONLINE ]</span>
            <span>[ FREQ: 142.8 MHZ ]</span>
            <span>[ COORD: 64.1355° N, 21.8954° W ]</span>
            <span className="text-cyan-400 font-semibold">[ CLEARANCE: ALPHA-01 ]</span>
          </div>
        </div>

        {/* Hero Headline Section */}
        <div className="pt-12 pb-14 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2"
          >
            <span className="text-neutral-500">[01 // GATEWAY]</span>
            <span className="text-cyan-400 font-semibold">INTERACTIVE GIT SYNTHESIS & RECOVERY INFRASTRUCTURE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white leading-[1.0] uppercase font-cyber cyberCyanGlow"
          >
            The State of Your Git Repository.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-neutral-300 max-w-3xl leading-relaxed font-normal"
          >
            Zero guesswork. Step through the portal into verified, copy-ready terminal commands
            with live 4-stage state machine mapping, DAG commit visualization, and guided recovery decision trees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4 font-mono text-xs"
          >
            <a
              href="#synthesis"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-bold transition-all duration-150 cyberBoxGlowLarge active:scale-95 focus:outline-none focus:ring-1 focus:ring-white uppercase tracking-wider"
            >
              <span>Initialize Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 hover:bg-[#0c1018] text-white font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Inspect DAG Machine</span>
            </a>
            <a
              href="#terminal"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 hover:bg-[#0c1018] text-neutral-300 hover:text-white font-medium transition-all duration-150 uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4 text-[#f05032]" />
              <span>Sandbox Console</span>
            </a>
          </motion.div>
        </div>

        {/* The Nifty Portal Cyber Matrix Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#182030] rounded-lg overflow-hidden bg-[#040508] cyberBoxConsole cornerReticle">
          {/* Left Column: Live Telemetry & Scenario Parameters */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#182030] bg-[#07090e] flex flex-col justify-between">
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
                <span className="text-neutral-500">[TELEMETRY]</span>
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  SYNTHESIZING
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Active Scenario</span>
                <div className="text-sm font-bold text-white mt-1 font-cyber tracking-wide">
                  {activeStep.scenarioTitle}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Target Identifier</span>
                <div className="text-xs text-cyan-400 mt-1 bg-[#0b0e16] p-2 rounded border border-[#182030] font-mono">
                  {activeStep.branchInput}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Lifecycle Stage</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.currentStage}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    className="text-xs text-neutral-400 mt-1 font-mono"
                  >
                    {activeStep.currentStage}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-6 border-t border-[#182030] font-mono text-[11px] text-neutral-500">
              <div className="flex items-center justify-between">
                <span>EXEC: BASH</span>
                <span className="text-cyan-400 font-bold">STATUS: 200 OK</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cyber Terminal Window */}
          <div className="lg:col-span-8 p-6 bg-[#040508] font-mono flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 border-b border-[#182030]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/20 border border-cyan-400/40 inline-block" />
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300">PORTAL TERMINAL // LIVE PROTOCOL</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OUTPUT: READY</span>
                </div>
              </div>

              {/* Main Code Block with Line Numbers */}
              <div className="p-4 rounded-md bg-[#07090e] border border-[#182030] flex items-center justify-between gap-4 shadow-inner">
                <div className="flex items-center gap-3 overflow-x-auto text-sm font-semibold">
                  <span className="text-neutral-600 select-none text-xs">01</span>
                  <span className="text-cyan-400 select-none font-bold">$</span>
                  <span className="text-white tracking-wide font-mono">
                    {displayedText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-cyan-400 cyberBoxGlowSmall"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b0e16] border border-[#182030] text-neutral-300 shrink-0 text-xs font-mono">
                  {activeStep.copied ? (
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>VERIFIED</span>
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
                  className="p-4 rounded-md bg-[#07090e] border border-[#182030] text-xs leading-relaxed text-neutral-300 flex items-start gap-2.5"
                >
                  <CornerDownRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold uppercase tracking-wider mr-2 font-mono">
                      Mental Model:
                    </span>
                    <span>{activeStep.explanation}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-6 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>SANDBOX: ISOLATED</span>
              <span className="text-neutral-400">PORTAL PASS: VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
