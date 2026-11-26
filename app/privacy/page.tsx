"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Privacy & Data Transparency
            </h1>
            <p className="text-xs text-githubDark-muted mt-1">
              Plain English explanation of what Git Lantern collects, why, and how your privacy is protected.
            </p>
          </div>
        </div>

        {/* Privacy Principles */}
        <div className="space-y-6 text-sm text-githubDark-muted leading-relaxed">
          <div className="bg-githubDark-card border border-githubDark-border rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-githubDark-text font-semibold">
              <EyeOff className="w-4 h-4 text-gitOrange" />
              <h2>1. Completely Optional Authentication</h2>
            </div>
            <p>
              Git Lantern is designed from the ground up to be fully functional without logging in.
              Every single feature, including the command synthesis engine, state mapping pipeline,
              diagnostic framework, and interactive terminal simulator, operates locally in your browser
              session via localStorage.
            </p>
          </div>

          <div className="bg-githubDark-card border border-githubDark-border rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-githubDark-text font-semibold">
              <Lock className="w-4 h-4 text-gitOrange" />
              <h2>2. Strict Read-Only GitHub & Google Scopes</h2>
            </div>
            <p>
              If you explicitly choose to sign in to sync your command history or badges across devices:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-xs">
              <li>
                We request <strong>only basic public profile and email</strong> scopes (<code className="text-gitOrange">read:user</code>, <code className="text-gitOrange">user:email</code>).
              </li>
              <li>
                We <strong>never request write access</strong> or access to any of your private or public repositories.
              </li>
              <li>
                All OAuth tokens and session management are handled strictly via Supabase client libraries over TLS/HTTPS. No plaintext secrets are ever exposed.
              </li>
            </ul>
          </div>

          <div className="bg-githubDark-card border border-githubDark-border rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-githubDark-text font-semibold">
              <CheckCircle2 className="w-4 h-4 text-gitOrange" />
              <h2>3. Row Level Security (RLS) Database Isolation</h2>
            </div>
            <p>
              Every database table (<code className="text-githubDark-text">profiles</code>, <code className="text-githubDark-text">commandHistory</code>, <code className="text-githubDark-text">badges</code>)
              has PostgreSQL Row Level Security enabled. This guarantees that your commands and badge records can only be queried or mutated by your authenticated user ID.
            </p>
          </div>

          <div className="bg-githubDark-card border border-githubDark-border rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-githubDark-text font-semibold">
              <Trash2 className="w-4 h-4 text-gitOrange" />
              <h2>4. Permanent Right to Delete (GDPR / CCPA)</h2>
            </div>
            <p>
              You have complete ownership over your data. You can delete your local browser history at any time with a single click, or permanently delete your account and all associated cloud records from our{" "}
              <Link href="/profile" className="text-gitOrange underline">
                Account & Data Profile page
              </Link>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gitOrange/5 border border-gitOrange/20 text-xs text-githubDark-muted">
            <p>
              Have questions or security feedback? Review our open source repository on{" "}
              <a
                href="https://github.com/mantisdarling/GitLantern"
                target="blank"
                rel="noopener noreferrer"
                className="text-gitOrange underline"
              >
                GitHub (mantisdarling/GitLantern)
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
