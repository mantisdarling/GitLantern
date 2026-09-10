"use client";

import React, { useState } from "react";
import { wizardQuestions } from "@/lib/diagnosticsData";
import { WizardQuestion } from "@/lib/types";
import { HelpCircle, Check, RotateCcw, ArrowRight, Sparkles } from "lucide-react";

interface UndoWizardProps {
  onSelectDiagnostic: (diagnosticId: string) => void;
  onClose?: () => void;
}

export function UndoWizard({ onSelectDiagnostic, onClose }: UndoWizardProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("qStart");
  const [historyTrail, setHistoryTrail] = useState<string[]>([]);

  const currentQuestion: WizardQuestion =
    wizardQuestions.find((q) => q.id === currentQuestionId) || wizardQuestions[0];

  const handleAnswer = (isYes: boolean) => {
    const nextId = isYes ? currentQuestion.yesNextId : currentQuestion.noNextId;
    setHistoryTrail((prev) => [...prev, currentQuestionId]);

    const targetQuestion = wizardQuestions.find((q) => q.id === nextId);

    if (targetQuestion?.targetDiagnosticId) {
      onSelectDiagnostic(targetQuestion.targetDiagnosticId);
      if (onClose) {
        onClose();
      }
    } else if (nextId) {
      setCurrentQuestionId(nextId);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId("qStart");
    setHistoryTrail([]);
  };

  return (
    <div className="bg-githubDark-card border border-gitOrange/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gitOrange/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-githubDark-borderSubtle pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-githubDark-text">
              Guided &quot;Undo My Mistake&quot; Wizard
            </h3>
            <p className="text-xs text-githubDark-muted">
              Answer 2 or 3 quick questions — we&apos;ll pinpoint your exact recovery steps
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-githubDark-muted hover:text-gitOrange transition-colors p-1.5 rounded-lg border border-githubDark-border"
          aria-label="Restart wizard"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Question Card */}
      <div className="py-2 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gitOrange">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {historyTrail.length + 1}</span>
        </div>

        <h4 className="text-lg font-semibold text-githubDark-text leading-snug">
          {currentQuestion.prompt}
        </h4>

        <p className="text-xs text-githubDark-muted leading-relaxed">
          {currentQuestion.detail}
        </p>

        {/* Yes / No Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-gitOrange hover:bg-gitOrange-600 text-white text-sm font-semibold transition-all duration-150 shadow-md shadow-gitOrange/20 active:scale-98 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gitOrange"
          >
            <Check className="w-4 h-4" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-text border border-githubDark-border text-sm font-semibold transition-all duration-150 active:scale-98 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gitOrange/50"
          >
            <span>No</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
