"use client";

import React, { useState } from "react";
import { GitBranch, Clock, User } from "lucide-react";
import { CopyButton } from "@/components/ui/copyButton";
import { sounds } from "@/lib/soundEffects";

interface TopologyNode {
  id: string;
  hash: string;
  branch: string;
  label: string;
  message: string;
  author: string;
  time: string;
  x: number;
  y: number;
  isHead?: boolean;
}

const topologyNodes: TopologyNode[] = [
  {
    id: "n1",
    hash: "a1a8d53",
    branch: "main",
    label: "INIT",
    message: "Initial commit with project scaffold",
    author: "Mantis <dev@gitlantern.dev>",
    time: "3 days ago",
    x: 245,
    y: 265,
  },
  {
    id: "n2",
    hash: "8f42e1a",
    branch: "main",
    label: "CORE",
    message: "feat: initialize git lantern core architecture",
    author: "Developer <dev@gitlantern.dev>",
    time: "1 day ago",
    x: 385,
    y: 128,
  },
  {
    id: "n3",
    hash: "3b91c0d",
    branch: "feature/payment-gate",
    label: "FEAT",
    message: "feat: add checkout webhook handler",
    author: "Developer <dev@gitlantern.dev>",
    time: "18 hours ago",
    x: 660,
    y: 242,
  },
  {
    id: "n4",
    hash: "d9ed7ec",
    branch: "feature/payment-gate",
    label: "FIX",
    message: "fix: validate session token null pointer",
    author: "Developer <dev@gitlantern.dev>",
    time: "4 hours ago",
    x: 505,
    y: 280,
  },
  {
    id: "n5",
    hash: "7f3b0ed",
    branch: "main",
    label: "GIT LANTERN",
    message: "feat: launch Git Lantern v1.0 public release",
    author: "Mantis <dev@gitlantern.dev>",
    time: "just now",
    x: 472,
    y: 235,
    isHead: true,
  },
  {
    id: "n6",
    hash: "c41b902",
    branch: "origin/main",
    label: "ORIGIN",
    message: "chore: sync remote production tag",
    author: "Mantis <dev@gitlantern.dev>",
    time: "2 hours ago",
    x: 838,
    y: 392,
  },
];

export function ArchitecturalMap() {
  const [selectedNode, setSelectedNode] = useState<TopologyNode>(
    topologyNodes.find((n) => n.isHead) || topologyNodes[0]
  );

  const handleSelect = (node: TopologyNode) => {
    sounds.playClick();
    setSelectedNode(node);
  };

  return (
    <section
      id="topology"
      className="bg-[#0A0A0A] text-white border-t border-b border-[#1F1F23] scroll-mt-16"
    >
      <div className="screenMaxWidth py-14 sm:py-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#71717A] block mb-2">
              INTERACTIVE TOPOLOGY MAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Repository Branch Architecture
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white inline-block" />
              ACTIVE HEAD
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#71717A] inline-block" />
              COMMIT STATION
            </span>
          </div>
        </div>

        {/* Architectural Dark Vector Map */}
        <div className="relative w-full bg-[#0A0A0A] border border-[#27272A] rounded-[4px] overflow-hidden">
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 1000 440"
              className="w-full min-w-[640px] h-auto block select-none"
              role="img"
              aria-label="Interactive Git repository topology map"
            >
              {/* Architectural background zones */}
              <rect x="0" y="0" width="1000" height="440" fill="#0A0A0A" />
              <polygon
                points="170,310 245,305 262,360 190,370 160,340"
                fill="#18181B"
              />
              <polygon
                points="355,215 410,205 455,340 400,355"
                fill="#18181B"
              />
              <polygon
                points="425,210 535,205 565,260 445,275"
                fill="#141417"
              />
              <polygon
                points="595,180 685,175 725,245 645,260"
                fill="#1C1C20"
              />

              {/* Geometric branch & repository street lines */}
              <g stroke="#27272A" strokeWidth="1" fill="none">
                <line x1="50" y1="20" x2="540" y2="430" />
                <line x1="210" y1="10" x2="620" y2="430" />
                <line x1="340" y1="10" x2="730" y2="430" />
                <line x1="120" y1="410" x2="430" y2="90" />
                <line x1="270" y1="420" x2="560" y2="120" />
                <line x1="410" y1="420" x2="760" y2="220" />
                <line x1="650" y1="430" x2="780" y2="170" />
                <line x1="760" y1="205" x2="990" y2="195" />
                <line x1="472" y1="235" x2="660" y2="242" stroke="#52525B" strokeWidth="1.5" />
                <line x1="385" y1="128" x2="472" y2="235" stroke="#52525B" strokeWidth="1.5" />
                <line x1="245" y1="265" x2="472" y2="235" stroke="#52525B" strokeWidth="1.5" />
              </g>

              {/* Zone labels */}
              <g
                fill="#52525B"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="1.5"
              >
                <text x="385" y="295" textAnchor="middle">
                  WORKING TREE
                </text>
                <text x="530" y="155" textAnchor="middle">
                  ORIGIN / MAIN
                </text>
                <text x="515" y="255" textAnchor="middle">
                  STAGING INDEX
                </text>
                <text x="815" y="190" textAnchor="middle">
                  REMOTE SYNC
                </text>
              </g>

              {/* Clickable Commit Stations */}
              {topologyNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => handleSelect(node)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        strokeOpacity="0.45"
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="9"
                      fill={isSelected ? "#FFFFFF" : "#0A0A0A"}
                      stroke={isSelected ? "#FFFFFF" : "#71717A"}
                      strokeWidth="1.5"
                    />
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="700"
                      fill={isSelected ? "#0A0A0A" : "#E4E4E7"}
                    >
                      G
                    </text>
                  </g>
                );
              })}

              {/* Crisp White-Outlined Callout Pin for Selected Station */}
              <g
                transform={`translate(${selectedNode.x - 42}, ${
                  selectedNode.y - 46
                })`}
              >
                <rect
                  x="0"
                  y="0"
                  width="96"
                  height="28"
                  rx="2"
                  fill="#0A0A0A"
                  stroke="#FFFFFF"
                  strokeWidth="1.25"
                />
                <polygon
                  points="40,28 48,28 44,35"
                  fill="#0A0A0A"
                  stroke="#FFFFFF"
                  strokeWidth="1.25"
                />
                <line
                  x1="40"
                  y1="28"
                  x2="48"
                  y2="28"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                />
                <text
                  x="48"
                  y="18"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  {selectedNode.label}
                </text>
              </g>
            </svg>
          </div>

          {/* Selected Station Inspector Bar */}
          <div className="border-t border-[#27272A] bg-[#0E0E10] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="px-2 py-0.5 rounded-[2px] bg-white text-[#0A0A0A] font-semibold text-[10px]">
                  {selectedNode.hash}
                </span>
                <span className="text-[#A1A1AA] flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  {selectedNode.branch}
                </span>
                <span className="text-[#71717A] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedNode.time}
                </span>
              </div>
              <p className="text-sm font-medium text-white">
                {selectedNode.message}
              </p>
              <p className="text-[11px] font-mono text-[#71717A] flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {selectedNode.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <CopyButton label="Copy Hash" textToCopy={selectedNode.hash} />
              <CopyButton
                label="Checkout"
                textToCopy={`git checkout ${selectedNode.hash}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
