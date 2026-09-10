export type StageKey = "working" | "staging" | "local" | "remote";

export interface ScenarioInputDefinition {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  helpText: string;
  inputType: "text" | "branch" | "message";
}

export interface ScenarioStep {
  id: string;
  commandTemplate: string;
  explanation: string;
  fromStage: StageKey;
  toStage: StageKey;
  badgeToUnlock?: string;
}

export interface GitScenario {
  id: string;
  title: string;
  subtitle: string;
  category: "basics" | "collaboration" | "troubleshooting" | "workflow";
  inputs: ScenarioInputDefinition[];
  steps: ScenarioStep[];
  tag: string;
}

export interface StageInfo {
  id: StageKey;
  label: string;
  headline: string;
  description: string;
  iconName: string;
  forwardCommands: {
    command: string;
    description: string;
    destination: string;
  }[];
  backwardCommands: {
    command: string;
    description: string;
    destination: string;
  }[];
}

export interface DiagnosticStep {
  stepNumber: number;
  command: string;
  explanation: string;
}

export interface DiagnosticCase {
  id: string;
  title: string;
  category: "conflict" | "state" | "history" | "sync" | "security";
  summary: string;
  severity: "critical" | "warning" | "info";
  errorSignature: string;
  realisticOutput: string;
  rootCause: string;
  recoverySteps: DiagnosticStep[];
  preventionTip: string;
}

export interface WizardQuestion {
  id: string;
  prompt: string;
  detail: string;
  yesNextId: string;
  noNextId: string;
  targetDiagnosticId?: string;
}

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  type: "system" | "success" | "error" | "info";
  timestamp: string;
}

export interface CommandHistoryItem {
  id: string;
  command: string;
  explanation: string;
  source: "synthesis" | "terminal" | "diagnostic";
  timestamp: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "gettingStarted" | "resilience" | "mastery";
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}
