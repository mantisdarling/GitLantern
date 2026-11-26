export interface SimulatedGitState {
  currentBranch: string;
  branches: string[];
  stagedFiles: string[];
  modifiedFiles: string[];
  untrackedFiles: string[];
  commits: { hash: string; message: string; author: string; time: string }[];
  remotes: { name: string; url: string }[];
  stashes: string[];
}

export const initialSimulatedState: SimulatedGitState = {
  currentBranch: "main",
  branches: ["main", "feature/dark-mode"],
  stagedFiles: [],
  modifiedFiles: ["src/components/lantern.tsx", "README.md"],
  untrackedFiles: ["notes.txt"],
  commits: [
    {
      hash: "8f42e1a",
      message: "feat: initialize git lantern core architecture",
      author: "Junior Dev <dev@gitlantern.dev>",
      time: "2 hours ago",
    },
    {
      hash: "3b91c0d",
      message: "docs: update project documentation",
      author: "Junior Dev <dev@gitlantern.dev>",
      time: "1 day ago",
    },
  ],
  remotes: [{ name: "origin", url: "https://github.com/mantisdarling/GitLantern.git" }],
  stashes: [],
};

export function executeSimulatedCommand(
  rawCommand: string,
  state: SimulatedGitState
): { output: string; newState: SimulatedGitState; matchedDiagnosticId?: string } {
  const trimmed = rawCommand.trim();
  const lower = trimmed.toLowerCase();

  // Check if user pasted an actual error message directly into terminal
  const errorMatch = detectErrorSignature(trimmed);
  if (errorMatch) {
    return {
      output: `[Git Lantern Detector] Recognized Git failure state: "${errorMatch.title}".\nMatching diagnostic framework card ID: ${errorMatch.id}\nClick the diagnostic card below or open the wizard to view the resolution.`,
      newState: state,
      matchedDiagnosticId: errorMatch.id,
    };
  }

  if (trimmed === "clear") {
    return { output: "", newState: state };
  }

  if (trimmed === "help") {
    return {
      output: `Available Git Lantern Simulator Commands:
  git status                Show working tree and staging status
  git add <file> | .        Stage changes for next commit
  git commit -m "<msg>"     Commit staged changes
  git branch                List existing branches
  git checkout -b <name>    Create and switch to new branch
  git checkout <branch>     Switch to existing branch
  git log --oneline         Show recent commit history
  git diff                  View uncommitted line diffs
  git push                  Push commits to origin
  git stash                 Stash working directory changes
  git stash pop             Restore most recent stash
  clear                     Clear terminal screen
  help                      Show this command manual`,
      newState: state,
    };
  }

  if (trimmed === "git status") {
    let response = `On branch ${state.currentBranch}\n`;
    if (state.stagedFiles.length === 0 && state.modifiedFiles.length === 0 && state.untrackedFiles.length === 0) {
      response += "nothing to commit, working tree clean";
      return { output: response, newState: state };
    }

    if (state.stagedFiles.length > 0) {
      response += "Changes to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n";
      for (const staged of state.stagedFiles) {
        response += `\tmodified:   ${staged}\n`;
      }
    }

    if (state.modifiedFiles.length > 0) {
      response += "Changes not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n";
      for (const mod of state.modifiedFiles) {
        response += `\tmodified:   ${mod}\n`;
      }
    }

    if (state.untrackedFiles.length > 0) {
      response += "Untracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n";
      for (const untracked of state.untrackedFiles) {
        response += `\t${untracked}\n`;
      }
    }

    return { output: response.trimEnd(), newState: state };
  }

  if (trimmed === "git add ." || trimmed === "git add -A") {
    const allStaged = Array.from(
      new Set([...state.stagedFiles, ...state.modifiedFiles, ...state.untrackedFiles])
    );
    return {
      output: "",
      newState: {
        ...state,
        stagedFiles: allStaged,
        modifiedFiles: [],
        untrackedFiles: [],
      },
    };
  }

  if (trimmed.startsWith("git add ")) {
    const target = trimmed.replace("git add ", "").trim();
    const newStaged = Array.from(new Set([...state.stagedFiles, target]));
    const newModified = state.modifiedFiles.filter((f) => f !== target);
    const newUntracked = state.untrackedFiles.filter((f) => f !== target);
    return {
      output: "",
      newState: {
        ...state,
        stagedFiles: newStaged,
        modifiedFiles: newModified,
        untrackedFiles: newUntracked,
      },
    };
  }

  if (trimmed.startsWith("git commit")) {
    if (state.stagedFiles.length === 0) {
      return {
        output: "On branch " + state.currentBranch + "\nnothing to commit, working tree clean",
        newState: state,
      };
    }
    const match = trimmed.match(/-m\s+["'](.+?)["']/);
    const message = match ? match[1] : "chore: update files";
    const randomHex = Math.random().toString(16).substring(2, 9);
    const newCommit = {
      hash: randomHex,
      message,
      author: "Junior Dev <dev@gitlantern.dev>",
      time: "just now",
    };
    const count = state.stagedFiles.length;
    const response = `[${state.currentBranch} ${randomHex}] ${message}\n ${count} file${count > 1 ? "s" : ""} changed, 18 insertions(+)`;
    return {
      output: response,
      newState: {
        ...state,
        commits: [newCommit, ...state.commits],
        stagedFiles: [],
      },
    };
  }

  if (trimmed === "git branch") {
    const list = state.branches
      .map((b) => (b === state.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`))
      .join("\n");
    return { output: list, newState: state };
  }

  if (trimmed.startsWith("git checkout -b ")) {
    const branchName = trimmed.replace("git checkout -b ", "").trim();
    const newBranches = state.branches.includes(branchName)
      ? state.branches
      : [...state.branches, branchName];
    return {
      output: `Switched to a new branch '${branchName}'`,
      newState: {
        ...state,
        currentBranch: branchName,
        branches: newBranches,
      },
    };
  }

  if (trimmed.startsWith("git checkout ")) {
    const branchName = trimmed.replace("git checkout ", "").trim();
    if (state.branches.includes(branchName)) {
      return {
        output: `Switched to branch '${branchName}'`,
        newState: {
          ...state,
          currentBranch: branchName,
        },
      };
    }
    return {
      output: `error: pathspec '${branchName}' did not match any file(s) known to git`,
      newState: state,
    };
  }

  if (trimmed === "git log --oneline" || trimmed === "git log") {
    const response = state.commits
      .map((c) => `${c.hash} (${c.hash === state.commits[0].hash ? `HEAD -> ${state.currentBranch}` : ""}) ${c.message}`)
      .join("\n");
    return { output: response, newState: state };
  }

  if (trimmed === "git diff") {
    if (state.modifiedFiles.length === 0) {
      return { output: "", newState: state };
    }
    const diffOutput = `diff --git a/src/components/lantern.tsx b/src/components/lantern.tsx
index 28fa10..99cd12 100644
--- a/src/components/lantern.tsx
+++ b/src/components/lantern.tsx
@@ -14,3 +14,5 @@ export function Lantern() {
+  // Added dynamic visual state mapper
+  const isIlluminated = true;
+  return <div className="glow">{isIlluminated}</div>;
 }`;
    return { output: diffOutput, newState: state };
  }

  if (trimmed.startsWith("git push")) {
    return {
      output: `Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 812 bytes | 812.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0)
To https://github.com/mantisdarling/GitLantern.git
   8f42e1a..${state.commits[0]?.hash || "a1b2c3d"}  ${state.currentBranch} -> ${state.currentBranch}`,
      newState: state,
    };
  }

  if (trimmed === "git stash") {
    if (state.modifiedFiles.length === 0 && state.stagedFiles.length === 0) {
      return { output: "No local changes to save", newState: state };
    }
    return {
      output: `Saved working directory and index state WIP on ${state.currentBranch}: ${state.commits[0]?.hash || "head"} ${state.commits[0]?.message || "wip"}`,
      newState: {
        ...state,
        stashes: ["WIP on " + state.currentBranch, ...state.stashes],
        modifiedFiles: [],
        stagedFiles: [],
      },
    };
  }

  if (trimmed === "git stash pop") {
    if (state.stashes.length === 0) {
      return { output: "error: No stash entries found.", newState: state };
    }
    return {
      output: `On branch ${state.currentBranch}\nChanges not staged for commit:\n\tmodified:   src/components/lantern.tsx\nDropped refs/stash@{0}`,
      newState: {
        ...state,
        stashes: state.stashes.slice(1),
        modifiedFiles: ["src/components/lantern.tsx"],
      },
    };
  }

  if (lower.startsWith("git ")) {
    return {
      output: `git: '${trimmed.replace("git ", "").split(" ")[0]}' is not a recognized command in this simulator. Type 'help' to see supported commands.`,
      newState: state,
    };
  }

  return {
    output: `bash: ${trimmed.split(" ")[0]}: command not found. Did you mean a Git command like 'git status' or 'help'?`,
    newState: state,
  };
}

export function detectErrorSignature(rawText: string): { id: string; title: string } | null {
  const content = rawText.toLowerCase();

  if (content.includes("conflict") || content.includes("merge failed") || content.includes("<<<<<<<")) {
    return { id: "mergeConflicts", title: "Merge Conflict" };
  }
  if (content.includes("detached head") || content.includes("switching to '") || content.includes("detached")) {
    return { id: "detachedHead", title: "Detached HEAD State" };
  }
  if (
    content.includes("untracked working tree files would be overwritten") ||
    content.includes("overwritten by checkout")
  ) {
    return { id: "untrackedBlocking", title: "Untracked Files Collision" };
  }
  if (
    content.includes("updates were rejected because the remote contains work") ||
    content.includes("fetch first") ||
    content.includes("non-fast-forward")
  ) {
    return { id: "nonFastForward", title: "Push Rejected (Non-Fast-Forward)" };
  }
  if (content.includes("forced update") || content.includes("reflog") || content.includes("lost commit")) {
    return { id: "forcePushRecovery", title: "Force Push / Lost Commit Recovery" };
  }
  if (content.includes(".env") || content.includes("secret") || content.includes("token")) {
    return { id: "committedSecret", title: "Committed Secret / .env Alert" };
  }
  return null;
}
