"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/heroSection";
import { SynthesisEngine } from "@/components/synthesisEngine";
import { StatePipeline } from "@/components/statePipeline";
import { DiagnosticFramework } from "@/components/diagnosticFramework";
import { TerminalSimulator } from "@/components/terminalSimulator";
import { HistoryDrawer } from "@/components/historyDrawer";
import { BadgeModal } from "@/components/badgeModal";
import { AuthModal } from "@/components/authModal";
import { CommandPalette } from "@/components/commandPalette";
import { BadgeUnlockToast } from "@/components/ui/toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useBadges } from "@/hooks/useBadges";
import { StageKey } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { downloadCheatsheet } from "@/lib/exportCheatsheet";
import { ScrollProgressBar } from "@/components/scrollProgressBar";
import { AnimatedBackground } from "@/components/animatedBackground";
import { sounds } from "@/lib/soundEffects";

export default function HomePage() {
  const [currentStage, setCurrentStage] = useState<StageKey>("working");
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { historyItems, addHistoryItem, clearHistory } = useSessionHistory();
  const { badges, unlockBadge, latestBadge, dismissLatestBadge } = useBadges();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      });
    }
  }, []);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sounds.playClick();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Sound effect when badge is unlocked
  useEffect(() => {
    if (latestBadge) {
      sounds.playBadgeUnlock();
    }
  }, [latestBadge]);

  const handleStageChange = useCallback((stage: StageKey) => {
    setCurrentStage(stage);
  }, []);

  const handleRecordCommand = useCallback((command: string, explanation: string) => {
    addHistoryItem(command, explanation, "synthesis");
  }, [addHistoryItem]);

  const handleMatchedDiagnostic = useCallback((diagnosticId: string) => {
    setSelectedDiagnosticId(diagnosticId);
  }, []);

  const handleDownloadCheatsheet = useCallback(() => {
    downloadCheatsheet(historyItems);
  }, [historyItems]);

  const handleOpenTerminalSection = useCallback(() => {
    const el = document.getElementById("terminal");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleOpenWizardFromPalette = useCallback(() => {
    const el = document.getElementById("diagnostics");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSelectScenarioFromPalette = useCallback((scenarioId: string) => {
    const el = document.getElementById("synthesis");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#040508] text-[#f0f6fc] selection:bg-cyan-500/20 selection:text-cyan-400 relative">
      {/* Scroll Progress Tracker */}
      <ScrollProgressBar />

      {/* Kinetic Animated Background Canvas */}
      <AnimatedBackground />

      {/* The Nifty Portal Infinite Kinetic Marquee Ticker */}
      <div className="w-full bg-[#020305] border-b border-[#182030] py-1.5 overflow-hidden select-none z-30 relative font-mono text-[10px] text-cyan-400/85 uppercase tracking-widest">
        <div className="marqueeTrack gap-8 items-center">
          <div className="flex items-center gap-8 whitespace-nowrap">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> THE NIFTY PORTAL // SPEC 2200.09</span>
            <span className="text-neutral-600">✦</span>
            <span>CYBER PROTOCOL: ONLINE</span>
            <span className="text-neutral-600">✦</span>
            <span>CLEARANCE: ALPHA-01 PASS VERIFIED</span>
            <span className="text-neutral-600">✦</span>
            <span>DAG MACHINE: 4 STATE DOMAINS SYNCHRONIZED</span>
            <span className="text-neutral-600">✦</span>
            <span>ZERO LOST COMMITS</span>
            <span className="text-neutral-600">✦</span>
            <span>LAT 64.1355° N, 21.8954° W • FREQ 142.8 MHZ</span>
            <span className="text-neutral-600">✦</span>
          </div>
          <div className="flex items-center gap-8 whitespace-nowrap" aria-hidden="true">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> THE NIFTY PORTAL // SPEC 2200.09</span>
            <span className="text-neutral-600">✦</span>
            <span>CYBER PROTOCOL: ONLINE</span>
            <span className="text-neutral-600">✦</span>
            <span>CLEARANCE: ALPHA-01 PASS VERIFIED</span>
            <span className="text-neutral-600">✦</span>
            <span>DAG MACHINE: 4 STATE DOMAINS SYNCHRONIZED</span>
            <span className="text-neutral-600">✦</span>
            <span>ZERO LOST COMMITS</span>
            <span className="text-neutral-600">✦</span>
            <span>LAT 64.1355° N, 21.8954° W • FREQ 142.8 MHZ</span>
            <span className="text-neutral-600">✦</span>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <Header
        badges={badges}
        historyItems={historyItems}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPalette={() => setIsPaletteOpen(true)}
        userEmail={userEmail}
      />

      {/* Main Single Page Content */}
      <main className="flex-1">
        <HeroSection />

        {/* Cyber Divider 01 */}
        <div className="relative border-t border-[#182030] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="text-cyan-400">[+]</span> SECTION 01 // 04</span>
            <span className="flex items-center gap-2">SYNTHESIS MATRIX <span className="text-cyan-400">[+]</span></span>
          </div>
        </div>

        <SynthesisEngine
          onStageChange={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Cyber Divider 02 */}
        <div className="relative border-t border-[#182030] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="text-cyan-400">[+]</span> SECTION 02 // 04</span>
            <span className="flex items-center gap-2">DAG STATE MACHINE <span className="text-cyan-400">[+]</span></span>
          </div>
        </div>

        <StatePipeline
          currentStage={currentStage}
          onSelectStage={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Cyber Divider 03 */}
        <div className="relative border-t border-[#182030] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="text-cyan-400">[+]</span> SECTION 03 // 04</span>
            <span className="flex items-center gap-2">INCIDENT DISPATCH <span className="text-cyan-400">[+]</span></span>
          </div>
        </div>

        <DiagnosticFramework
          externalSelectedId={selectedDiagnosticId}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Cyber Divider 04 */}
        <div className="relative border-t border-[#182030] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="text-cyan-400">[+]</span> SECTION 04 // 04</span>
            <span className="flex items-center gap-2">EXECUTION CONSOLE <span className="text-cyan-400">[+]</span></span>
          </div>
        </div>

        <TerminalSimulator
          onMatchedDiagnostic={handleMatchedDiagnostic}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Sidebars & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onClearHistory={clearHistory}
      />

      <BadgeModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        badges={badges}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => {
          setUserEmail(email);
          setIsAuthOpen(false);
        }}
      />

      {/* Raycast-style Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectScenario={handleSelectScenarioFromPalette}
        onSelectDiagnostic={handleMatchedDiagnostic}
        onOpenTerminal={handleOpenTerminalSection}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onDownloadCheatsheet={handleDownloadCheatsheet}
        onOpenWizard={handleOpenWizardFromPalette}
      />

      {/* Real-time Badge Unlock Toast */}
      <BadgeUnlockToast badge={latestBadge} onClose={dismissLatestBadge} />
    </div>
  );
}
