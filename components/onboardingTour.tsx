"use client";

import React, { useState } from "react";
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
    title: "Pick a task",
    description:
      "Start by selecting a Git task at the top, such as starting a new branch, undoing a commit, or fixing a hotfix. Each one loads with realistic example paths.",
    icon: <Layers className="w-6 h-6" />,
    targetHint: "Task tabs at the top of Command Generator",
    step: 1,
  },
  {
    id: "parameterDeck",
    title: "Edit branch and file names",
    description:
      "Change the branch name, file path, or commit message on the left and watch every command update right away.",
    icon: <SlidersHorizontal className="w-6 h-6" />,
    targetHint: "Scenario Parameters panel on the left",
    step: 2,
  },
  {
    id: "dagMachine",
    title: "See where files live",
    description:
      "The pipeline tracks files across four places: your working folder, the staging area, your local repo, and the remote server. Click any stage to see how to move forward or undo.",
    icon: <GitBranch className="w-6 h-6" />,
    targetHint: "Where Your Files Live section below",
    step: 3,
  },
  {
    id: "commandDeck",
    title: "Copy and check flags",
    description:
      "Click Copy on any command or press C on your keyboard. Open 'Why this command?' below a card to read what each flag does.",
    icon: <Terminal className="w-6 h-6" />,
    targetHint: "Command cards on the right",
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
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg glossyCard rounded-[24px] overflow-hidden"
          >
            {/* Top bar */}
            <div className="bg-slate-50/90 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#2563EB] uppercase tracking-wider font-semibold">
                Quick Tour
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-[#64748B]">
                  {currentStep + 1} of {tourSteps.length}
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[#64748B] hover:text-[#0B1221] transition-colors focus:outline-none"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
              <motion.div
                className="h-full bg-[#2563EB]"
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
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mb-4">
                  {step.icon}
                </div>

                <h2 className="text-xl font-bold text-[#0B1221] tracking-tight mb-2">
                  {step.title}
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Target hint */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono text-[#2563EB]">
                  <span className="shrink-0 text-[#64748B]">Location:</span>
                  <span>{step.targetHint}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-mono text-[#64748B] hover:text-[#0B1221] transition-colors focus:outline-none"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 rounded-full glossyButtonLight text-xs font-medium transition-all focus:outline-none"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-full glossyButtonDark font-semibold text-xs transition-all focus:outline-none"
                >
                  {currentStep < tourSteps.length - 1 ? "Next" : "Get Started"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
