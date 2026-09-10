import { GitScenario } from "@/lib/types";

export const gitScenarios: GitScenario[] = [
  {
    id: "firstTimePush",
    title: "Pushing a Repo for the First Time",
    subtitle: "Turn a local folder into a remote GitHub repository step-by-step",
    category: "basics",
    tag: "Essential",
    inputs: [
      {
        id: "remoteUrl",
        label: "Remote Repository URL",
        placeholder: "https://github.com/username/my-awesome-project.git",
        defaultValue: "https://github.com/octocat/hello-world.git",
        helpText: "The HTTPS or SSH clone URL provided by GitHub",
        inputType: "text",
      },
      {
        id: "branchName",
        label: "Primary Branch Name",
        placeholder: "main",
        defaultValue: "main",
        helpText: "Modern GitHub default branch is main",
        inputType: "branch",
      },
      {
        id: "commitMessage",
        label: "Initial Commit Message",
        placeholder: "feat: initial commit",
        defaultValue: "feat: initial commit with project scaffold",
        helpText: "Clear summary of the first snapshot",
        inputType: "message",
      },
    ],
    steps: [
      {
        id: "stepInit",
        commandTemplate: "git init",
        explanation:
          "Initializes an empty Git repository in the current directory by creating a hidden .git folder.",
        fromStage: "working",
        toStage: "working",
      },
      {
        id: "stepAddAll",
        commandTemplate: "git add .",
        explanation:
          "Stages all files in the current folder, preparing them for the first snapshot.",
        fromStage: "working",
        toStage: "staging",
      },
      {
        id: "stepCommit",
        commandTemplate: 'git commit -m "{{commitMessage}}"',
        explanation:
          "Records staged changes permanently into the local repository commit graph.",
        fromStage: "staging",
        toStage: "local",
        badgeToUnlock: "firstCommit",
      },
      {
        id: "stepBranchRename",
        commandTemplate: "git branch -M {{branchName}}",
        explanation:
          "Renames the default master branch to main to align with modern GitHub conventions.",
        fromStage: "local",
        toStage: "local",
      },
      {
        id: "stepRemoteAdd",
        commandTemplate: "git remote add origin {{remoteUrl}}",
        explanation:
          "Registers the remote GitHub server under the standard alias 'origin'.",
        fromStage: "local",
        toStage: "remote",
      },
      {
        id: "stepPushUpstream",
        commandTemplate: "git push -u origin {{branchName}}",
        explanation:
          "Uploads your local commits to GitHub and sets up upstream branch tracking.",
        fromStage: "local",
        toStage: "remote",
        badgeToUnlock: "firstPush",
      },
    ],
  },
  {
    id: "featureBranch",
    title: "Starting a New Feature",
    subtitle: "Create an isolated branch, commit work, and publish to remote",
    category: "workflow",
    tag: "Daily Workflow",
    inputs: [
      {
        id: "branchName",
        label: "Feature Branch Name",
        placeholder: "feature/login-page",
        defaultValue: "feature/login-page",
        helpText: "Use kebab-case with a descriptive prefix like feature/",
        inputType: "branch",
      },
      {
        id: "filePath",
        label: "Modified Files",
        placeholder: "src/auth/LoginForm.tsx",
        defaultValue: "src/auth/LoginForm.tsx",
        helpText: "Specific files to stage or use dot (.) for all",
        inputType: "text",
      },
      {
        id: "commitMessage",
        label: "Commit Message",
        placeholder: "feat: add login page with OAuth",
        defaultValue: "feat: add login page with OAuth and form validation",
        helpText: "Use conventional commit format (feat, fix, docs, refactor)",
        inputType: "message",
      },
    ],
    steps: [
      {
        id: "stepCheckoutBranch",
        commandTemplate: "git checkout -b {{branchName}}",
        explanation:
          "Creates the new feature branch and immediately switches your working tree to it.",
        fromStage: "working",
        toStage: "working",
        badgeToUnlock: "firstBranch",
        flagsBreakdown: [
          {
            flag: "-b",
            meaning: "Creates the branch AND checks it out in one atomic step. Without -b, 'git checkout' only switches to an existing branch. This is the most common way to start new work.",
          },
          {
            flag: "{{branchName}}",
            meaning: "The name of the new branch. Convention: use feature/ for features, fix/ for bug fixes, hotfix/ for production patches, docs/ for documentation.",
          },
        ],
      },
      {
        id: "stepStageFiles",
        commandTemplate: "git add {{filePath}}",
        explanation:
          "Moves specified changed files from your working directory into the staging area index.",
        fromStage: "working",
        toStage: "staging",
        flagsBreakdown: [
          {
            flag: "{{filePath}}",
            meaning: "A specific file path (e.g. src/auth/LoginForm.tsx) to stage only that file, or use '.' to stage everything. You can also use glob patterns like 'src/**/*.tsx'.",
          },
        ],
      },
      {
        id: "stepCommitFeature",
        commandTemplate: 'git commit -m "{{commitMessage}}"',
        explanation:
          "Saves the staged snapshot as a new commit node on your current branch.",
        fromStage: "staging",
        toStage: "local",
        badgeToUnlock: "firstCommit",
        flagsBreakdown: [
          {
            flag: "-m",
            meaning: "Passes the commit message inline without opening a text editor. For a multi-line message, omit -m so Git opens your editor — the first line is the subject and lines after a blank line are the body.",
          },
        ],
      },
      {
        id: "stepPushFeature",
        commandTemplate: "git push -u origin {{branchName}}",
        explanation:
          "Pushes the new branch to GitHub and sets up tracking so future pushes only need 'git push'.",
        fromStage: "local",
        toStage: "remote",
        badgeToUnlock: "firstPush",
        flagsBreakdown: [
          {
            flag: "-u",
            meaning: "Short for --set-upstream. Links your local branch to the remote branch permanently. After running this once, 'git push' and 'git pull' on this branch need no extra arguments.",
          },
        ],
      },
    ],
  },
  {
    id: "bugFixHotfix",
    title: "Fixing a Critical Bug (Hotfix)",
    subtitle: "Safely stash current work, branch from main, patch, and push",
    category: "troubleshooting",
    tag: "Emergency",
    inputs: [
      {
        id: "hotfixBranch",
        label: "Hotfix Branch Name",
        placeholder: "hotfix/login-crash",
        defaultValue: "hotfix/session-token-refresh",
        helpText: "Short name identifying the production issue",
        inputType: "branch",
      },
      {
        id: "commitMessage",
        label: "Bugfix Commit Message",
        placeholder: "fix: handle expired tokens gracefully",
        defaultValue: "fix: resolve session token null pointer on refresh",
        helpText: "Explain what was broken and how it was fixed",
        inputType: "message",
      },
    ],
    steps: [
      {
        id: "stepStash",
        commandTemplate: 'git stash save "wip: work before hotfix"',
        explanation:
          "Shelves your uncommitted edits so your working tree is clean to switch branches.",
        fromStage: "working",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "save",
            meaning: "Saves the stash with a label. Modern Git prefers 'git stash push -m \"message\"' but 'save' is still widely used and understood.",
          },
          {
            flag: '"wip: ..."',
            meaning: "A human-readable label so 'git stash list' shows a clear description rather than an auto-generated hash fragment. Always label your stashes.",
          },
        ],
      },
      {
        id: "stepSwitchMain",
        commandTemplate: "git checkout main",
        explanation:
          "Switches back to the production main branch to ensure your hotfix builds on clean code.",
        fromStage: "working",
        toStage: "local",
        flagsBreakdown: [],
      },
      {
        id: "stepPullLatest",
        commandTemplate: "git pull origin main",
        explanation:
          "Fetches and integrates the latest production code so your hotfix is current.",
        fromStage: "remote",
        toStage: "local",
        flagsBreakdown: [
          {
            flag: "pull",
            meaning: "A shortcut for 'git fetch' then 'git merge'. Downloads remote changes and merges them into your current branch.",
            caution: "Consider 'git pull --rebase' to keep a linear history without creating a merge commit node.",
          },
        ],
      },
      {
        id: "stepCreateHotfix",
        commandTemplate: "git checkout -b {{hotfixBranch}}",
        explanation:
          "Spawns the hotfix branch directly from the updated production baseline.",
        fromStage: "local",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "-b",
            meaning: "Creates the new branch from your current HEAD (now at the latest production commit after the pull) and checks it out immediately in one step.",
          },
        ],
      },
      {
        id: "stepCommitHotfix",
        commandTemplate: 'git commit -am "{{commitMessage}}"',
        explanation:
          "Stages all modified tracked files and commits the fix in a single step.",
        fromStage: "working",
        toStage: "local",
        badgeToUnlock: "firstCommit",
        flagsBreakdown: [
          {
            flag: "-a",
            meaning: "Auto-stages all modified TRACKED files before committing. Skips a separate 'git add' step. Warning: does not stage brand new untracked files.",
            caution: "If you created new files as part of this fix, you must run 'git add <newfile>' first. -a only stages modifications to files Git is already tracking.",
          },
          {
            flag: "-m",
            meaning: "Passes the commit message inline, combined with -a as the shorthand flag -am.",
          },
        ],
      },
      {
        id: "stepPushHotfix",
        commandTemplate: "git push -u origin {{hotfixBranch}}",
        explanation:
          "Pushes the hotfix branch to GitHub ready for immediate review and deployment.",
        fromStage: "local",
        toStage: "remote",
        badgeToUnlock: "firstPush",
        flagsBreakdown: [
          {
            flag: "-u",
            meaning: "Sets the upstream tracking reference so the branch can be fetched and reviewed by teammates without additional configuration.",
          },
        ],
      },
    ],
  },
  {
    id: "undoLastMistake",
    title: "Undoing a Recent Mistake",
    subtitle: "Uncommit without losing code, or discard unwanted edits safely",
    category: "troubleshooting",
    tag: "Safety Net",
    inputs: [
      {
        id: "targetFile",
        label: "File to Discard (Optional)",
        placeholder: "config.json",
        defaultValue: "src/tempExperiment.ts",
        helpText: "Single file to reset, or leave empty if resetting commit",
        inputType: "text",
      },
    ],
    steps: [
      {
        id: "stepUndoCommitSoft",
        commandTemplate: "git reset --soft HEAD~1",
        explanation:
          "Rewinds the last commit but keeps all changes in your staging area so nothing is lost.",
        fromStage: "local",
        toStage: "staging",
        badgeToUnlock: "timeTraveler",
        flagsBreakdown: [
          {
            flag: "--soft",
            meaning: "Moves the branch pointer back one commit but leaves the staging area AND working directory untouched. Your code is safe — just uncommitted.",
          },
          {
            flag: "--hard",
            meaning: "(Alternative) Resets pointer AND discards all staged and working directory changes. Changes are permanently gone (without reflog recovery).",
            caution: "Never use --hard on shared commits others have pulled. It rewrites history and causes divergence for your team.",
          },
          {
            flag: "HEAD~1",
            meaning: "A relative ref meaning 'one commit before HEAD'. HEAD~2 goes back two commits. You can also use the commit SHA directly: 'git reset --soft abc1234'.",
          },
        ],
      },
      {
        id: "stepUnstage",
        commandTemplate: "git restore --staged .",
        explanation:
          "Unstages files so they move back to the working directory as unstaged edits.",
        fromStage: "staging",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "--staged",
            meaning: "Tells 'git restore' to operate on the index (staging area) rather than the working directory. Without this flag, 'git restore .' would discard your working directory changes permanently.",
          },
        ],
      },
      {
        id: "stepDiscardSpecific",
        commandTemplate: "git restore {{targetFile}}",
        explanation:
          "Replaces your working directory file with the clean version from the last commit.",
        fromStage: "working",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "{{targetFile}}",
            meaning: "The file path to restore. Git replaces its content with what's in the most recent commit (or staging area if --staged was passed).",
            caution: "This permanently discards working directory changes for this file. They are NOT moved to trash. Use 'git stash' first if you want to keep them temporarily.",
          },
        ],
      },
    ],
  },
  {
    id: "teamCollaboration",
    title: "Working in a Team & Rebasing",
    subtitle: "Incorporate teammates' latest changes smoothly without ugly merge commits",
    category: "collaboration",
    tag: "Pro Habit",
    inputs: [
      {
        id: "baseBranch",
        label: "Base Branch to Rebase Onto",
        placeholder: "main",
        defaultValue: "main",
        helpText: "The shared branch where teammates merge their PRs",
        inputType: "branch",
      },
      {
        id: "currentBranch",
        label: "Your Working Branch",
        placeholder: "feature/cart-checkout",
        defaultValue: "feature/cart-checkout",
        helpText: "Your active feature branch name",
        inputType: "branch",
      },
    ],
    steps: [
      {
        id: "stepFetchRemote",
        commandTemplate: "git fetch origin",
        explanation:
          "Downloads all commits and branch pointers from GitHub without altering local files.",
        fromStage: "remote",
        toStage: "local",
        flagsBreakdown: [
          {
            flag: "fetch",
            meaning: "Downloads remote refs and objects but does NOT touch your working directory or merge anything. Safe to run at any time. Use 'git log origin/main' to preview changes before rebasing.",
          },
        ],
      },
      {
        id: "stepRebase",
        commandTemplate: "git rebase origin/{{baseBranch}}",
        explanation:
          "Replays your feature commits on top of the newest team commits for a linear history.",
        fromStage: "local",
        toStage: "local",
        badgeToUnlock: "conflictCrusher",
        flagsBreakdown: [
          {
            flag: "rebase",
            meaning: "Takes your branch's commits and replays them one-by-one on top of the target. Result: a clean linear history with no merge commit. Contrast with 'git merge' which creates a dedicated merge commit node.",
          },
          {
            flag: "origin/{{baseBranch}}",
            meaning: "The remote tracking branch to rebase onto — the exact state of main on GitHub after the fetch. More precise than rebasing onto local main which might be behind.",
            caution: "If conflicts arise, fix each file, run 'git add <file>', then 'git rebase --continue'. Run 'git rebase --abort' to cancel entirely.",
          },
        ],
      },
      {
        id: "stepPushWithLease",
        commandTemplate: "git push --force-with-lease origin {{currentBranch}}",
        explanation:
          "Safely force-pushes your rebased history, aborting if someone else pushed in the meantime.",
        fromStage: "local",
        toStage: "remote",
        flagsBreakdown: [
          {
            flag: "--force-with-lease",
            meaning: "A safer alternative to --force. Checks that no one else has pushed to the remote branch since your last fetch. If they have, the push fails instead of overwriting their work.",
            caution: "Never force-push shared branches like main or develop. Only use this on personal feature branches after a rebase.",
          },
        ],
      },
    ],
  },
  {
    id: "stashWorkspace",
    title: "Stashing Work in Progress",
    subtitle: "Quickly save unfinished thoughts and pull down urgent updates",
    category: "workflow",
    tag: "Productivity",
    inputs: [
      {
        id: "stashNote",
        label: "Stash Description Note",
        placeholder: "wip navbar redesign",
        defaultValue: "wip navbar responsive menu",
        helpText: "Brief summary so you remember what this stash contains",
        inputType: "message",
      },
    ],
    steps: [
      {
        id: "stepStashIncludeUntracked",
        commandTemplate: 'git stash save -u "{{stashNote}}"',
        explanation:
          "Shelves both tracked modifications and untracked new files into your stash stack.",
        fromStage: "working",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "-u",
            meaning: "Short for --include-untracked. By default 'git stash' only saves tracked files. Adding -u also stashes new files you haven't run 'git add' on yet.",
          },
          {
            flag: '"{{stashNote}}"',
            meaning: "A descriptive label for the stash entry. Without this, Git generates an unhelpful name like 'WIP on feature/navbar: abc1234 last commit message'. Always label stashes.",
          },
        ],
      },
      {
        id: "stepStashList",
        commandTemplate: "git stash list",
        explanation:
          "Prints the indexed list of all stashes currently stored in your repository.",
        fromStage: "working",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "list",
            meaning: "Shows all entries in your stash stack. stash@{0} is the newest, stash@{1} is before it, etc. Use 'git stash apply stash@{2}' to restore a specific numbered stash.",
          },
        ],
      },
      {
        id: "stepStashPop",
        commandTemplate: "git stash pop",
        explanation:
          "Re-applies the most recent stashed changes to your working tree and deletes it from the stash stack.",
        fromStage: "working",
        toStage: "working",
        flagsBreakdown: [
          {
            flag: "pop",
            meaning: "Applies stash@{0} and removes it from the stash list. Use 'git stash apply' instead if you want to keep the stash entry after applying it.",
            caution: "If applying causes conflicts, Git leaves the stash entry in place — resolve conflicts, then manually drop the stash with 'git stash drop'.",
          },
        ],
      },
    ],
  },
];
