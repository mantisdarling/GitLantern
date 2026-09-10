"use client";

import React, { useState } from "react";
import { FileCode, ChevronDown, ChevronUp } from "lucide-react";

interface DiffLine {
  type: "add" | "del" | "context" | "header";
  oldLineNumber?: number;
  newLineNumber?: number;
  text: string;
}

interface DiffViewerProps {
  fileName?: string;
  diffLines?: DiffLine[];
}

const defaultDiffLines: DiffLine[] = [
  { type: "header", text: "@@ -14,6 +14,8 @@ export function UserProfile() {" },
  { type: "context", oldLineNumber: 14, newLineNumber: 14, text: "  const [isOpen, setIsOpen] = useState(false);" },
  { type: "del", oldLineNumber: 15, text: "-  // Old synchronous profile loading" },
  { type: "del", oldLineNumber: 16, text: "-  const profile = fetchProfileSync();" },
  { type: "add", newLineNumber: 15, text: "+  // Non-blocking async session sync" },
  { type: "add", newLineNumber: 16, text: "+  const { profile, isSyncing } = useProfileSession();" },
  { type: "context", oldLineNumber: 17, newLineNumber: 17, text: "  return (" },
  { type: "context", oldLineNumber: 18, newLineNumber: 18, text: "    <div className=\"profileContainer\">" },
];

export function DiffViewer({
  fileName = "src/components/userProfile.tsx",
  diffLines = defaultDiffLines,
}: DiffViewerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="rounded-xl border border-githubDark-border bg-githubDark-deep/80 overflow-hidden font-mono text-xs">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-4 py-2.5 bg-githubDark-card border-b border-githubDark-border flex items-center justify-between hover:bg-githubDark-surface transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-githubDark-text">
          <FileCode className="w-4 h-4 text-gitOrange" />
          <span className="font-semibold">{fileName}</span>
          <span className="text-[10px] text-githubDark-muted font-sans">(git diff preview)</span>
        </div>

        <div className="flex items-center gap-1.5 text-githubDark-muted text-xs font-sans">
          <span>{isExpanded ? "Hide diff" : "Inspect diff"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gitOrange" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-githubDark-borderSubtle overflow-x-auto">
          {diffLines.map((line, index) => {
            const isAdd = line.type === "add";
            const isDel = line.type === "del";
            const isHeader = line.type === "header";

            return (
              <div
                key={index}
                className={`flex items-stretch font-mono text-[11px] leading-relaxed ${
                  isAdd
                    ? "bg-emerald-950/25 text-emerald-300"
                    : isDel
                    ? "bg-rose-950/25 text-rose-300"
                    : isHeader
                    ? "bg-githubDark-surface/60 text-gitOrange/90"
                    : "text-githubDark-muted"
                }`}
              >
                {/* Line Numbers */}
                <div className="w-10 py-0.5 px-2 text-right select-none text-githubDark-faint bg-githubDark-deep border-r border-githubDark-borderSubtle shrink-0">
                  {line.oldLineNumber || ""}
                </div>
                <div className="w-10 py-0.5 px-2 text-right select-none text-githubDark-faint bg-githubDark-deep border-r border-githubDark-borderSubtle shrink-0">
                  {line.newLineNumber || ""}
                </div>

                {/* Line Marker */}
                <div className="w-6 py-0.5 text-center select-none font-bold shrink-0">
                  {isAdd ? "+" : isDel ? "-" : isHeader ? " " : " "}
                </div>

                {/* Code Text */}
                <div className="py-0.5 px-2 whitespace-pre overflow-x-auto flex-1">
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
