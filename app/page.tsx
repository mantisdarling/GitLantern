"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { OnboardingTour } from "@/components/onboardingTour";
import { ShortcutsModal } from "@/components/shortcutsModal";
import { CyberConfetti } from "@/components/ui/cyberConfetti";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useBadges } from "@/hooks/useBadges";
import { StageKey } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { downloadCheatsheet } from "@/lib/exportCheatsheet";
import { ScrollProgressBar } from "@/components/scrollProgressBar";
import { AnimatedBackground } from "@/components/animatedBackground";
import { sounds } from "@/lib/soundEffects";

const tourSeenKey = "gitlanternTourSeen";
const stageKeys: StageKey[] = ["working", "staging", "local", "remote"];

export default function HomePage() {
  const [currentStage, setCurrentStage] = useState<StageKey>("working");
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  const activeCommandRef = useRef<string>("");

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

  // Auto-open tour on first visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(tourSeenKey);
      if (!seen) {
        const timer = setTimeout(() => setIsTourOpen(true), 900);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [isDark]);

  // Confetti + sound on badge unlock
  useEffect(() => {
    if (latestBadge) {
      sounds.playBadgeUnlock();
      setConfettiTrigger(true);
    }
  }, [latestBadge]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sounds.playClick();
        setIsPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setIsPaletteOpen(false);
        setIsShortcutsOpen(false);
        setIsTourOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      if (e.key === "c" || e.key === "C") {
        if (activeCommandRef.current) {
          navigator.clipboard.writeText(activeCommandRef.current).catch(() => null);
          sounds.playSuccess();
          setConfettiTrigger(true);
        }
        return;
      }

      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const stage = stageKeys[idx];
        if (stage) {
          setCurrentStage(stage);
          const el = document.getElementById("pipeline");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

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

  const handleActiveCommandChange = useCallback((command: string) => {
    activeCommandRef.current = command;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#040508] text-[#f0f6fc] selection:bg-cyan-500/20 selection:text-cyan-400 relative">
      {/* Scroll Progress Tracker */}
      <ScrollProgressBar />

      {/* Kinetic Animated Background Canvas */}
      <AnimatedBackground />

      {/* Cyber Confetti Burst on badge unlock / copy */}
      <CyberConfetti
        trigger={confettiTrigger}
        onComplete={() => setConfettiTrigger(false)}
      />

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
        onOpenTour={() => setIsTourOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isDark={isDark}
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
          onConfetti={() => setConfettiTrigger(true)}
          onActiveCommandChange={handleActiveCommandChange}
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

      {/* Command Palette (Cmd+K) */}
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

      {/* First-visit Onboarding Spotlight Tour */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Keyboard Shortcuts HUD (press ?) */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Real-time Badge Unlock Toast */}
      <BadgeUnlockToast badge={latestBadge} onClose={dismissLatestBadge} />
    </div>
  );
}
