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
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-red-950/60 border border-red-500/40 text-red-400">
            Critical
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-amber-950/60 border border-amber-500/40 text-amber-400">
            Warning
          </span>
        );
      case "info":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            Recovery
          </span>
        );
    }
  };

  return (
    <section id="diagnostics" className="py-16 scroll-mt-20 border-t border-[#182030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
              <span>[03 // INCIDENT DIAGNOSTIC & RECOVERY DISPATCH]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cyber text-white tracking-tight uppercase leading-none cyberCyanGlow">
              Incident Diagnostic Matrix
            </h2>
            <p className="text-sm text-neutral-400 mt-3 max-w-2xl leading-relaxed">
              Inspect fatal error states, analyze root cause panic signatures under the hood,
              and dispatch verified step-by-step recovery commands.
            </p>
          </div>

          {/* Toggle Guided Wizard Button */}
          <button
            type="button"
            onClick={() => setShowWizard((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#182030] bg-[#07090e] hover:border-cyan-400/50 hover:bg-[#0c1018] text-cyan-400 text-xs font-mono uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-cyan-400 shrink-0"
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
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "bg-[#0a0d14] border-cyan-400/60 ring-1 ring-cyan-400/25 cyberBoxGlowMedium"
                    : "bg-[#07090e] hover:bg-[#0a0d14] border-[#182030] hover:border-cyan-400/40"
                }`}
              >
                {/* Card Header (Clickable) */}
                <button
                  type="button"
                  onClick={() => toggleCard(diag.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus:bg-[#0c1018]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#040508] border border-[#182030] flex items-center justify-center text-cyan-400 shrink-0 cyberBoxGlowSmall">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-semibold text-white font-cyber">
                          {diag.title}
                        </h3>
                        {getSeverityBadge(diag.severity)}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 font-mono">
                        {diag.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-mono text-neutral-500">
                      {isExpanded ? "Collapse" : "Expand Fix"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-[#182030] space-y-5 animate-in fade-in duration-200">
                    {/* What Happened (Plain English) */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                        // Root Cause Signature
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {diag.rootCause}
                      </p>
                    </div>

                    {/* Realistic Terminal Output Preview */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400">
                          Realistic Terminal Output
                        </span>
                        <span className="text-[11px] font-mono text-neutral-600">
                          bash/zsh stderr
                        </span>
                      </div>
                      <div className="bg-[#020306] p-3.5 rounded-lg border border-[#182030] font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {diag.realisticOutput}
                      </div>
                    </div>

                    {/* Step-by-Step Fix Commands */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                        // Step-by-Step Recovery Protocol
                      </h4>
                      <div className="space-y-2">
                        {diag.recoverySteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="bg-[#07090e] rounded-lg p-3 border border-[#182030] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-400/30 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center border border-cyan-400/30">
                                  {step.stepNumber}
                                </span>
                                <code className="text-xs font-mono font-semibold text-white">
                                  {step.command}
                                </code>
                              </div>
                              <p className="text-[11px] text-neutral-400 pl-6">
                                {step.explanation}
                              </p>
                            </div>
                            <div className="pl-6 sm:pl-0 shrink-0">
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
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-cyan-500/5 border border-cyan-400/20 text-xs text-neutral-300">
                      <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-mono uppercase tracking-wider text-[10px] mr-1.5">Prevention Protocol:</strong>
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
