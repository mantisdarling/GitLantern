import { DiagnosticCase, StageInfo, WizardQuestion } from "@/lib/types";

export const pipelineStages: StageInfo[] = [
  {
    id: "working",
    label: "Working Directory",
    headline: "Your Active Workspace",
    description:
      "The actual files on your hard drive where you write, edit, and delete code. Changes here are untracked or modified until staged.",
    iconName: "FolderGit2",
    forwardCommands: [
      {
        command: "git add <file>",
        description: "Stages a specific file into the index",
        destination: "Staging Area",
      },
      {
        command: "git add .",
        description: "Stages all modified and new files",
        destination: "Staging Area",
      },
      {
        command: "git stash",
        description: "Shelves uncommitted changes for later retrieval",
        destination: "Stash Stack",
      },
    ],
    backwardCommands: [
      {
        command: "git restore <file>",
        description: "Discards working changes and restores from last commit",
        destination: "Clean Working Directory",
      },
      {
        command: "git clean -fd",
        description: "Force deletes all untracked files and directories",
        destination: "Clean Working Directory",
      },
    ],
  },
  {
    id: "staging",
    label: "Staging Area",
    headline: "The Commit Index",
    description:
      "A preparation zone where you curate exactly which changes will become part of the next permanent commit snapshot.",
    iconName: "Layers",
    forwardCommands: [
      {
        command: 'git commit -m "msg"',
        description: "Packages staged changes into a new local commit",
        destination: "Local Repository",
      },
      {
        command: "git commit --amend",
        description: "Merges staged changes into the most recent commit",
        destination: "Local Repository",
      },
    ],
    backwardCommands: [
      {
        command: "git restore --staged <file>",
        description: "Removes file from stage back to working directory",
        destination: "Working Directory",
      },
      {
        command: "git reset HEAD <file>",
        description: "Classic equivalent of un-staging changes",
        destination: "Working Directory",
      },
    ],
  },
  {
    id: "local",
    label: "Local Repository",
    headline: "Committed History on Disk",
    description:
      "The full local Git history graph containing branches, commits, tags, and HEAD stored in your project's .git database.",
    iconName: "GitCommitHorizontal",
    forwardCommands: [
      {
        command: "git push origin <branch>",
        description: "Transfers local branch commits to the remote server",
        destination: "Remote Server",
      },
      {
        command: "git push -u origin <branch>",
        description: "Pushes commits and binds upstream branch tracking",
        destination: "Remote Server",
      },
    ],
    backwardCommands: [
      {
        command: "git reset --soft HEAD~1",
        description: "Undoes the last commit while preserving changes in staging",
        destination: "Staging Area",
      },
      {
        command: "git reset --mixed HEAD~1",
        description: "Undoes the last commit and leaves changes unstaged",
        destination: "Working Directory",
      },
      {
        command: "git revert <commitHash>",
        description: "Appends a new commit that inverts previous changes safely",
        destination: "New Safe Commit",
      },
    ],
  },
  {
    id: "remote",
    label: "Remote Server",
    headline: "GitHub / Cloud Host",
    description:
      "The centralized remote repository where your team shares code, triggers CI/CD builds, and opens pull requests.",
    iconName: "Cloud",
    forwardCommands: [
      {
        command: "git push --force-with-lease",
        description: "Safely updates remote after local rebasing",
        destination: "Remote Server",
      },
    ],
    backwardCommands: [
      {
        command: "git fetch origin",
        description: "Downloads remote branches without modifying working files",
        destination: "Local Repository",
      },
      {
        command: "git pull origin <branch>",
        description: "Fetches remote commits and immediately merges them into local",
        destination: "Local Repository",
      },
    ],
  },
];

export const diagnosticCases: DiagnosticCase[] = [
  {
    id: "mergeConflicts",
    title: "Merge Conflict Detected",
    category: "conflict",
    severity: "critical",
    summary:
      "Git cannot automatically reconcile conflicting edits on the same lines across different branches.",
    errorSignature: "CONFLICT (content): Merge conflict in",
    realisticOutput: `Auto-merging src/app/dashboard.tsx
CONFLICT (content): Merge conflict in src/app/dashboard.tsx
Automatic merge failed; fix conflicts and then commit the result.`,
    rootCause:
      "Two different commits modified the exact same section of a file, or one deleted a file that the other edited.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git status",
        explanation: "Identifies every file listed under 'Unmerged paths'.",
      },
      {
        stepNumber: 2,
        command: "code .",
        explanation:
          "Open files with <<<<<<< HEAD markers, choose which lines to keep, and delete the marker lines.",
      },
      {
        stepNumber: 3,
        command: "git add .",
        explanation: "Stages the resolved files, marking them as resolved in Git's index.",
      },
      {
        stepNumber: 4,
        command: 'git commit -m "merge: resolve conflicting changes"',
        explanation: "Finalizes the merge commit to restore a clean state.",
      },
    ],
    preventionTip:
      "Pull or rebase from the main branch frequently so your branch never falls hundreds of commits behind.",
  },
  {
    id: "detachedHead",
    title: "Detached HEAD State",
    category: "state",
    severity: "warning",
    summary:
      "HEAD points directly to a commit hash rather than a named branch pointer. New commits will be orphaned if you switch away.",
    errorSignature: "You are in 'detached HEAD' state",
    realisticOutput: `Note: switching to 'a1b2c3d'.
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches.`,
    rootCause:
      "You ran 'git checkout <commitHash>' or 'git checkout origin/main' instead of checking out a local branch name.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git checkout -b rescue-my-work",
        explanation:
          "Creates a new named branch pointing at your current commit so no work is lost.",
      },
      {
        stepNumber: 2,
        command: "git branch",
        explanation: "Confirms you are now safely attached to 'rescue-my-work'.",
      },
    ],
    preventionTip:
      "Always checkout branches by their local name. When inspecting an old commit, use 'git switch -c tempBranch <hash>'.",
  },
  {
    id: "wrongBranch",
    title: "Committed to the Wrong Branch",
    category: "history",
    severity: "warning",
    summary:
      "You wrote code intended for a feature branch, but accidentally committed it straight onto 'main' locally.",
    errorSignature: "committed to main instead of feature",
    realisticOutput: `[main 84f29a1] feat: new fancy button component
 2 files changed, 45 insertions(+)`,
    rootCause:
      "Forgetting to run 'git checkout -b <branch>' before staging and committing.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git branch feature/my-intended-work",
        explanation:
          "Creates the intended feature branch at the current commit with all your new work.",
      },
      {
        stepNumber: 2,
        command: "git reset --hard HEAD~1",
        explanation:
          "Rewinds main back one commit to its clean state before your accidental commit.",
      },
      {
        stepNumber: 3,
        command: "git checkout feature/my-intended-work",
        explanation:
          "Switches over to your new feature branch where your commit is waiting.",
      },
    ],
    preventionTip:
      "Set your terminal prompt to show your current Git branch name so it is visible before every command.",
  },
  {
    id: "untrackedBlocking",
    title: "Untracked Working Files Blocking Checkout",
    category: "state",
    severity: "info",
    summary:
      "Git refuses to switch branches or pull because local untracked files would be overwritten.",
    errorSignature: "The following untracked working tree files would be overwritten",
    realisticOutput: `error: The following untracked working tree files would be overwritten by checkout:
\tconfig/settings.local.json
Please move or remove them before you switch branches.
Aborting`,
    rootCause:
      "Files exist locally that are not tracked, but the target branch has tracked files with identical names.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git stash -u",
        explanation:
          "Shelves your unstaged and untracked files safely into the stash stack.",
      },
      {
        stepNumber: 2,
        command: "git checkout <targetBranch>",
        explanation: "Switches to your target branch without conflict.",
      },
      {
        stepNumber: 3,
        command: "git stash pop",
        explanation:
          "Restores your untracked files back into the working directory.",
      },
    ],
    preventionTip:
      "Add runtime generated files or local environment configs to .gitignore early.",
  },
  {
    id: "forcePushRecovery",
    title: "Accidental Force Push / Lost Commits",
    category: "history",
    severity: "critical",
    summary:
      "You reset or force-pushed over commits that you now need to recover.",
    errorSignature: "forced update / lost commit",
    realisticOutput: ` + 984ab21...1234cde main -> main (forced update)`,
    rootCause:
      "Running 'git reset --hard' or 'git push --force' without checking commit hashes.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git reflog",
        explanation:
          "Displays the chronological journal of every HEAD movement, even deleted commits.",
      },
      {
        stepNumber: 2,
        command: "git checkout -b recovered-work <lostCommitHash>",
        explanation:
          "Creates a new rescue branch directly at the commit hash found in reflog.",
      },
    ],
    preventionTip:
      "Use '--force-with-lease' instead of plain '--force' to prevent overwriting teammates' work.",
  },
  {
    id: "nonFastForward",
    title: "Push Rejected (Non-Fast-Forward)",
    category: "sync",
    severity: "warning",
    summary:
      "Remote contains commits that do not exist in your local branch. Git prevents overwriting.",
    errorSignature: "Updates were rejected because the remote contains work",
    realisticOutput: `To https://github.com/username/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/username/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing`,
    rootCause:
      "A teammate pushed commits to this branch, or you pushed from another computer.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "git fetch origin",
        explanation: "Downloads latest changes without disturbing your working code.",
      },
      {
        stepNumber: 2,
        command: "git rebase origin/<branchName>",
        explanation:
          "Places your local commits neatly on top of the remote commits.",
      },
      {
        stepNumber: 3,
        command: "git push origin <branchName>",
        explanation: "Pushes cleanly now that history is synchronized.",
      },
    ],
    preventionTip:
      "Run 'git pull --rebase' at the start of your workday before starting new commits.",
  },
  {
    id: "committedSecret",
    title: "Accidentally Committed Secret or .env",
    category: "security",
    severity: "critical",
    summary:
      "API keys, passwords, or .env files were accidentally staged and committed into Git history.",
    errorSignature: "committed secret or env file",
    realisticOutput: `[main e3489ab] chore: add api credentials
 1 file changed, 5 insertions(+)
 create mode 100644 .env.local`,
    rootCause:
      "Staging with 'git add .' before creating or checking .gitignore.",
    recoverySteps: [
      {
        stepNumber: 1,
        command: "echo '.env*' >> .gitignore",
        explanation: "Ensures environment files will never be tracked again.",
      },
      {
        stepNumber: 2,
        command: "git rm --cached .env.local",
        explanation:
          "Removes the file from Git tracking while leaving it intact on your hard drive.",
      },
      {
        stepNumber: 3,
        command: 'git commit --amend -m "chore: remove secret from tracking"',
        explanation:
          "Amends the previous commit so the secret never appears in the commit history.",
      },
    ],
    preventionTip:
      "Always set up your .gitignore before writing the very first line of application code.",
  },
];

export const wizardQuestions: WizardQuestion[] = [
  {
    id: "qStart",
    prompt: "Have you already pushed your commits to GitHub / Remote?",
    detail:
      "This determines whether your mistake is isolated to your computer or published publicly.",
    yesNextId: "qRemoteType",
    noNextId: "qLocalType",
  },
  {
    id: "qRemoteType",
    prompt: "Did GitHub reject your push, or did you push something you regret?",
    detail: "Rejection means a sync issue; regret means history rewriting is needed.",
    yesNextId: "qRejectionCheck",
    noNextId: "qRegretCheck",
  },
  {
    id: "qRejectionCheck",
    prompt: "Did the terminal output mention 'fetch first' or '[rejected]'?",
    detail: "Non-fast-forward updates happen when the remote branch is ahead.",
    yesNextId: "resultNonFastForward",
    noNextId: "resultForcePush",
  },
  {
    id: "qRegretCheck",
    prompt: "Did you accidentally commit an API key, password, or .env file?",
    detail: "Committed secrets must be scrubbed immediately.",
    yesNextId: "resultSecret",
    noNextId: "resultForcePush",
  },
  {
    id: "qLocalType",
    prompt: "Are you in an active merge conflict or interrupted rebase?",
    detail: "Look for <<<<<<< HEAD or CONFLICT in your terminal.",
    yesNextId: "resultConflict",
    noNextId: "qBranchOrFiles",
  },
  {
    id: "qBranchOrFiles",
    prompt: "Did you commit your changes to the wrong branch (e.g. main)?",
    detail: "Easily fixed by creating a branch pointer and rewinding main.",
    yesNextId: "resultWrongBranch",
    noNextId: "qDetachedOrUntracked",
  },
  {
    id: "qDetachedOrUntracked",
    prompt: "Does your terminal say 'You are in detached HEAD state'?",
    detail: "Happens when checking out a commit hash instead of a branch.",
    yesNextId: "resultDetached",
    noNextId: "resultUntracked",
  },
  {
    id: "resultConflict",
    prompt: "Merge conflict identified",
    detail: "Redirecting to step-by-step conflict resolution guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "mergeConflicts",
  },
  {
    id: "resultDetached",
    prompt: "Detached HEAD identified",
    detail: "Redirecting to rescue branch guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "detachedHead",
  },
  {
    id: "resultWrongBranch",
    prompt: "Wrong branch commit identified",
    detail: "Redirecting to branch relocation guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "wrongBranch",
  },
  {
    id: "resultUntracked",
    prompt: "Untracked file collision identified",
    detail: "Redirecting to safe stashing guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "untrackedBlocking",
  },
  {
    id: "resultNonFastForward",
    prompt: "Non-fast-forward push rejection identified",
    detail: "Redirecting to rebase sync guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "nonFastForward",
  },
  {
    id: "resultForcePush",
    prompt: "History loss or accidental push identified",
    detail: "Redirecting to reflog recovery guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "forcePushRecovery",
  },
  {
    id: "resultSecret",
    prompt: "Committed secret / .env identified",
    detail: "Redirecting to secret sanitization guide...",
    yesNextId: "",
    noNextId: "",
    targetDiagnosticId: "committedSecret",
  },
];
