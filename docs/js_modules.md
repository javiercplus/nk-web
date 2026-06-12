# ⚙️ JavaScript Modules

Neko Void Web's interactivity is split into ES6 Modules. The application starts when `app.js` runs and initializes the modules.

## Main Entry Point

[js/app.js](file:///home/crow/nk-web/js/app.js) is loaded as a module in `index.html`. It waits for the DOM to be ready and initializes the UI Orchestrator:
```javascript
import { UIManager } from './ui/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
});
```

---

## Module Breakdown

### 1. UI Orchestrator (`js/ui/UIManager.js`)
The central hub of the user interface. It is responsible for:
- Initializing sub-modules (`Typewriter`, `Lightbox`).
- Managing tab switching (`initNavTabs`) using CSS opacity/transform transitions.
- Handling desktop language dropdown triggers (`initLangDropdown`) by toggling the `.open` class.
- Exposing the global translation callback (`window.setLang`).

### 2. Language Service (`js/services/LanguageService.js`)
Handles automated client-side localization:
- **`detectLanguageFromTimezone()`:** Resolves user timezone string to detect whether to default to English (`en`), Spanish (`es`), or Japanese (`ja`).

### 3. Components

#### Typewriter (`js/components/Typewriter.js`)
Simulates a retro CLI output:
- **`initTypewriter()`:** Types out "Into the void" in the hero header and then stops the cursor animation.
- **`initQuoteHover(uiManager)`:** Triggers typing animation on the console quote box during mouse hover, dynamically matching the language state.

#### Lightbox (`js/components/Lightbox.js`)
Manages the media viewer:
- Listens to clicks on image gallery elements.
- Dynamically populates and toggles the visible state of the fullscreen visual overlay.

---

## Design Pattern: Dependency Injection
To prevent circular dependencies during Vite builds, components must not import the `UIManager` directly. Instead, they receive the context object as an argument:
```javascript
// Inside UIManager.js
initQuoteHover(this);

// Inside Typewriter.js
export function initQuoteHover(uiManager) {
    const currentLang = uiManager.currentLang;
}
```
