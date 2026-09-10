"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

interface SynthesisEngineProps {
  onStageChange?: (stage: StageKey) => void;
  onRecordCommand?: (command: string, explanation: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export function SynthesisEngine({
  onStageChange,
  onRecordCommand,
  onUnlockBadge,
}: SynthesisEngineProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("featureBranch");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [simulatedExecutionIdx, setSimulatedExecutionIdx] = useState<number | null>(null);

  const activeScenario: GitScenario = useMemo(() => {
    return gitScenarios.find((s) => s.id === selectedScenarioId) || gitScenarios[0];
  }, [selectedScenarioId]);

  // Initialize form default values whenever scenario changes
  useEffect(() => {
    const defaults: Record<string, string> = {};
    activeScenario.inputs.forEach((input) => {
      defaults[input.id] = input.defaultValue;
    });
    setFormValues(defaults);
    setActiveStepIndex(0);
    setSimulatedExecutionIdx(null);

    if (onStageChange && activeScenario.steps[0]) {
      onStageChange(activeScenario.steps[0].fromStage);
    }
  }, [activeScenario, onStageChange]);

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
    <section id="synthesis" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gitOrange mb-3 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-gitOrange animate-pulse inline-block" />
              <span>[01 // COMMAND SYNTHESIS ENGINE]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display text-[#f0f6fc] tracking-tight uppercase leading-none">
              Command Synthesis Engine
            </h2>
            <p className="text-sm text-githubDark-muted mt-3 max-w-2xl leading-relaxed">
              Select a real-world developer scenario, fill in parameters, and receive
              sanitized, copy-ready Git commands with step-by-step mental models.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f131a] border border-[#1e2330] text-xs font-mono text-githubDark-muted uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-gitOrange inline-block animate-pulse" />
              <span>Sanitizer: Active</span>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141923] border border-[#1e2330] hover:border-gitOrange/50 text-xs font-mono text-neutral-300 hover:text-white transition-colors uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gitOrange" />
              Reset
            </button>
          </div>
        </div>

        {/* Scenario Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {gitScenarios.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => { sounds.playClick(); setSelectedScenarioId(scenario.id); }}
                className={`px-3.5 py-2 rounded-md text-xs font-mono uppercase whitespace-nowrap transition-all duration-150 flex items-center gap-2 border focus:outline-none focus:ring-1 focus:ring-gitOrange ${
                  isSelected
                    ? "bg-gitOrange text-white border-gitOrange font-bold shadow-md shadow-gitOrange/20"
                    : "bg-[#0f131a] text-githubDark-muted hover:text-[#f0f6fc] hover:bg-[#141923] border-[#1e2330]"
                }`}
              >
                <span>{scenario.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? "bg-black/30 text-white" : "bg-[#141923] text-githubDark-faint"
                  }`}
                >
                  {scenario.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Inputs Form & Command Generation View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dynamic Inputs Form */}
          <div className="lg:col-span-5 cerebriumCard rounded-lg p-6 relative border border-[#1e2330] bg-[#090b10]">
            <div className="flex items-center justify-between border-b border-[#1e2330] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-githubDark-text">
                  Scenario Parameters
                </h3>
              </div>
              <span className="text-[11px] font-mono text-githubDark-muted">
                {activeScenario.inputs.length} field{activeScenario.inputs.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs text-githubDark-muted mb-4 leading-relaxed">
              {activeScenario.subtitle}
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {activeScenario.inputs.map((input) => (
                <div key={input.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={input.id}
                      className="text-xs font-medium text-githubDark-text"
                    >
                      {input.label}
                    </label>
                    <span className="text-[10px] font-mono text-githubDark-faint uppercase">
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
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-githubDark-deep border border-githubDark-border text-githubDark-text placeholder:text-githubDark-faint focus:outline-none focus:border-gitOrange focus:ring-1 focus:ring-gitOrange transition-all"
                  />
                  <p className="text-[11px] text-githubDark-muted">
                    {input.helpText}
                  </p>
                </div>
              ))}
            </form>

            {/* Steps Progress Overview */}
            <div className="mt-6 pt-5 border-t border-[#1e2330]">
              <h4 className="text-[10px] font-mono text-gitOrange uppercase tracking-widest mb-2.5">
                // Scenario Sequence — {activeScenario.steps.length} steps
              </h4>
              <div className="space-y-1.5">
                {activeScenario.steps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepSelect(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors border ${
                      idx === activeStepIndex
                        ? "bg-gitOrange/10 border-gitOrange/40 text-gitOrange font-semibold"
                        : "bg-githubDark-surface/40 hover:bg-githubDark-surface border-transparent text-githubDark-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-gitOrange font-bold">{idx + 1}.</span>
                      <span className="truncate">{renderCommand(step.commandTemplate)}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Synthesized Output */}
          <div className="lg:col-span-7 space-y-3">
            {activeScenario.steps.map((step, idx) => {
              const commandString = renderCommand(step.commandTemplate);
              const isSelectedStep = idx === activeStepIndex;
              const isSimulating = simulatedExecutionIdx === idx;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepSelect(idx)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    isSelectedStep
                      ? "bg-[#0d1017] border-gitOrange/60 ring-1 ring-gitOrange/20"
                      : "bg-[#0b0e14] hover:bg-[#0d1017] border-[#1e2330] opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center ${
                          isSelectedStep
                            ? "bg-gitOrange text-white"
                            : "bg-[#141923] text-githubDark-muted border border-[#1e2330]"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-githubDark-muted uppercase tracking-wider">
                        <span className={isSelectedStep ? "text-githubDark-muted" : "text-githubDark-faint"}>{step.fromStage}</span>
                        <span className="text-githubDark-faint mx-1">→</span>
                        <span className={isSelectedStep ? "text-gitOrange" : "text-githubDark-muted"}>{step.toStage}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelectedStep && (
                        <button
                          type="button"
                          onClick={(e) => handleSimulateRun(e, idx, commandString, step.explanation, step.badgeToUnlock)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase border transition-all duration-150 ${
                            isSimulating
                              ? "bg-green-500/20 border-green-500/50 text-green-400"
                              : "bg-[#141923] border-[#2a3448] text-githubDark-muted hover:text-white hover:border-gitOrange/40"
                          }`}
                        >
                          {isSimulating ? (
                            <><Check className="w-3 h-3" /> Executed</>
                          ) : (
                            <><Play className="w-3 h-3" /> Run</>
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
                  <div className="bg-[#06080d] rounded-md p-3 border border-[#1a2030] flex items-center justify-between gap-3 font-mono text-sm overflow-x-auto">
                    <div className="flex items-center gap-2.5">
                      <span className="text-gitOrange select-none font-bold">$</span>
                      <span className="text-githubDark-text font-medium select-all">
                        {commandString}
                      </span>
                    </div>
                    {step.badgeToUnlock && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-gitOrange bg-gitOrange/10 border border-gitOrange/25 px-2 py-0.5 rounded shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Unlocks badge
                      </span>
                    )}
                  </div>

                  {/* Mental Model Explanation */}
                  <div className="mt-3 flex items-start gap-2 text-xs text-githubDark-muted leading-relaxed">
                    <Zap className="w-3.5 h-3.5 text-gitOrange shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-githubDark-text font-mono text-[10px] uppercase tracking-wider mr-1.5">Mental Model:</strong>
                      <span>{step.explanation}</span>
                    </div>
                  </div>
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
