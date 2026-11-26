"use client";

import React from "react";
import { ArrowDown } from "lucide-react";
import { ArchitecturalSculpture } from "@/components/architecturalSculpture";

export function HeroSection() {
  return (
    <section className="relative bg-white min-h-[92vh] sm:min-h-screen w-full overflow-hidden flex flex-col justify-between px-5 sm:px-10 pt-20 pb-8">
      {/* Lightweight moving white architectural sculpture (mobile & low-end friendly) */}
      <ArchitecturalSculpture />

      {/* Top-center architectural tagline */}
      <div className="relative z-10 text-center pt-1 sm:pt-2">
        <p className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.08em] text-[#0A0A0A] leading-snug">
          THE ARCHITECTURE
          <br />
          OF GIT WORKFLOWS
        </p>
      </div>

      {/* Center spread oversized letters over moving white sculpture */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto my-auto py-12">
        <div className="grid grid-cols-3 items-center w-full">
          {/* Left Letter */}
          <div className="flex justify-start">
            <span className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[9.5rem] font-normal tracking-tight text-[#0A0A0A] leading-none select-none">
              G
            </span>
          </div>

          {/* Center Letter */}
          <div className="flex justify-center">
            <span className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[9.5rem] font-normal tracking-tight text-[#0A0A0A] leading-none select-none">
              I
            </span>
          </div>

            <div className="pt-4 border-t border-[#182030] font-mono text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Auto-updating</span>
              <span className="text-cyan-400">Step {cycleIndex + 1} of {previewCycleSteps.length}</span>
            </div>
          </div>

          {/* Right Column: Interactive Code Terminal */}
          <div className="lg:col-span-8 p-5 bg-[#040508] font-mono flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#182030]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 inline-block" />
                  <span className="text-[11px] font-medium text-neutral-300">Generated Command</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shell: Bash / Zsh</span>
                </div>
              </div>

              {/* Main Code Block */}
              <div className="p-3.5 rounded-lg bg-[#07090e] border border-[#182030] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 overflow-x-auto text-sm font-medium">
                  <span className="text-cyan-400 font-bold select-none">$</span>
                  <span className="text-white tracking-wide font-mono">
                    {displayedText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-cyan-400"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b0e16] border border-[#182030] text-xs font-mono shrink-0">
                  {activeStep.copied ? (
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Mental Model Context Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.explanation}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-lg bg-[#07090e] border border-[#182030] text-xs leading-relaxed text-neutral-300 flex items-start gap-2.5"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold uppercase tracking-wider mr-2 font-mono text-[10px]">
                      Mental Model:
                    </span>
                    <span>{activeStep.explanation}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Ready for copy & execution</span>
              <span className="text-neutral-400">Press C to copy active command</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
