"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { gitScenarios } from "@/lib/scenariosData";
import { GitScenario, ScenarioStep, StageKey } from "@/lib/types";
import { CopyButton } from "@/components/ui/copyButton";
import {
  sanitizeBranchName,
  sanitizeCommitMessage,
  sanitizeGenericInput,
} from "@/lib/sanitizer";
import { Terminal, Sparkles, CheckCircle2, ChevronRight, SlidersHorizontal } from "lucide-react";

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

  const handleCommandCopied = (command: string, explanation: string, badgeId?: string) => {
    if (onRecordCommand) {
      onRecordCommand(command, explanation);
    }
    if (badgeId && onUnlockBadge) {
      onUnlockBadge(badgeId);
    }
  };

  return (
    <section id="synthesis" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gitOrange mb-2">
              <Terminal className="w-4 h-4" />
              <span>EXPERIENCE 1 : SYNTHESIS ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-githubDark-text tracking-tight">
              Command Synthesis Engine
            </h2>
            <p className="text-sm text-githubDark-muted mt-1 max-w-2xl">
              Select your real-world development scenario, customize the parameters, and
              receive bulletproof Git commands explained in human language.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-githubDark-muted">
            <span className="w-2 h-2 rounded-full bg-gitOrange inline-block animate-pulse" />
            <span>Real-time sanitization active</span>
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
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-2 border focus:outline-none focus:ring-2 focus:ring-gitOrange/50 ${
                  isSelected
                    ? "bg-gitOrange text-white border-gitOrange shadow-md shadow-gitOrange/20 font-semibold"
                    : "bg-githubDark-card text-githubDark-muted hover:text-githubDark-text hover:bg-githubDark-surface border-githubDark-border"
                }`}
              >
                <span>{scenario.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? "bg-black/20 text-white" : "bg-githubDark-surface text-githubDark-faint"
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
          <div className="lg:col-span-5 bg-githubDark-card border border-githubDark-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-githubDark-borderSubtle pb-3 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gitOrange" />
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
            <div className="mt-6 pt-5 border-t border-githubDark-borderSubtle">
              <h4 className="text-xs font-medium text-githubDark-muted uppercase tracking-wider mb-2.5">
                Scenario Sequence ({activeScenario.steps.length} Steps)
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
          <div className="lg:col-span-7 space-y-4">
            {activeScenario.steps.map((step, idx) => {
              const commandString = renderCommand(step.commandTemplate);
              const isSelectedStep = idx === activeStepIndex;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepSelect(idx)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
                    isSelectedStep
                      ? "bg-githubDark-card border-gitOrange/60 shadow-lg shadow-gitOrange/5 ring-1 ring-gitOrange/20"
                      : "bg-githubDark-card/70 hover:bg-githubDark-card border-githubDark-border opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                          isSelectedStep
                            ? "bg-gitOrange text-white"
                            : "bg-githubDark-surface text-githubDark-muted border border-githubDark-border"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-mono text-githubDark-muted uppercase tracking-wider">
                        Stage: {step.fromStage} → {step.toStage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CopyButton
                        textToCopy={commandString}
                        onCopied={() =>
                          handleCommandCopied(commandString, step.explanation, step.badgeToUnlock)
                        }
                      />
                    </div>
                  </div>

                  {/* Terminal Command Box */}
                  <div className="bg-githubDark-deep rounded-lg p-3.5 border border-githubDark-border flex items-center justify-between gap-3 font-mono text-sm overflow-x-auto">
                    <div className="flex items-center gap-2.5">
                      <span className="text-gitOrange select-none font-bold">$</span>
                      <span className="text-githubDark-text font-medium select-all">
                        {commandString}
                      </span>
                    </div>
                    {step.badgeToUnlock && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-gitOrange bg-gitOrange/10 border border-gitOrange/25 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" />
                        Unlocks badge
                      </span>
                    )}
                  </div>

                  {/* Plain English Mental Model Explanation */}
                  <div className="mt-3.5 flex items-start gap-2.5 text-xs text-githubDark-muted leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-gitOrange shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-githubDark-text">Mental Model: </strong>
                      <span>{step.explanation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
