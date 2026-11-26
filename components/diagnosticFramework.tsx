"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { diagnosticCases } from "@/lib/diagnosticsData";
import { DiagnosticCase } from "@/lib/types";
import { CopyButton } from "@/components/ui/copyButton";
import { UndoWizard } from "@/components/undoWizard";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  LifeBuoy,
  Wand2,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

interface DiagnosticFrameworkProps {
  externalSelectedId?: string | null;
  onRecordCommand?: (command: string, explanation: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export function DiagnosticFramework({
  externalSelectedId,
  onRecordCommand,
  onUnlockBadge,
}: DiagnosticFrameworkProps) {
  const [expandedCardId, setExpandedCardId] = useState<string>("mergeConflicts");
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (externalSelectedId) {
      setExpandedCardId(externalSelectedId);
      setShowWizard(false);
      const targetElement = cardRefs.current[externalSelectedId];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [externalSelectedId]);

  const toggleCard = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? "" : id));
    if (id === "mergeConflicts" && onUnlockBadge) {
      onUnlockBadge("conflictCrusher");
    }
  };

  const handleSelectFromWizard = (diagnosticId: string) => {
    setExpandedCardId(diagnosticId);
    setShowWizard(false);
    const targetElement = cardRefs.current[diagnosticId];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (onUnlockBadge) {
      onUnlockBadge("conflictCrusher");
    }
  };

  const getSeverityBadge = (severity: "critical" | "warning" | "info") => {
    switch (severity) {
      case "critical":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
            Critical
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
            Warning
          </span>
        );
      case "info":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-semibold">
            Recovery
          </span>
        );
    }
  };

  return (
    <section id="diagnostics" className="commonPadding scroll-mt-16 bg-[#F8FAFC] border-t border-slate-200/70">
      <div className="screenMaxWidth">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="sectionHeading">
              Fix Common Mistakes
            </h2>
            <p className="sectionSubheading mt-4">
              Stuck with a merge conflict, detached HEAD, or commit on the wrong branch? Open a guide below for the exact recovery commands.
            </p>
          </div>

          {/* Toggle Guided Wizard Button */}
          <button
            type="button"
            onClick={() => setShowWizard((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full archBtnPrimary text-xs font-medium transition-all duration-150 focus:outline-none shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{showWizard ? "Close Recovery Wizard" : "Launch Guided Wizard"}</span>
          </button>
        </div>

        {/* Guided Wizard Section */}
        {showWizard && (
          <div className="mb-10 animate-in fade-in duration-300">
            <UndoWizard
              onSelectDiagnostic={handleSelectFromWizard}
              onClose={() => setShowWizard(false)}
            />
          </div>
        )}

        {/* Cards Grid */}
        <div className="space-y-4">
          {diagnosticCases.map((diag) => {
            const isExpanded = diag.id === expandedCardId;

            return (
              <div
                key={diag.id}
                ref={(el) => {
                  cardRefs.current[diag.id] = el;
                }}
                className={`rounded-md border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "bg-white border-blue-300 shadow-[0_14px_34px_rgba(37,99,235,0.08)] ring-1 ring-[#2563EB]/15"
                    : "bg-white/85 hover:bg-white border-slate-200/90 shadow-sm hover:border-blue-200"
                }`}
              >
                {/* Card Header */}
                <button
                  type="button"
                  onClick={() => toggleCard(diag.id)}
                  className="w-full px-6 py-4.5 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#2563EB] shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-semibold text-[#0B1221]">
                          {diag.title}
                        </h3>
                        {getSeverityBadge(diag.severity)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1 font-mono">
                        {diag.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-mono text-[#64748B]">
                      {isExpanded ? "Collapse" : "Expand Fix"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-slate-200/80 space-y-5 animate-in fade-in duration-200">
                    {/* Root Cause */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-wider">
                        Root Cause
                      </h4>
                      <p className="text-xs text-[#334155] leading-relaxed">
                        {diag.rootCause}
                      </p>
                    </div>

                    {/* Realistic Terminal Output Preview */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#64748B]">
                          Realistic Terminal Output
                        </span>
                        <span className="text-[11px] font-mono text-[#64748B]">
                          bash stderr
                        </span>
                      </div>
                      <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200/90 font-mono text-xs text-[#334155] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                        {diag.realisticOutput}
                      </div>
                    </div>

                    {/* Step by Step Fix Commands */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-wider">
                        Step by Step Recovery
                      </h4>
                      <div className="space-y-2">
                        {diag.recoverySteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-mono font-bold flex items-center justify-center border border-blue-200">
                                  {step.stepNumber}
                                </span>
                                <code className="text-xs font-mono font-semibold text-[#0B1221]">
                                  {step.command}
                                </code>
                              </div>
                              <p className="text-[11px] text-[#64748B] pl-7">
                                {step.explanation}
                              </p>
                            </div>
                            <div className="pl-7 sm:pl-0 shrink-0">
                              <CopyButton
                                textToCopy={step.command}
                                onCopied={() => {
                                  if (onRecordCommand) {
                                    onRecordCommand(step.command, step.explanation);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prevention Tip */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-[#334155]">
                      <Lightbulb className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0B1221] font-mono uppercase tracking-wider text-[10px] mr-1.5">Prevention Tip:</strong>
                        <span>{diag.preventionTip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
