// Procedural Web Audio API sound generator with zero external asset dependencies
// Adheres strictly to zero underscores rule

class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gitLanternSound");
        this.soundEnabled = stored ? JSON.parse(stored) : true;
      } catch {
        this.soundEnabled = true;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gitLanternSound", JSON.stringify(this.soundEnabled));
      } catch {
        // Ignore localStorage error
      }
    }
    return this.soundEnabled;
  }

  public playClick(): void {
    if (!this.soundEnabled) {
      return;
    }
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  public playSuccess(): void {
    if (!this.soundEnabled) {
      return;
    }
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.28);
    } catch {
      // Audio fallback
    }
  }

  public playBadgeUnlock(): void {
    if (!this.soundEnabled) {
      return;
    }
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    try {
      const now = ctx.currentTime;
      const chordNotes = [523.25, 659.25, 783.99, 1046.5];
      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundManager();
