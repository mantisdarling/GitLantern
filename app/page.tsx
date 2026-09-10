"use client";

import React, { useState, useEffect } from "react";
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
import { BadgeUnlockToast } from "@/components/ui/toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useBadges } from "@/hooks/useBadges";
import { StageKey } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function HomePage() {
  const [currentStage, setCurrentStage] = useState<StageKey>("working");
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
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

  const handleStageChange = (stage: StageKey) => {
    setCurrentStage(stage);
  };

  const handleRecordCommand = (command: string, explanation: string) => {
    addHistoryItem(command, explanation, "synthesis");
  };

  const handleMatchedDiagnostic = (diagnosticId: string) => {
    setSelectedDiagnosticId(diagnosticId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-githubDark-bg text-githubDark-text selection:bg-gitOrange/20 selection:text-gitOrange">
      {/* Top Navigation */}
      <Header
        badges={badges}
        historyItems={historyItems}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userEmail={userEmail}
      />

      {/* Main Single Page Content */}
      <main className="flex-1">
        <HeroSection />

        <SynthesisEngine
          onStageChange={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

        <StatePipeline
          currentStage={currentStage}
          onSelectStage={handleStageChange}
          onRecordCommand={handleRecordCommand}
          onUnlockBadge={unlockBadge}
        />

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

      {/* Real-time Badge Unlock Toast */}
      <BadgeUnlockToast badge={latestBadge} onClose={dismissLatestBadge} />
    </div>
  );
}
