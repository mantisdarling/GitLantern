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
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-red-950/60 border border-red-500/30 text-red-400">
            Critical
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">
            Warning
          </span>
        );
      case "info":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-gitOrange/10 border border-gitOrange/30 text-gitOrange">
            Recovery
          </span>
        );
    }
  };

  return (
    <section id="diagnostics" className="py-16 scroll-mt-20 border-t border-githubDark-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gitOrange mb-2">
              <LifeBuoy className="w-4 h-4" />
              <span>EXPERIENCE 3 : VISUAL DIAGNOSTIC FRAMEWORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-githubDark-text tracking-tight">
              Visual Diagnostic Framework
            </h2>
            <p className="text-sm text-githubDark-muted mt-1 max-w-2xl">
              Inspect failure states, understand what actually happened under the hood,
              and execute step-by-step recovery commands.
            </p>
          </div>

          {/* Toggle Guided Wizard Button */}
          <button
            type="button"
            onClick={() => setShowWizard((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gitOrange/40 bg-gitOrange/10 hover:bg-gitOrange/20 text-gitOrange text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gitOrange/50 shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            <span>{showWizard ? "Hide Guided Wizard" : "Guided Undo Wizard"}</span>
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
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "glassCard border-gitOrange/60 shadow-2xl glowBorder ring-1 ring-gitOrange/30"
                    : "glassCardInteractive border-githubDark-border/60 hover:border-gitOrange/40"
                }`}
              >
                {/* Card Header (Clickable) */}
                <button
                  type="button"
                  onClick={() => toggleCard(diag.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus:bg-githubDark-surface"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-githubDark-surface border border-githubDark-border flex items-center justify-center text-gitOrange shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-semibold text-githubDark-text">
                          {diag.title}
                        </h3>
                        {getSeverityBadge(diag.severity)}
                      </div>
                      <p className="text-xs text-githubDark-muted mt-0.5 line-clamp-1">
                        {diag.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-mono text-githubDark-muted">
                      {isExpanded ? "Collapse" : "Expand Fix"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gitOrange" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-githubDark-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-githubDark-borderSubtle space-y-5 animate-in fade-in duration-200">
                    {/* What Happened (Plain English) */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-semibold text-gitOrange uppercase tracking-wider">
                        What Happened in Plain English
                      </h4>
                      <p className="text-xs text-githubDark-text leading-relaxed">
                        {diag.rootCause}
                      </p>
                    </div>

                    {/* Realistic Terminal Output Preview */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-githubDark-muted">
                          Realistic Terminal Output
                        </span>
                        <span className="text-[11px] font-mono text-githubDark-faint">
                          bash/zsh stderr
                        </span>
                      </div>
                      <div className="bg-githubDark-deep p-3.5 rounded-lg border border-githubDark-border font-mono text-xs text-githubDark-muted overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {diag.realisticOutput}
                      </div>
                    </div>

                    {/* Step-by-Step Fix Commands */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-semibold text-gitOrange uppercase tracking-wider">
                        Step-by-Step Recovery Sequence
                      </h4>
                      <div className="space-y-2">
                        {diag.recoverySteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="bg-githubDark-surface/80 rounded-lg p-3 border border-githubDark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-gitOrange/15 text-gitOrange text-[10px] font-mono font-bold flex items-center justify-center border border-gitOrange/30">
                                  {step.stepNumber}
                                </span>
                                <code className="text-xs font-mono font-semibold text-githubDark-text">
                                  {step.command}
                                </code>
                              </div>
                              <p className="text-[11px] text-githubDark-muted pl-6">
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
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gitOrange/5 border border-gitOrange/20 text-xs text-githubDark-muted">
                      <Lightbulb className="w-4 h-4 text-gitOrange shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-githubDark-text">Pro Prevention Habit: </strong>
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
