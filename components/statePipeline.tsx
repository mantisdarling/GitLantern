"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { pipelineStages } from "@/lib/diagnosticsData";
import { StageKey, StageInfo } from "@/lib/types";
import { CopyButton } from "@/components/ui/copyButton";
import { CommitGraph } from "@/components/commitGraph";
import {
  FolderGit2,
  Layers,
  GitCommitHorizontal,
  Cloud,
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles,
} from "lucide-react";

interface StatePipelineProps {
  currentStage: StageKey;
  onSelectStage?: (stage: StageKey) => void;
  onRecordCommand?: (command: string, explanation: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export function StatePipeline({
  currentStage,
  onSelectStage,
  onRecordCommand,
  onUnlockBadge,
}: StatePipelineProps) {
  const [inspectedStageId, setInspectedStageId] = useState<StageKey>(currentStage || "working");

  const stageKeys: StageKey[] = ["working", "staging", "local", "remote"];
  const currentStageIndex = stageKeys.indexOf(currentStage);

  const inspectedStageInfo: StageInfo =
    pipelineStages.find((s) => s.id === inspectedStageId) || pipelineStages[0];

  const handleStageClick = (id: StageKey) => {
    setInspectedStageId(id);
    if (onSelectStage) {
      onSelectStage(id);
    }
    if (onUnlockBadge) {
      onUnlockBadge("lanternMaster");
    }
  };

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case "FolderGit2":
        return <FolderGit2 className="w-5 h-5" />;
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "GitCommitHorizontal":
        return <GitCommitHorizontal className="w-5 h-5" />;
      case "Cloud":
        return <Cloud className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="pipeline" className="py-16 scroll-mt-20 border-t border-githubDark-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gitOrange mb-2">
            <Layers className="w-4 h-4" />
            <span>EXPERIENCE 2 : STATE MAPPING PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-githubDark-text tracking-tight">
            Git Architecture & State Pipeline
          </h2>
          <p className="text-sm text-githubDark-muted mt-2 leading-relaxed">
            Watch the glowing file dot illuminate your code&apos;s current position in Git&apos;s 4-stage lifecycle.
            Click any node to inspect transitions forward and backward.
          </p>
        </div>

        {/* Interactive Horizontal Pipeline Diagram */}
        <div className="relative bg-githubDark-card border border-githubDark-border rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Track Line connecting the 4 stages */}
          <div className="hidden md:block absolute top-[72px] left-[10%] right-[10%] h-1 bg-githubDark-borderSubtle z-0">
            {/* Animated progress bar fill */}
            <div
              className="h-full bg-gradient-to-r from-gitOrange/40 to-gitOrange transition-all duration-500 ease-out"
              style={{
                width: `${(Math.max(0, currentStageIndex) / (stageKeys.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* 4 Stage Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {pipelineStages.map((stage, index) => {
              const isCurrent = stage.id === currentStage;
              const isInspected = stage.id === inspectedStageId;
              const isPassed = index <= currentStageIndex;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageClick(stage.id)}
                  className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gitOrange/60 ${
                    isInspected
                      ? "bg-githubDark-surface border-gitOrange shadow-md shadow-gitOrange/10 ring-1 ring-gitOrange/30"
                      : "bg-githubDark-deep hover:bg-githubDark-surface/60 border-githubDark-border"
                  }`}
                >
                  {/* Stage Icon Node with File Dot */}
                  <div className="relative mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        isCurrent
                          ? "bg-gitOrange text-white shadow-lg shadow-gitOrange/30 scale-105"
                          : isPassed
                          ? "bg-gitOrange/15 text-gitOrange border border-gitOrange/40"
                          : "bg-githubDark-surface text-githubDark-muted border border-githubDark-border"
                      }`}
                    >
                      {getStageIcon(stage.iconName)}
                    </div>

                    {/* Glowing Animated Dot indicating active file — powered by Framer Motion */}
                    {isCurrent && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <motion.span
                          animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inline-flex h-full w-full rounded-full bg-gitOrange"
                        />
                        <motion.span
                          animate={{ boxShadow: ["0 0 0 0 rgba(240,80,50,0.5)", "0 0 12px 4px rgba(240,80,50,0)", "0 0 0 0 rgba(240,80,50,0.5)"] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative inline-flex rounded-full h-4 w-4 bg-gitOrange border-2 border-githubDark-card"
                        />
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-gitOrange uppercase tracking-wider font-semibold">
                    Stage 0{index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-githubDark-text mt-0.5">
                    {stage.label}
                  </h3>
                  <p className="text-[11px] text-githubDark-muted mt-1 line-clamp-2">
                    {stage.headline}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-githubDark-muted font-mono">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 text-gitOrange" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inspected Stage Inspector Panel */}
          <div className="mt-8 pt-6 border-t border-githubDark-borderSubtle bg-githubDark-deep/60 rounded-xl p-5 border border-githubDark-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-githubDark-borderSubtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gitOrange/10 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
                  {getStageIcon(inspectedStageInfo.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-githubDark-text">
                      {inspectedStageInfo.label}
                    </h4>
                    <span className="text-[11px] font-mono text-gitOrange px-2 py-0.5 rounded bg-gitOrange/10 border border-gitOrange/30">
                      Active Inspector
                    </span>
                  </div>
                  <p className="text-xs text-githubDark-muted mt-0.5">
                    {inspectedStageInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Forward and Backward Commands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              {/* Forward Commands */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gitOrange uppercase tracking-wider">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Advance Forward From Here</span>
                </div>
                <div className="space-y-2">
                  {inspectedStageInfo.forwardCommands.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-githubDark-surface border border-githubDark-border flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-githubDark-text">
                          {item.command}
                        </div>
                        <div className="text-[11px] text-githubDark-muted">
                          {item.description} →{" "}
                          <span className="text-gitOrange font-mono">{item.destination}</span>
                        </div>
                      </div>
                      <CopyButton
                        textToCopy={item.command}
                        onCopied={() => {
                          if (onRecordCommand) {
                            onRecordCommand(item.command, item.description);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Backward Commands */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-githubDark-muted uppercase tracking-wider">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Rewind or Undo From Here</span>
                </div>
                <div className="space-y-2">
                  {inspectedStageInfo.backwardCommands.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-githubDark-surface border border-githubDark-border flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-githubDark-text">
                          {item.command}
                        </div>
                        <div className="text-[11px] text-githubDark-muted">
                          {item.description} →{" "}
                          <span className="text-gitOrange font-mono">{item.destination}</span>
                        </div>
                      </div>
                      <CopyButton
                        textToCopy={item.command}
                        onCopied={() => {
                          if (onRecordCommand) {
                            onRecordCommand(item.command, item.description);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Commit Graph & Branch Tree */}
          <CommitGraph />
        </div>
      </div>
    </section>
  );
}
