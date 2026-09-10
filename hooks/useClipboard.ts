"use client";

import { useState, useCallback } from "react";

export function useClipboard(timeoutMs: number = 2000) {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!text) {
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setHasCopied(true);
        setTimeout(() => {
          setHasCopied(false);
          setCopiedText("");
        }, timeoutMs);
      } catch (error) {
        console.error("Failed to copy to clipboard", error);
      }
    },
    [timeoutMs]
  );

  return { hasCopied, copiedText, copyToClipboard };
}
