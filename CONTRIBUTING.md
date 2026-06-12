# 🤝 Contributing to Neko Void Web

First of all, **thank you for your interest in contributing!** This is the official landing page for Neko Void, and all contributions are welcome.

> **Important note:** Neko Void Web is in an optimization and modularization phase. The priority right now is to **keep the brutalist aesthetic, preserve clean code structure, and maintain scalability**.

---

## 📋 Before starting

Please read this completely. We have some important considerations to keep the project organized:

### 1️⃣ **Explicit and well-documented commits**

Even if we don't work professionally, documentation is key to tracking changes.

**Rule:** Commits must be **clear and specific** using Conventional Commits.

```bash
✅ GOOD:
git commit -m "feat: add support for Japanese translation in details"
git commit -m "fix: adjust mobile layout spacing for brand logo"
git commit -m "docs: add Contributing guide"

❌ BAD:
git commit -m "changes"
git commit -m "updates"
git commit -m "fixed dropdown"
```

**Recommended format:**
```
<type>: <short description>

<optional long description>
```

**Valid types:**
- `feat:` — New functionality (e.g. new section, translation)
- `fix:` — Bug fix (e.g. style bug, JS error)
- `docs:` — Documentation changes
- `refactor:` — Code change without new functionality (e.g. splitting files)
- `style:` — Layout, formatting, visual adjustments without logic changes
- `chore:` — Maintenance tasks (e.g. updating package.json)

---

### 2️⃣ **Found a bug?**

**First:** Verify if the bug is visual or functional.

**Rule:** If the website still runs, **DO NOT FIX THE BUG**, just report it.

**Steps:**
1. Open an Issue with:
   - **Descriptive title:** E.g. "Bug: mobile menu overlaps logo on iPhone 12"
   - **What you expected:** Clear description of how it should look or behave.
   - **What happens:** Screenshot or description of the bug.
   - **Steps to reproduce:** How to trigger it.
   - **Environment:** Browser, screen resolution, OS.

2. **Wait for organization:** Maintainers will decide when and how to fix it.

---

### 3️⃣ **Have a design or feature idea?**

**Rule:** Document the idea, **DO NOT touch the code** until it is discussed.

1. Open a Discussion or Issue with the `enhancement` label.
2. Describe the feature/design and why it fits the **Brutalist Terminal** aesthetic.
3. Wait for feedback before writing code.

---

### 4️⃣ **Are you going to use AI for support?**

**Important rule:** Avoid letting AI modify CSS or JS code unnecessarily.

**Allow:**
✅ Using AI to explain CSS grid behavior  
✅ Using AI to write documentation/comments  
✅ Using AI to propose solutions in issues  

**Do NOT allow:**
❌ AI optimizing CSS selectors on its own without review  
❌ AI refactoring modular files back into monoliths  
❌ AI removing established custom properties (variables)  

---

## 🏗️ Code Standards

### Naming Conventions

| Element | Style | Example |
|:---------|:-------|:--------|
| **JS Functions/Methods** | `camelCase` | `initTypewriter()`, `updateLanguageUI()` |
| **JS Variables** | `camelCase` | `detectedLang`, `typingInterval` |
| **JS Classes/Objects** | `PascalCase` or `camelCase` (for modules) | `UIManager` |
| **CSS Class Names** | `kebab-case` | `.lang-dropdown-trigger`, `.feature-card` |
| **CSS Variables** | `--kebab-case` | `--bg-color`, `--transition-smooth` |
| **Folders** | `lowercase` | `css/`, `js/`, `assets/` |
| **Files** | `snake_case` or `PascalCase` | `LanguageService.js`, `nav.css` |

### Directory Structure

```
nk-web/
├── assets/             # Static assets (images, logo ascii)
├── css/
│   ├── base/           # Variables, Reset, Utilities
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── utilities.css
│   ├── layout/         # Grid, Navigation
│   │   ├── grid.css
│   │   └── nav.css
│   ├── components/     # Cards, Hero, Gallery, Terminal
│   │   ├── cards.css
│   │   ├── hero.css
│   │   ├── gallery.css
│   │   └── terminal.css
│   └── styles.css      # CSS entry point (imports all of the above)
├── js/
│   ├── services/       # Pure logic services (LanguageService.js)
│   ├── components/     # Component UI logic (Typewriter.js, Lightbox.js)
│   ├── ui/             # Page controller (UIManager.js)
│   └── app.js          # Entry point (imports and starts modules)
├── index.html          # Main template
└── vite.config.js      # Vite configuration
```

---

## 🔄 Contribution Flow

### 1. Set up your environment

```bash
# Clone the repository
git clone https://github.com/javiercplus/nk-web.git
cd nk-web

# Install development dependencies (Vite)
npm install
```

### 2. Make your changes

- Run the dev server to preview changes in real time:
  ```bash
  npm run dev
  ```
- Make sure to write modular code. Do not put global styles in component files, nor component logic in global JS services.

### 3. Build and verify

Always verify that the production build compiles without errors before opening a PR:
```bash
# Build the project
npm run build

# Preview the built project locally
npm run preview
```

### 4. Open a Pull Request

**In the PR description:**
- Explain what you changed.
- Reference any related issues (e.g., `Fixes #34`).

---

## ✨ Thank you for contributing!

Neko Void grows thanks to people like you. Keep it brutalist! 🚀
