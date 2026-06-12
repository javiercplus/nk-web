# 🎨 CSS Structure

The CSS architecture is split to avoid the scalability issues of monolithic style files. We organize rules logically from global variables to specific UI elements.

## Folder Structure

All styles are imported in [css/styles.css](file:///home/crow/nk-web/css/styles.css), which serves as the index. The modules are grouped into three layers:

### 1. Base Layer (`css/base/`)
Contains styles that apply globally to the entire document:
- **`variables.css`:** Color palette tokens, fonts, timing/transitions, and glow effects.
- **`reset.css`:** Brutalist font definitions (`Bebas Neue` and `IBM Plex Mono`), reset rules, and custom scrollbar styles.
- **`utilities.css`:** General helper classes (like responsive grids and typography adjustments).

### 2. Layout Layer (`css/layout/`)
Manages high-level structural containers:
- **`grid.css`:** Layout grids and section transitions.
- **`nav.css`:** Desktop header navigation, responsive mobile drawer menu, and language dropdown styling.

### 3. Components Layer (`css/components/`)
Handles styles dedicated to individual, reusable visual units:
- **`hero.css`:** Main branding header, logo float animation, typewriter tags, and the simulated console quote box.
- **`cards.css`:** The feature grids, grid layout item cards, download sections, and Accordion details.
- **`gallery.css`:** Grid systems for images and lightbox overlay styles.
- **`terminal.css`:** Custom terminal styling, custom scrollbars, retro focus states, and the blinking text cursor.

---

## Styling Guidelines

- **No Inline Styles:** Do not write `style="..."` on elements. Add classes instead.
- **BEM Naming:** Use kebab-case naming for elements, modifiers, and sub-elements (e.g. `.lang-dropdown-trigger`, `.lang-option.active`).
- **CSS Variables:** Refer to values in `variables.css` instead of hardcoding raw hex values or transition times.
