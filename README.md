# Git Lantern

> An award-winning developer tool engineered to teach junior developers Git by transforming everyday real-world scenarios into verified, copy-paste ready terminal commands, live state visualizations, and visual failure diagnostics.

Built with passion for the **FirstCommit Hackathon**.

Repository: [https://github.com/mantisdarling/GitLantern](https://github.com/mantisdarling/GitLantern)

---

## The Vision

Git can be intimidating for junior engineers. Abstract concepts like index stages, detached heads, and non-fast-forward push rejections often cause anxiety and accidental code loss.

**Git Lantern illuminates the path forward** by providing three connected core experiences wrapped in an award-winning developer tool aesthetic inspired directly by GitHub dark mode and Linear-level design restraint.

---

## The Three Connected Experiences

### 1. Command Synthesis Engine
- **Scenario Presets**: Pick from real scenarios including starting a new feature, fixing a hotfix, pushing a project for the first time, undoing mistakes, team rebasing, and stashing work.
- **Dynamic Live Inputs**: Type branch names, commit messages, and file paths with real-time sanitization protecting against shell injection.
- **Typewriter Generation**: Watch exact commands synthesize live with syntax highlighting, accompanied by a plain-English mental model explanation.
- **Instant Copy Feedback**: Single-click copy button flashing a checkmark upon success.

### 2. State Mapping Pipeline
- **Interactive Lifecycle Diagram**: Visualizes files moving through four fundamental stages:
  1. **Working Directory** (active files on disk)
  2. **Staging Area** (index preparation)
  3. **Local Repository** (permanent local commits)
  4. **Remote Server** (GitHub / cloud origin)
- **Live Glowing Particle**: An animated Git-orange dot tracks your file across the pipeline as you step through synthesized commands.
- **Stage Inspector**: Click any stage node to reveal what commands move files forward or backward from that specific location.

### 3. Visual Diagnostic Framework & Guided Wizard
- **Color-Coded Failure Cards**: Comprehensive breakdown of common pitfalls:
  - Merge Conflicts
  - Detached HEAD
  - Untracked Files Blocking Checkout
  - Committing to the Wrong Branch
  - Accidental Force Push & Reflog Recovery
  - Accidentally Committed Secrets or .env
  - Non-Fast-Forward Push Rejection
- **Deep Explanations**: What happened in plain English, realistic terminal output stderr preview, and step-by-step copyable recovery commands.
- **Guided "Undo My Mistake" Wizard**: A simple 3-question decision tree that pinpoints your exact problem and lands you directly on the recovery card.

---

## Power Tools & Extra Features

- **Interactive Terminal Simulator**: A built-in terminal sandbox where you can practice commands like `git status`, `git add`, `git commit`, `git log`, `git diff`, and `git push` with realistic responses.
- **Paste Real Error Parser**: Paste raw error text copied from your actual bash/zsh terminal to auto-detect the error signature and scroll to the solution.
- **Running Session History**: An accessible sidebar tracking every command synthesized or executed during your session.
- **Downloadable Cheat Sheet**: Export your personal session history as a beautifully formatted Markdown cheat sheet (`git-lantern-cheatsheet.md`) with a single click.
- **Gamified Achievements**: Unlock 7 mastery badges (*First Branch*, *First Commit*, *First Push*, *Conflict Crusher*, *Time Traveler*, *Terminal Apprentice*, *Lantern Master*) with celebratory confetti.

---

## Architecture & Security

- **Next.js App Router & TypeScript**: Clean, modular components with strict typing throughout.
- **Tailwind CSS & GitHub Dark Aesthetic**: High contrast, subtle borders, Inter for UI text, JetBrains Mono for code.
- **Unified Accent Palette**: Single Git Orange accent tone applied with strict visual consistency.
- **Optional Supabase Authentication**: Full tool functionality in 100% guest mode with local persistence; optional sign-in via GitHub, Google, or Email Magic Link to sync history across devices.
- **Row Level Security (RLS)**: PostgreSQL RLS enabled on all database tables ensuring users can only read and write their own data.
- **Content Security Policy (CSP)**: Strict security headers configured in Next.js.
- **Input Sanitization**: Client-side sanitizers eliminate HTML tags, semicolons, and dangerous shell metacharacters before rendering.
- **Privacy & Data Rights**: Dedicated privacy policy and visible "Delete My Data" action to purge local and cloud storage.
- **Zero Underscore Rule**: Strictly zero underscore characters in any variable, function, component, or file across the codebase.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mantisdarling/GitLantern.git
cd GitLantern

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## Supabase Schema & Setup (Optional)

To enable cross-device cloud sync:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL statements found in `supabase/schema.sql`.
3. Add your credentials to `.env.local`:
   ```bash
   SUPABASEURL=https://your-project.supabase.co
   SUPABASEANONKEY=your-anon-key
   ```

---

## License

MIT License. Open source and built for the developer community.