"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gitScenarios } from "@/lib/scenariosData";
import { GitScenario, ScenarioStep, StageKey } from "@/lib/types";
import { CopyButton } from "@/components/ui/copyButton";
import { DiffViewer } from "@/components/diffViewer";
import { sounds } from "@/lib/soundEffects";
import {
  sanitizeBranchName,
  sanitizeCommitMessage,
  sanitizeGenericInput,
} from "@/lib/sanitizer";
import {
  Terminal,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Play,
  RotateCcw,
  Check,
  Zap,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

interface SynthesisEngineProps {
  onStageChange?: (stage: StageKey) => void;
  onRecordCommand?: (command: string, explanation: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onConfetti?: () => void;
  onActiveCommandChange?: (command: string) => void;
}

export function SynthesisEngine({
  onStageChange,
  onRecordCommand,
  onUnlockBadge,
  onConfetti,
  onActiveCommandChange,
}: SynthesisEngineProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("featureBranch");
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial = gitScenarios.find((s) => s.id === "featureBranch") || gitScenarios[0];
    const defaults: Record<string, string> = {};
    initial.inputs.forEach((input) => {
      defaults[input.id] = input.defaultValue;
    });
    return defaults;
  });
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [simulatedExecutionIdx, setSimulatedExecutionIdx] = useState<number | null>(null);
  const [whyOpenId, setWhyOpenId] = useState<string | null>(null);

  const activeScenario: GitScenario = useMemo(() => {
    return gitScenarios.find((s) => s.id === selectedScenarioId) || gitScenarios[0];
  }, [selectedScenarioId]);

  const allInputsEmpty = useMemo(() => {
    return activeScenario.inputs.every((input) => !formValues[input.id]?.trim());
  }, [activeScenario, formValues]);

  // Initialize form default values whenever scenario changes
  useEffect(() => {
    const defaults: Record<string, string> = {};
    activeScenario.inputs.forEach((input) => {
      defaults[input.id] = input.defaultValue;
    });
    setFormValues(defaults);
    setActiveStepIndex(0);
    setSimulatedExecutionIdx(null);
    setWhyOpenId(null);

    if (onStageChange && activeScenario.steps[0]) {
      onStageChange(activeScenario.steps[0].fromStage);
    }
  }, [activeScenario, onStageChange]);

  // Notify parent of active command for keyboard shortcut C
  useEffect(() => {
    const step = activeScenario.steps[activeStepIndex];
    if (step && onActiveCommandChange) {
      let result = step.commandTemplate;
      Object.entries(formValues).forEach(([key, val]) => {
        result = result.replace(new RegExp(`{{${key}}}`, "g"), val || "...");
      });
      onActiveCommandChange(result);
    }
  }, [activeStepIndex, formValues, activeScenario, onActiveCommandChange]);

  const handleInputChange = (inputId: string, rawVal: string, inputType: string) => {
    let cleaned = rawVal;
    if (inputType === "branch") {
      cleaned = sanitizeBranchName(rawVal);
    } else if (inputType === "message") {
      cleaned = sanitizeCommitMessage(rawVal);
    } else {
      cleaned = sanitizeGenericInput(rawVal);
    }
    setFormValues((prev) => ({ ...prev, [inputId]: cleaned }));
  };

  const renderCommand = (template: string) => {
    let result = template;
    Object.entries(formValues).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), val || "...");
    });
    return result;
  };

  const currentStep: ScenarioStep | undefined = activeScenario.steps[activeStepIndex];

  const handleStepSelect = (index: number) => {
    sounds.playClick();
    setActiveStepIndex(index);
    const targetStep = activeScenario.steps[index];
    if (targetStep) {
      if (onStageChange) {
        onStageChange(targetStep.toStage);
      }
      if (targetStep.badgeToUnlock && onUnlockBadge) {
        onUnlockBadge(targetStep.badgeToUnlock);
      }
    }
  };

  const handleSimulateRun = (e: React.MouseEvent, index: number, cmd: string, explanation: string, badgeId?: string) => {
    e.stopPropagation();
    sounds.playSuccess();
    setSimulatedExecutionIdx(index);
    if (onConfetti) {
      onConfetti();
    }
    if (onRecordCommand) {
      onRecordCommand(cmd, explanation);
    }
    if (badgeId && onUnlockBadge) {
      onUnlockBadge(badgeId);
    }
    setTimeout(() => {
      setSimulatedExecutionIdx(null);
    }, 2000);
  };

  const handleCommandCopied = (command: string, explanation: string, badgeId?: string) => {
    if (onConfetti) {
      onConfetti();
    }
    if (onRecordCommand) {
      onRecordCommand(command, explanation);
    }
    if (badgeId && onUnlockBadge) {
      onUnlockBadge(badgeId);
    }
  };

  const handleResetDefaults = () => {
    sounds.playClick();
    const defaults: Record<string, string> = {};
    activeScenario.inputs.forEach((input) => {
      defaults[input.id] = input.defaultValue;
    });
    setFormValues(defaults);
  };

  return (
    <section id="synthesis" className="commonPadding scroll-mt-16 bg-[#F8FAFC] border-t border-slate-200/70">
      <div className="screenMaxWidth">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="sectionHeading">
              Command Generator
            </h2>
            <p className="sectionSubheading mt-4">
              Pick a Git task, edit the branch or file names, and copy the commands you need.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium archBtnSecondary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
              Reset
            </button>
          </div>
        </div>

        {/* Scenario Selector Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {gitScenarios.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => { sounds.playClick(); setSelectedScenarioId(scenario.id); }}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 focus:outline-none ${
                  isSelected
                    ? "archBtnPrimary font-semibold"
                    : "archBtnSecondary text-[#475569] hover:text-[#0B1221]"
                }`}
              >
                <span>{scenario.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? "bg-white/15 text-white font-semibold" : "bg-slate-100 text-[#64748B]"
                  }`}
                >
                  {scenario.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Inputs Form and Command Generation View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dynamic Inputs Form */}
          <div className="lg:col-span-5 archCard rounded-md p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#2563EB]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1221]">
                  Scenario Parameters
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#2563EB] font-semibold">
                {activeScenario.inputs.length} field{activeScenario.inputs.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
              {activeScenario.subtitle}
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {activeScenario.inputs.map((input) => (
                <div key={input.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={input.id}
                      className="text-xs font-medium text-[#334155]"
                    >
                      {input.label}
                    </label>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">
                      {input.inputType}
                    </span>
                  </div>
                  <input
                    id={input.id}
                    type="text"
                    value={formValues[input.id] || ""}
                    onChange={(e) =>
                      handleInputChange(input.id, e.target.value, input.inputType)
                    }
                    placeholder={input.placeholder}
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-white border border-slate-200 text-[#0B1221] placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                  <p className="text-[11px] text-[#64748B]">
                    {input.helpText}
                  </p>
                </div>
              ))}
            </form>

            {allInputsEmpty && (
              <div className="mt-4 p-3 rounded-xl border border-amber-300/80 bg-amber-50 text-xs text-amber-900 flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono font-bold block mb-1">Empty fields</span>
                  <span className="text-amber-800/80">Enter a branch or file name above, or load the default example.</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-mono font-bold text-[10px] hover:bg-amber-600 transition-colors uppercase"
                >
                  Load Example
                </button>
              </div>
            )}

            {/* Steps Progress Overview */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <h4 className="text-xs font-mono text-[#64748B] uppercase tracking-wider mb-2.5">
                Workflow Steps ({activeScenario.steps.length})
              </h4>
              <div className="space-y-1.5">
                {activeScenario.steps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepSelect(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors border ${
                      idx === activeStepIndex
                        ? "bg-blue-50/90 border-blue-200 text-[#1D4ED8] font-semibold"
                        : "bg-slate-50/70 hover:bg-slate-100/80 border-transparent text-[#475569]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#2563EB] font-bold">{idx + 1}.</span>
                      <span className="truncate">{renderCommand(step.commandTemplate)}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Synthesized Output */}
          <div className="lg:col-span-7 space-y-3.5">
            {activeScenario.steps.map((step, idx) => {
              const commandString = renderCommand(step.commandTemplate);
              const isSelectedStep = idx === activeStepIndex;
              const isSimulating = simulatedExecutionIdx === idx;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepSelect(idx)}
                  className={`cursor-pointer rounded-md border p-5 transition-all duration-200 ${
                    isSelectedStep
                      ? "bg-white border-blue-300 shadow-[0_12px_32px_rgba(37,99,235,0.08)] ring-1 ring-[#2563EB]/20"
                      : "bg-white/75 hover:bg-white border-slate-200/85 shadow-sm"
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center ${
                          isSelectedStep
                            ? "bg-[#2563EB] text-white"
                            : "bg-slate-100 text-[#64748B] border border-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                        <span className={isSelectedStep ? "text-[#334155]" : "text-[#64748B]"}>{step.fromStage}</span>
                        <span className="text-slate-300 mx-1">→</span>
                        <span className={isSelectedStep ? "text-[#2563EB] font-bold" : "text-[#475569]"}>{step.toStage}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelectedStep && (
                        <button
                          type="button"
                          onClick={(e) => handleSimulateRun(e, idx, commandString, step.explanation, step.badgeToUnlock)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase border transition-all duration-150 ${
                            isSimulating
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-[#475569] hover:text-[#0B1221] hover:border-blue-300"
                          }`}
                        >
                          {isSimulating ? (
                            <><Check className="w-3 h-3" /> Executed</>
                          ) : (
                            <><Play className="w-3 h-3 text-[#2563EB]" /> Run</>
                          )}
                        </button>
                      )}
                      <CopyButton
                        textToCopy={commandString}
                        onCopied={() =>
                          handleCommandCopied(commandString, step.explanation, step.badgeToUnlock)
                        }
                      />
                    </div>
                  </div>

                  {/* Terminal Command Box */}
                  <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-200/90 flex items-center justify-between gap-3 font-mono text-sm overflow-x-auto shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#2563EB] select-none font-bold">$</span>
                      <span className="text-[#0B1221] font-medium select-all">
                        {commandString}
                      </span>
                    </div>
                    {step.badgeToUnlock && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full shrink-0">
                        <Sparkles className="w-3 h-3 text-[#2563EB]" />
                        Unlocks badge
                      </span>
                    )}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 flex items-start gap-2 text-xs text-[#475569] leading-relaxed">
                    <Zap className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{step.explanation}</span>
                  </div>

                  {/* Expandable flag breakdown */}
                  {step.flagsBreakdown && step.flagsBreakdown.length > 0 && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWhyOpenId(whyOpenId === step.id ? null : step.id);
                        }}
                        className="flex items-center gap-1.5 text-[11px] font-mono text-[#2563EB] hover:text-[#1D4ED8] transition-colors focus:outline-none"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why this command?</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${whyOpenId === step.id ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {whyOpenId === step.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-2 pt-2 border-t border-slate-200/80">
                              {step.flagsBreakdown.map((item) => (
                                <div key={item.flag} className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#1D4ED8] text-[11px] font-mono font-bold">
                                      {item.flag}
                                    </code>
                                    {item.caution && (
                                      <span className="flex items-center gap-1 text-[9px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        Caution
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#475569] leading-relaxed">{item.meaning}</p>
                                  {item.caution && (
                                    <p className="mt-1.5 text-[11px] text-amber-800 leading-relaxed border-l-2 border-amber-400 pl-2">
                                      {item.caution}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Code Diff Preview */}
            <div className="pt-2">
              <DiffViewer
                fileName={formValues.filePath || "src/components/lantern.tsx"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
