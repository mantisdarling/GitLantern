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

          {/* Right Letter + Micro Descriptor */}
          <div className="flex items-center justify-between sm:justify-end sm:gap-12 md:gap-20 lg:gap-28">
            <div className="hidden sm:block text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717A] leading-relaxed">
                INTERACTIVE
                <br />
                GIT COMMAND
                <br />
                ENGINE
              </p>
            </div>
            <span className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[9.5rem] font-normal tracking-tight text-[#0A0A0A] leading-none select-none ml-auto sm:ml-0">
              T
            </span>
          </div>
        </div>

        {/* Mobile-only micro descriptor below letters */}
        <div className="sm:hidden mt-6 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717A] leading-relaxed">
            INTERACTIVE GIT COMMAND ENGINE
          </p>
        </div>
      </div>

      {/* Bottom bar with subtle action & scroll-down square */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#71717A]">
          GIT LANTERN / WORKFLOW STUDIO
        </div>

        <a
          href="#synthesis"
          aria-label="Scroll to Command Generator"
          className="w-9 h-9 rounded-[4px] bg-[#F4F4F5] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-white border border-[#E4E4E7] hover:border-[#0A0A0A] flex items-center justify-center transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
