# 🌐 Translations and Localization

This guide explains how multi-language support works and how to manage copy.

## Language Selection Strategy

The page defaults to the language determined by the user's timezone, and supports manual selection.

### 1. Automated Detection
We check the browser's timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone` in `LanguageService.js`. If the timezone indicates Spain/Latin America, we default to `es`. If Japan, we default to `ja`. Otherwise, it falls back to `en`.

### 2. Manual Switching
When a user clicks a language selector, the function `window.setLang(lang)` is invoked. This:
- Updates the active language state on `UIManager`.
- Updates UI classes.
- Resets the typewriter quotes to typable states.

---

## Managing Translatable Content

Translations are stored directly in the markup for immediate SEO parsing, using class-based hiding.

### CSS Hiding Logic
In [css/layout/nav.css](file:///home/crow/nk-web/css/layout/nav.css):
```css
body.lang-es .en { display: none !important; }
body.lang-en .es { display: none !important; }
body.lang-en .ja { display: none !important; }
...
```
When `UIManager` updates the active language, it replaces the class on `body` (e.g. `body.lang-es`). This triggers the CSS rules to show/hide the correct elements instantly.

### Adding Translatable Items
To add a piece of translated text, wrap the translation strings in elements with their language classes:
```html
<p>
    <span class="en">Hello World</span>
    <span class="es">Hola Mundo</span>
    <span class="ja">ハロー・ワールド</span>
</p>
```
