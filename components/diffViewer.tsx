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
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden font-mono text-xs shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between hover:bg-slate-100/80 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-[#0B1221]">
          <FileCode className="w-4 h-4 text-[#2563EB]" />
          <span className="font-semibold">{fileName}</span>
          <span className="text-[10px] text-[#64748B] font-sans">(git diff preview)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#64748B] text-xs font-sans">
          <span>{isExpanded ? "Hide diff" : "Inspect diff"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#2563EB]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {diffLines.map((line, index) => {
            const isAdd = line.type === "add";
            const isDel = line.type === "del";
            const isHeader = line.type === "header";

            return (
              <div
                key={index}
                className={`flex items-stretch font-mono text-[11px] leading-relaxed ${
                  isAdd
                    ? "bg-emerald-50 text-emerald-800"
                    : isDel
                    ? "bg-rose-50 text-rose-800"
                    : isHeader
                    ? "bg-blue-50/60 text-[#2563EB]"
                    : "text-[#475569]"
                }`}
              >
                {/* Line Numbers */}
                <div className="w-10 py-0.5 px-2 text-right select-none text-slate-400 bg-slate-50 border-r border-slate-200/80 shrink-0">
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
