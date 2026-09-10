"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, ShieldAlert, Trash2, CheckCircle2, History, Award } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [badgesCount, setBadgesCount] = useState<number>(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      const hist = localStorage.getItem("gitLanternHistory");
      if (hist) {
        setHistoryCount(JSON.parse(hist).length);
      }
      const bdg = localStorage.getItem("gitLanternBadges");
      if (bdg) {
        setBadgesCount(JSON.parse(bdg).length);
      }
    } catch (e) {
      console.warn("Could not read local data counts", e);
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      });
    }
  }, []);

  const handleDeleteAllData = async () => {
    try {
      localStorage.removeItem("gitLanternHistory");
      localStorage.removeItem("gitLanternBadges");
      setHistoryCount(0);
      setBadgesCount(0);

      const supabase = getSupabaseClient();
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          await supabase.from("commandHistory").delete().eq("userId", data.user.id);
          await supabase.from("badges").delete().eq("userId", data.user.id);
          await supabase.from("profiles").delete().eq("userId", data.user.id);
          await supabase.auth.signOut();
          setUserEmail(null);
        }
      }
      setDeletedSuccess(true);
      setDeleteConfirmation(false);
    } catch (err) {
      console.error("Failed to delete user data", err);
    }
  };

  return (
    <div className="min-h-screen bg-githubDark-bg text-githubDark-text py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-gitOrange hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Git Lantern Dashboard</span>
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              User Profile & Data Management
            </h1>
            <p className="text-xs text-githubDark-muted mt-1">
              Review your stored activity and exercise full control over your data.
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-githubDark-card border border-githubDark-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-githubDark-borderSubtle pb-4">
            <div>
              <span className="text-xs font-mono text-githubDark-muted">Session Mode</span>
              <h2 className="text-base font-semibold text-githubDark-text">
                {userEmail ? userEmail : "Guest Mode (Local Only)"}
              </h2>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
                userEmail
                  ? "bg-gitOrange/10 border border-gitOrange/30 text-gitOrange"
                  : "bg-githubDark-surface border border-githubDark-border text-githubDark-muted"
              }`}
            >
              {userEmail ? "Authenticated" : "Unauthenticated"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-githubDark-deep border border-githubDark-border">
              <div className="flex items-center gap-2 text-xs text-githubDark-muted font-mono mb-1">
                <History className="w-3.5 h-3.5 text-gitOrange" />
                <span>Recorded Commands</span>
              </div>
              <div className="text-2xl font-bold font-mono text-githubDark-text">
                {historyCount}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-githubDark-deep border border-githubDark-border">
              <div className="flex items-center gap-2 text-xs text-githubDark-muted font-mono mb-1">
                <Award className="w-3.5 h-3.5 text-gitOrange" />
                <span>Unlocked Badges</span>
              </div>
              <div className="text-2xl font-bold font-mono text-githubDark-text">
                {badgesCount}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Data Section */}
        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-200">
                Delete My Data (Permanent Action)
              </h3>
              <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                This will immediately purge all session commands and badge progress from your local
                browser storage. If you are signed in, it will permanently delete your profile,
                command history, and badge records from the Supabase database.
              </p>
            </div>
          </div>

          {deletedSuccess ? (
            <div className="p-3.5 rounded-lg bg-gitOrange/10 border border-gitOrange/30 flex items-center gap-2 text-xs text-gitOrange font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>All user data and session history have been permanently purged.</span>
            </div>
          ) : deleteConfirmation ? (
            <div className="p-4 rounded-lg bg-githubDark-deep border border-red-500/40 space-y-3">
              <p className="text-xs text-githubDark-text font-medium">
                Are you absolutely sure? This cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAllData}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Permanently Delete Everything</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation(false)}
                  className="px-4 py-2 rounded-lg bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-muted hover:text-githubDark-text text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setDeleteConfirmation(true)}
              className="px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
