"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/heroSection";
import { SynthesisEngine } from "@/components/synthesisEngine";
import { StatePipeline } from "@/components/statePipeline";
import { ArchitecturalMap } from "@/components/architecturalMap";
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
  const [isDark, setIsDark] = useState<boolean>(false);
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

  // Mark tour key if needed; user can open tour from the header button anytime
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(tourSeenKey);
      if (!seen) {
        localStorage.setItem(tourSeenKey, "true");
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
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB] relative">
      {/* Scroll Progress Tracker */}
      <ScrollProgressBar />

      {/* Confetti Burst on badge unlock or copy */}
      <CyberConfetti
        trigger={confettiTrigger}
        onComplete={() => setConfettiTrigger(false)}
      />

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

        <SynthesisEngine
          onStageChange={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
          onConfetti={() => setConfettiTrigger(true)}
          onActiveCommandChange={handleActiveCommandChange}
        />

        <StatePipeline
          currentStage={currentStage}
          onSelectStage={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        <ArchitecturalMap />

        <DiagnosticFramework
          externalSelectedId={selectedDiagnosticId}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

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
