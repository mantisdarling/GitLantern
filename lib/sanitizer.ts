export function sanitizeBranchName(rawInput: string): string {
  if (!rawInput) {
    return "main";
  }
  return rawInput
    .replace(/[<>"'&;\`|$(){}[\]\\]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/\.{2,}/g, ".")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
}

export function sanitizeCommitMessage(rawInput: string): string {
  if (!rawInput) {
    return "chore: update project";
  }
  return rawInput
    .replace(/<[^>]*>/g, "")
    .replace(/["\`$\\]/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 120);
}

export function sanitizeGenericInput(rawInput: string, fallback: string = ""): string {
  if (!rawInput) {
    return fallback;
  }
  return rawInput
    .replace(/<[^>]*>/g, "")
    .replace(/[;\`|$(){}[\]\\]/g, "")
    .trim()
    .slice(0, 80);
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
