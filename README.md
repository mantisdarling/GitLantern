# Git Lantern

Turn Git tasks into exact commands, see where your files move across Git stages, and fix common repository mistakes.

Repository: [https://github.com/mantisdarling/GitLantern](https://github.com/mantisdarling/GitLantern)

## What It Does

### 1. Command Generator
* **Task Presets**: Covers starting a feature branch, fixing a hotfix, pushing a new project, undoing commits, rebasing with a team, and stashing changes.
* **Live Inputs**: Edit branch names, file paths, and commit messages with client side sanitization against shell metacharacters.
* **Flag Breakdown**: Open "Why this command?" on any card to read what each flag does and any safety warnings.
* **Quick Copy**: Copy any command with one click or by pressing `C`.

### 2. Git State Pipeline
* **Four Stage View**: Shows how files move between your working folder, staging area, local repository, and remote server.
* **Stage Inspector**: Click any stage to list the commands that move files forward or roll them back.

### 3. Recovery Guides & Wizard
* **Failure Guides**: Covers merge conflicts, detached HEAD, untracked files blocking checkout, commits on the wrong branch, accidental force pushes, committed secrets, and rejected pushes.
* **Guided Wizard**: Answer 3 questions to jump straight to the matching fix.

### 4. Terminal Sandbox
* **In Browser Shell**: Practice `git status`, `git add`, `git commit`, `git log`, `git diff`, and `git push` with tab autocomplete.
* **Error Matcher**: Paste terminal error text to jump directly to the matching recovery guide.

### 5. Extras
* **Session History & Export**: View commands from your session and download them as a Markdown file.
* **Shortcuts & Tour**: Press `?` for keyboard shortcuts (`Ctrl+K`, `C`, `1` to `4`) or open the quick tour from the header.

## Running Locally

### Prerequisites
* Node.js 18+ or 20+
* npm, yarn, or pnpm

### Commands

```bash
git clone https://github.com/mantisdarling/GitLantern.git
cd GitLantern
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm run build
npm run start
```

## License

MIT License
