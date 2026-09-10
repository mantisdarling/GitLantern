"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, SlidersHorizontal, GitBranch, Terminal, X } from "lucide-react";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSeenKey = "gitlanternTourSeen";

const tourSteps = [
  {
    id: "scenarioPicker",
    title: "Choose Your Scenario",
    description:
      "Start by picking a real-world Git workflow from the Scenario Matrix — from pushing your first repo to hotfixing production. Each scenario is pre-filled with realistic paths like feature/login-page, ready to go immediately.",
    icon: <Layers className="w-6 h-6" />,
    targetHint: "Scenario selector chips at the top of the Synthesis Engine",
    step: 1,
  },
  {
    id: "parameterDeck",
    title: "Customize Your Parameters",
    description:
      "The Parameter Deck on the left pre-fills with realistic values like feature/login-page and src/auth/LoginForm.tsx. Edit any field and every command updates live — no template guessing or placeholder hunting.",
    icon: <SlidersHorizontal className="w-6 h-6" />,
    targetHint: "Left form panel inside the Synthesis Engine section",
    step: 2,
  },
  {
    id: "dagMachine",
    title: "Track File State in Real-Time",
    description:
      "The DAG State Machine shows exactly where your files live across four stages: Working Directory → Staging Index → Local Repository → Remote Upstream. Click any stage to inspect available commands at that layer.",
    icon: <GitBranch className="w-6 h-6" />,
    targetHint: "DAG State Pipeline section below the Synthesis Engine",
    step: 3,
  },
  {
    id: "commandDeck",
    title: "Copy Commands & Learn Why",
    description:
      "Every generated command has a one-click Copy button and a 'Why this command?' toggle that explains each flag in plain English. No more guessing what -b or --force-with-lease mean. Press C to copy the active command anytime.",
    icon: <Terminal className="w-6 h-6" />,
    targetHint: "Command cards on the right side of the Synthesis Engine",
    step: 4,
  },
];

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(tourSeenKey, "1");
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = tourSteps[currentStep];
  const progressPercent = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#040508] border border-[#182030] rounded-xl shadow-2xl cornerReticle cyberBoxGlowMedium overflow-hidden"
          >
            {/* Top bar */}
            <div className="bg-[#07090e] border-b border-[#182030] px-5 py-3 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-cyan-400 uppercase tracking-widest">
                PORTAL ONBOARDING // SPEC 2200
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-neutral-500">
                  {currentStep + 1} of {tourSteps.length}
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-[#182030]">
              <motion.div
                className="h-full bg-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-6"
              >
                {/* Step icon */}
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 cyberBoxGlowSmall mb-4">
                  {step.icon}
                </div>

                <h2 className="font-cyber text-xl font-bold text-white tracking-wide mb-2">
                  {step.title}
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed font-tech mb-4">
                  {step.description}
                </p>

                {/* Target hint */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-400/20 text-xs font-mono text-cyan-400/80">
                  <span className="shrink-0 text-cyan-400/50">[TARGET]</span>
                  <span>{step.targetHint}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg border border-[#182030] bg-[#07090e] text-neutral-300 hover:border-cyan-400/50 text-xs font-mono transition-all focus:outline-none"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-lg bg-cyan-400 text-black font-cyber font-bold text-xs uppercase tracking-wider cyberBoxGlowSmall hover:bg-cyan-300 transition-all focus:outline-none"
                >
                  {currentStep < tourSteps.length - 1 ? "Next" : "Launch Portal"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
