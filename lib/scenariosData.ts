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
        placeholder: "feature/user-auth",
        defaultValue: "feature/user-profile-modal",
        helpText: "Use kebab-case with a descriptive prefix like feature/",
        inputType: "branch",
      },
      {
        id: "filePath",
        label: "Modified Files",
        placeholder: "src/components/profile.tsx",
        defaultValue: "src/components/userProfile.tsx",
        helpText: "Specific files to stage or use dot (.) for all",
        inputType: "text",
      },
      {
        id: "commitMessage",
        label: "Commit Message",
        placeholder: "feat: add user profile modal",
        defaultValue: "feat: add responsive user profile modal and stats",
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
      },
      {
        id: "stepStageFiles",
        commandTemplate: "git add {{filePath}}",
        explanation:
          "Moves specified changed files from your working directory into the staging area index.",
        fromStage: "working",
        toStage: "staging",
      },
      {
        id: "stepCommitFeature",
        commandTemplate: 'git commit -m "{{commitMessage}}"',
        explanation:
          "Saves the staged snapshot as a new commit node on your current branch.",
        fromStage: "staging",
        toStage: "local",
        badgeToUnlock: "firstCommit",
      },
      {
        id: "stepPushFeature",
        commandTemplate: "git push -u origin {{branchName}}",
        explanation:
          "Pushes the new branch to GitHub and sets up tracking so future pushes only need 'git push'.",
        fromStage: "local",
        toStage: "remote",
        badgeToUnlock: "firstPush",
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
      },
      {
        id: "stepSwitchMain",
        commandTemplate: "git checkout main",
        explanation:
          "Switches back to the production main branch to ensure your hotfix builds on clean code.",
        fromStage: "working",
        toStage: "local",
      },
      {
        id: "stepPullLatest",
        commandTemplate: "git pull origin main",
        explanation:
          "Fetches and integrates the latest production code so your hotfix is current.",
        fromStage: "remote",
        toStage: "local",
      },
      {
        id: "stepCreateHotfix",
        commandTemplate: "git checkout -b {{hotfixBranch}}",
        explanation:
          "Spawns the hotfix branch directly from the updated production baseline.",
        fromStage: "local",
        toStage: "working",
      },
      {
        id: "stepCommitHotfix",
        commandTemplate: 'git commit -am "{{commitMessage}}"',
        explanation:
          "Stages all modified tracked files and commits the fix in a single step.",
        fromStage: "working",
        toStage: "local",
        badgeToUnlock: "firstCommit",
      },
      {
        id: "stepPushHotfix",
        commandTemplate: "git push -u origin {{hotfixBranch}}",
        explanation:
          "Pushes the hotfix branch to GitHub ready for immediate review and deployment.",
        fromStage: "local",
        toStage: "remote",
        badgeToUnlock: "firstPush",
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
      },
      {
        id: "stepUnstage",
        commandTemplate: "git restore --staged .",
        explanation:
          "Unstages files so they move back to the working directory as unstaged edits.",
        fromStage: "staging",
        toStage: "working",
      },
      {
        id: "stepDiscardSpecific",
        commandTemplate: "git restore {{targetFile}}",
        explanation:
          "Replaces your working directory file with the clean version from the last commit.",
        fromStage: "working",
        toStage: "working",
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
      },
      {
        id: "stepRebase",
        commandTemplate: "git rebase origin/{{baseBranch}}",
        explanation:
          "Replays your feature commits on top of the newest team commits for a linear history.",
        fromStage: "local",
        toStage: "local",
        badgeToUnlock: "conflictCrusher",
      },
      {
        id: "stepPushWithLease",
        commandTemplate: "git push --force-with-lease origin {{currentBranch}}",
        explanation:
          "Safely force-pushes your rebased history, aborting if someone else pushed in the meantime.",
        fromStage: "local",
        toStage: "remote",
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
      },
      {
        id: "stepStashList",
        commandTemplate: "git stash list",
        explanation:
          "Prints the indexed list of all stashes currently stored in your repository.",
        fromStage: "working",
        toStage: "working",
      },
      {
        id: "stepStashPop",
        commandTemplate: "git stash pop",
        explanation:
          "Re-applies the most recent stashed changes to your working tree and deletes it from the stash stack.",
        fromStage: "working",
        toStage: "working",
      },
    ],
  },
];
