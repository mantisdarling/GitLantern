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
    <div className="archCard rounded-md p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1221]">
              Guided Recovery Wizard
            </h3>
            <p className="text-xs text-[#64748B]">
              Answer 2 or 3 quick questions and we&apos;ll pinpoint your exact recovery steps
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#0B1221] transition-colors px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm"
          aria-label="Restart wizard"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Restart</span>
        </button>
      </div>

      {/* Question Card */}
      <div className="py-2 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {historyTrail.length + 1}</span>
        </div>

        <h4 className="text-lg font-semibold text-[#0B1221] leading-snug">
          {currentQuestion.prompt}
        </h4>

        <p className="text-xs text-[#64748B] leading-relaxed">
          {currentQuestion.detail}
        </p>

        {/* Yes / No Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 px-4 rounded-full archBtnPrimary text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none"
          >
            <Check className="w-4 h-4" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 px-4 rounded-full archBtnSecondary text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none"
          >
            <span>No</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
