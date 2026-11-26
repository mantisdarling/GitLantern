"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

import { sounds } from "@/lib/soundEffects";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({ textToCopy, label, className = "", onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!textToCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      sounds.playSuccess();
      if (onCopied) {
        onCopied();
      }
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy action failed", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 ${
        copied
          ? "bg-blue-50 text-[#2563EB] border-blue-200 shadow-sm font-semibold"
          : "bg-white hover:bg-slate-50 text-[#475569] hover:text-[#0B1221] border-slate-200 shadow-sm"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#2563EB] animate-in zoom-in duration-200" />
          <span>{label ? "Copied!" : "Copied"}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{label || "Copy"}</span>
        </>
      )}
    </button>
  );
}
