"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gitOrange/60 ${
        copied
          ? "bg-gitOrange/15 text-gitOrange border-gitOrange/50 shadow-sm"
          : "bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-muted hover:text-githubDark-text border-githubDark-border"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-gitOrange animate-in zoom-in duration-200" />
          <span>{label ? "Copied!" : "Copied"}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-githubDark-muted" />
          <span>{label || "Copy"}</span>
        </>
      )}
    </button>
  );
}
