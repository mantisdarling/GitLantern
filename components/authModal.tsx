"use client";

import React, { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { X, Github, Mail, ShieldCheck, ArrowRight, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [emailInput, setEmailInput] = useState<string>("");
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) {
    return null;
  }

  const handleGithubSignIn = async () => {
    setAuthError(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthError(
        "Supabase credentials not configured in environment. You can freely use Git Lantern in 100% guest mode without logging in!"
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes: "read:user user:email",
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setAuthError(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthError(
        "Supabase credentials not configured in environment. You can freely use Git Lantern in 100% guest mode without logging in!"
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "email profile",
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setAuthError(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      return;
    }

    setAuthError(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthError(
        "Supabase credentials not configured in environment. You can freely use Git Lantern in 100% guest mode without logging in!"
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: emailInput.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setMagicLinkSent(true);
        if (onSuccess) {
          onSuccess(emailInput.trim());
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Magic link delivery failed";
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-githubDark-card border border-githubDark-border rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-githubDark-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gitOrange/15 border border-gitOrange/30 flex items-center justify-center text-gitOrange">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-githubDark-text">
                Sign In (Completely Optional)
              </h3>
              <p className="text-xs text-githubDark-muted">
                Save history & achievements across devices
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-githubDark-muted hover:text-githubDark-text hover:bg-githubDark-surface transition-colors"
            aria-label="Close sign in dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-lg bg-githubDark-deep border border-githubDark-border text-xs text-githubDark-muted leading-relaxed">
            <strong className="text-githubDark-text font-medium">Privacy Promise: </strong>
            Git Lantern is 100% functional without an account. We only request basic email &
            profile scopes and <strong>never request write or repository access</strong>.
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 leading-relaxed">
              {authError}
            </div>
          )}

          {magicLinkSent ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gitOrange/15 text-gitOrange flex items-center justify-center mx-auto border border-gitOrange/30">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-githubDark-text">
                Check Your Inbox
              </h4>
              <p className="text-xs text-githubDark-muted">
                We sent a secure magic sign-in link to{" "}
                <span className="text-gitOrange font-mono">{emailInput}</span>.
              </p>
            </div>
          ) : (
            <>
              {/* OAuth Providers */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-text border border-githubDark-border text-xs font-semibold transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <Github className="w-4 h-4" />
                  <span>Continue with GitHub (Read-Only)</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-githubDark-surface hover:bg-githubDark-elevated text-githubDark-text border border-githubDark-border text-xs font-semibold transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <span className="w-4 h-4 font-bold text-xs">G</span>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-githubDark-borderSubtle" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono text-githubDark-faint">
                  <span className="bg-githubDark-card px-2">Or email magic link</span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="magicEmail" className="text-xs text-githubDark-muted font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-githubDark-faint absolute left-3 top-2.5" />
                    <input
                      id="magicEmail"
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="developer@firstcommit.org"
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg bg-githubDark-deep border border-githubDark-border text-githubDark-text placeholder:text-githubDark-faint focus:outline-none focus:border-gitOrange"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gitOrange hover:bg-gitOrange-600 text-white text-xs font-semibold transition-all shadow-md shadow-gitOrange/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Send Magic Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}

          {/* Continue as Guest */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-githubDark-muted hover:text-gitOrange transition-colors"
            >
              Continue in Guest Mode (No Account Required)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
