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
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
            <span>[02 // DIRECTED ACYCLIC GRAPH & STATE MACHINE]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cyber text-white tracking-tight uppercase leading-none cyberCyanGlow">
            State Machine Architecture
          </h2>
          <p className="text-sm text-neutral-400 mt-3 leading-relaxed font-normal">
            Track your codebase across Git&apos;s 4 core state domains. Click any node to
            inspect forward transitions and backward rollback vectors.
          </p>
        </div>

        {/* Interactive Horizontal Pipeline Diagram */}
        <div className="relative cyberPanel cornerReticle rounded-lg p-6 sm:p-9 border border-[#182030] bg-[#07090e] overflow-hidden">
          {/* Subtle Ambient Background Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Track Line connecting the 4 stages */}
          <div className="hidden md:block absolute top-[84px] left-[10%] right-[10%] h-1 bg-[#182030] z-0 rounded-full overflow-hidden">
            {/* Animated glowing laser progress bar */}
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-[#f05032] transition-all duration-500 ease-out glowBorder"
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
                  className={`flex flex-col items-center text-center p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                    isInspected
                      ? "bg-[#0a0e18] border-cyan-400 cyberBoxGlowMedium ring-1 ring-cyan-400/40"
                      : "bg-[#040508] hover:bg-[#0b0e16] border-[#182030]"
                  }`}
                >
                  {/* Stage Icon Node with File Dot */}
                  <div className="relative mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isCurrent
                          ? "bg-cyan-400 text-black cyberBoxGlowMedium"
                          : isPassed
                          ? "bg-cyan-500/15 text-cyan-400 border border-cyan-400/40"
                          : "bg-[#0b0e16] text-neutral-500 border border-[#182030]"
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
                          className="absolute inline-flex h-full w-full rounded-full bg-cyan-400"
                        />
                        <motion.span
                          animate={{ boxShadow: ["0 0 0 0 rgba(0,240,255,0.6)", "0 0 12px 4px rgba(0,240,255,0)", "0 0 0 0 rgba(0,240,255,0.6)"] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-[#040508]"
                        />
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    Stage 0{index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-0.5 font-cyber">
                    {stage.label}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                    {stage.headline}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inspected Stage Inspector Panel */}
          <div className="mt-8 pt-6 border-t border-[#182030] bg-[#040508]/80 rounded-lg p-5 border border-[#182030]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#182030]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 cyberBoxGlowSmall">
                  {getStageIcon(inspectedStageInfo.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white font-cyber tracking-wide">
                      {inspectedStageInfo.label}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 uppercase tracking-wider">
                      Active Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {inspectedStageInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Forward and Backward Commands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              {/* Forward Commands */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Advance Forward From Here</span>
                </div>
                <div className="space-y-2">
                  {inspectedStageInfo.forwardCommands.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#07090e] border border-[#182030] hover:border-cyan-400/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-white">
                          {item.command}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {item.description} →{" "}
                          <span className="text-cyan-400 font-mono font-semibold">{item.destination}</span>
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
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Rewind or Rollback From Here</span>
                </div>
                <div className="space-y-2">
                  {inspectedStageInfo.backwardCommands.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#07090e] border border-[#182030] hover:border-[#f05032]/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-white">
                          {item.command}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {item.description} →{" "}
                          <span className="text-[#f05032] font-mono font-semibold">{item.destination}</span>
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
