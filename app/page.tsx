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
    <div className="min-h-screen flex flex-col bg-githubDark-bg text-githubDark-text selection:bg-gitOrange/20 selection:text-gitOrange">
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

        {/* Blueprint Divider 01 */}
        <div className="relative border-t border-[#1e2330] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-[10px] font-mono text-githubDark-faint uppercase tracking-widest">
            <span>+ [ SECTION 01 / 04 ]</span>
            <span>SYNTHESIS MATRIX +</span>
          </div>
        </div>

        <SynthesisEngine
          onStageChange={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Blueprint Divider 02 */}
        <div className="relative border-t border-[#1e2330] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-[10px] font-mono text-githubDark-faint uppercase tracking-widest">
            <span>+ [ SECTION 02 / 04 ]</span>
            <span>DAG STATE MACHINE +</span>
          </div>
        </div>

        <StatePipeline
          currentStage={currentStage}
          onSelectStage={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Blueprint Divider 03 */}
        <div className="relative border-t border-[#1e2330] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-[10px] font-mono text-githubDark-faint uppercase tracking-widest">
            <span>+ [ SECTION 03 / 04 ]</span>
            <span>INCIDENT DISPATCH +</span>
          </div>
        </div>

        <DiagnosticFramework
          externalSelectedId={selectedDiagnosticId}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        {/* Blueprint Divider 04 */}
        <div className="relative border-t border-[#1e2330] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-[10px] font-mono text-githubDark-faint uppercase tracking-widest">
            <span>+ [ SECTION 04 / 04 ]</span>
            <span>EXECUTION CONSOLE +</span>
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
