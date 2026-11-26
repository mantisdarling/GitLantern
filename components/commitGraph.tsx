"use client";

import React, { useState } from "react";
import { GitBranch, GitCommitHorizontal, Clock, User, ArrowRight, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/ui/copyButton";
import { sounds } from "@/lib/soundEffects";

interface CommitNode {
  hash: string;
  branch: string;
  message: string;
  author: string;
  time: string;
  isHead?: boolean;
  x: number;
  y: number;
  parentHash?: string;
}

const mockCommitTree: CommitNode[] = [
  {
    hash: "a1a8d53",
    branch: "main",
    message: "Initial commit with project scaffold",
    author: "Mantis <dev@gitlantern.dev>",
    time: "3 days ago",
    x: 40,
    y: 80,
  },
  {
    hash: "8f42e1a",
    branch: "main",
    message: "feat: initialize git lantern core architecture",
    author: "Junior Dev <dev@gitlantern.dev>",
    time: "1 day ago",
    x: 180,
    y: 80,
    parentHash: "a1a8d53",
  },
  {
    hash: "3b91c0d",
    branch: "feature/payment-gate",
    message: "feat: add stripe checkout webhook handler",
    author: "Junior Dev <dev@gitlantern.dev>",
    time: "18 hours ago",
    x: 320,
    y: 35,
    parentHash: "8f42e1a",
  },
  {
    hash: "d9ed7ec",
    branch: "feature/payment-gate",
    message: "fix: validate session token null pointer",
    author: "Junior Dev <dev@gitlantern.dev>",
    time: "4 hours ago",
    x: 460,
    y: 35,
    parentHash: "3b91c0d",
  },
  {
    hash: "7f3b0ed",
    branch: "main",
    message: "feat: launch Git Lantern v1.0 public release",
    author: "Mantis <dev@gitlantern.dev>",
    time: "just now",
    isHead: true,
    x: 460,
    y: 80,
    parentHash: "8f42e1a",
  },
];

export function CommitGraph() {
  const [selectedCommit, setSelectedCommit] = useState<CommitNode>(
    mockCommitTree[mockCommitTree.length - 1]
  );

  const handleNodeClick = (node: CommitNode) => {
    sounds.playClick();
    setSelectedCommit(node);
  };

  return (
    <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 mt-8 font-mono shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider">DAG Topology</div>
            <h3 className="text-sm font-semibold text-[#0B1221] tracking-tight font-sans">
              Interactive Commit Graph & Branch Tree
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block" />
            <span>HEAD: main</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>feature/payment-gate</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="overflow-x-auto py-6">
        <div className="min-w-[620px] relative h-36">
          <svg className="w-full h-full" viewBox="0 0 620 120">
            <defs>
              <linearGradient id="mainBranchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="forkBranchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Main branch base line */}
            <line
              x1="40"
              y1="80"
              x2="460"
              y2="80"
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeDasharray="none"
            />

            {/* Fork curve from 8f42e1a to 3b91c0d */}
            <path
              d="M 180 80 C 240 80, 260 35, 320 35"
              fill="none"
              stroke="url(#forkBranchGrad)"
              strokeWidth="3"
            />

            {/* Feature branch line */}
            <line
              x1="320"
              y1="35"
              x2="460"
              y2="35"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Commit Nodes */}
            {mockCommitTree.map((node) => {
              const isSelected = selectedCommit.hash === node.hash;
              const isFeature = node.branch.includes("feature");

              return (
                <g
                  key={node.hash}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110"
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Outer ring for selected or HEAD */}
                  {(isSelected || node.isHead) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="13"
                      fill="none"
                      stroke={node.isHead ? "#2563EB" : "#94a3b8"}
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Core Node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill={node.isHead ? "#2563EB" : isFeature ? "#38bdf8" : "#64748b"}
                    stroke={isSelected ? "#0B1221" : "#ffffff"}
                    strokeWidth="2.5"
                  />

                  {/* Hash Label */}
                  <text
                    x={node.x}
                    y={node.y + 24}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-[#64748B] select-none"
                  >
                    {node.hash}
                  </text>

                  {/* Head tag */}
                  {node.isHead && (
                    <text
                      x={node.x}
                      y={node.y - 18}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-[#2563EB] select-none"
                    >
                      HEAD
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Details Box */}
      {selectedCommit && (
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-blue-50 border border-blue-200 text-[#2563EB] font-semibold">
                commit {selectedCommit.hash}
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                on branch ({selectedCommit.branch})
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#0B1221] font-sans">
              {selectedCommit.message}
            </h4>
            <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-[#2563EB]" />
                {selectedCommit.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#2563EB]" />
                {selectedCommit.time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <CopyButton
              label="Copy Hash"
              textToCopy={selectedCommit.hash}
            />
            <CopyButton
              label="Checkout Commit"
              textToCopy={`git checkout ${selectedCommit.hash}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
