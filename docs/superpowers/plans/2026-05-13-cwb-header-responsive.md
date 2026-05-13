# CWB Header Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `~/responsive-mockup/ava-responsive.html` — a self-contained static HTML mockup showing the CWB header (header + toolbar) at Large (992px), Medium (704px), and Small (320px) breakpoints, side by side.

**Architecture:** New standalone file in `~/responsive-mockup/`. Copy only the header + toolbar HTML/CSS from `ava-mockup.html`, strip all app shell/panel code, then add responsive rules and a side-by-side frame layout for the three target breakpoints. No JS needed — fully static. AVA panel internals are placeholder only.

**Tech Stack:** Vanilla HTML/CSS, inline styles, NDBX design tokens declared in `:root`, AllianzNeo font base64-embedded (copied from ava-mockup.html).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `~/responsive-mockup/ava-responsive.html` | Create | Self-contained responsive mockup — header + toolbar at 3 breakpoints shown side by side |
| `~/ava-mockup.html` | No change | Source of truth for fonts, tokens, icon SVGs, header/toolbar markup |

---

## Task 1: Create folder and scaffold the file

**Files:**
- Create: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Create the folder**

```bash
mkdir -p ~/responsive-mockup
```

- [ ] **Step 2: Create the file with boilerplate**

Create `~/responsive-mockup/ava-responsive.html` with this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AVA Responsive — CWB Header</title>
  <style>
    /* FONTS — copy AllianzNeo-SemiBold base64 block from ava-mockup.html */
    /* TOKENS */
    /* RESET */
    /* FRAME LAYOUT */
    /* HEADER STYLES */
    /* TOOLBAR STYLES */
    /* RESPONSIVE RULES */
  </style>
</head>
<body>
  <!-- Frames will go here -->
</body>
</html>
```

- [ ] **Step 3: Verify folder and file exist**

```bash
ls ~/responsive-mockup/
```
Expected: `ava-responsive.html`

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "chore: scaffold ava-responsive.html"
```

---

## Task 2: Copy fonts and design tokens

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`
- Reference: `~/ava-mockup.html` (lines 1–130 approx — font face + :root tokens)

- [ ] **Step 1: Copy the @font-face block**

From `~/ava-mockup.html`, find the `@font-face` rule for `AllianzNeo-SemiBold` (the large base64 block near the top of `<style>`). Copy it verbatim into the `/* FONTS */` section of the new file.

- [ ] **Step 2: Copy the :root token block**

From `~/ava-mockup.html`, find the `:root { ... }` block. Copy only these tokens (the rest are AVA-panel-specific and not needed):

```css
:root {
  /* Grey scale */
  --core-color-gray-300: #d9d9d9;
  --core-color-gray-500: #767676;

  /* Semantic surface */
  --semantic-color-surface-default-resting: #ffffff;
  --semantic-color-surface-default-disabled: #f5f5f5;

  /* Text / UI */
  --ui-06: #414141;
  --text-01: #414141;

  /* Action */
  --env-action-primary: #006192;
  --env-action-primary-hover: #008ed6;
  --env-action-primary-active: #003781;

  /* Breadcrumb */
  --breadcrumb-link-color: #006192;
  --breadcrumb-link-hover-color: #008ed6;
  --breadcrumb-link-active-color: #003781;
  --breadcrumb-last-item-font-weight: 600;

  /* Duration */
  --semantic-duration-static-fast: 100ms;
}
```

- [ ] **Step 3: Add reset and base font**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Allianz Neo', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: var(--ui-06);
  background: #e8e8e8;
}
```

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "chore: add fonts and tokens to ava-responsive.html"
```

---

## Task 3: Add frame layout

The page shows three fixed-width frames side by side, labelled "Large (992px)", "Medium (704px)", "Small (320px)". Each frame clips its content to its target width so the breakpoint behaviour is visible without resizing the browser.

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Add the frame layout CSS**

In the `/* FRAME LAYOUT */` section:

```css
.frames-page {
  padding: 40px 32px;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  min-height: 100vh;
}
.frame-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}
.frame-label {
  font-size: 12px;
  font-weight: 600;
  color: #767676;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.frame {
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.frame--large  { width: 992px; }
.frame--medium { width: 704px; }
.frame--small  { width: 320px; }
```

- [ ] **Step 2: Add frame HTML**

```html
<div class="frames-page">

  <div class="frame-wrap">
    <div class="frame-label">Large — 992px</div>
    <div class="frame frame--large">
      <!-- header + toolbar content here -->
    </div>
  </div>

  <div class="frame-wrap">
    <div class="frame-label">Medium — 704px</div>
    <div class="frame frame--medium">
      <!-- header + toolbar content here -->
    </div>
  </div>

  <div class="frame-wrap">
    <div class="frame-label">Small — 320px</div>
    <div class="frame frame--small">
      <!-- header + toolbar content here -->
    </div>
  </div>

</div>
```

- [ ] **Step 3: Open file in browser and verify three blank white frames appear**

```bash
open ~/responsive-mockup/ava-responsive.html
```

Expected: three white boxes of different widths on a grey background, each with a label above.

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "chore: add side-by-side frame layout"
```

---

## Task 4: Add header HTML and base CSS

Copy the header markup from `ava-mockup.html` into each frame. This is the **default (≥1280px) single-row version** — responsive rules come in Task 6.

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`
- Reference: `~/ava-mockup.html` lines 139–278 (header CSS), lines 2346–2437 (header HTML)

- [ ] **Step 1: Copy header CSS into `/* HEADER STYLES */`**

Copy these rule blocks verbatim from `ava-mockup.html`:
- `.header`
- `.header-nav`
- `.header-left`
- `.allianz-logo`
- `.app-title`, `.app-title-divider`, `.app-title-text`
- `.header-nav-items`
- `.header-nav-item`, `.header-nav-item:hover`
- `.header-right`
- `.header-actions`
- `.icon-btn`, `.icon-btn svg`, `.icon-btn:hover`, `.icon-btn:active`
- `.header-avatar`
- `.header-line`

Also copy the inline SVG `<symbol>` + `<defs>` block (Allianz logo and action icons) from near the top of the `<body>` in `ava-mockup.html`.

- [ ] **Step 2: Copy header HTML into each frame**

Paste the full `<header class="header">` … `</header>` block (lines 2346–2437 of `ava-mockup.html`) into all three `.frame` divs. They should be identical at this point — the responsive rules differentiate them later.

- [ ] **Step 3: Verify in browser**

Open `~/responsive-mockup/ava-responsive.html`. All three frames should show the full single-row header with logo, title, nav items, and action icons. The content will overflow on small frames — that's expected at this stage.

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: add header markup and base CSS to responsive mockup"
```

---

## Task 5: Add toolbar HTML and base CSS

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`
- Reference: `~/ava-mockup.html` lines 280–420 (toolbar CSS), lines 2439–2490 (toolbar HTML)

- [ ] **Step 1: Copy toolbar CSS into `/* TOOLBAR STYLES */`**

Copy these rule blocks from `ava-mockup.html`:
- `.toolbar`
- `.breadcrumb`
- `.breadcrumb-item`, `.breadcrumb-item.bold`
- `.breadcrumb-sep`
- `.toolbar-right`
- `.toolbar-divider`
- `.badge`, `.badge-yellow`
- `.submission-block`, `.submission-block strong`
- `.alt-picker`, `.alt-picker-btn`
- `.co-edit-trigger`, `.co-edit-avatar`, `.co-edit-expand-btn` (co-edit hub styles)
- `.sidebar-icon-btn`

- [ ] **Step 2: Copy toolbar HTML into each frame (after the `</header>` tag)**

Paste the full `<!-- TOOLBAR -->` div block from `ava-mockup.html` (lines 2439–2490) into each frame, immediately after the `</header>` close tag.

- [ ] **Step 3: Verify in browser**

All three frames now show header + toolbar. Content will overflow on medium/small — that's expected before responsive rules.

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: add toolbar markup and base CSS to responsive mockup"
```

---

## Task 6: Add two-row header structure (row 2 nav)

Add the scrollable nav row markup and its base (non-responsive) CSS. The row starts hidden; the media query in Task 8 will show it.

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Add modifier class to existing inline nav**

Inside each frame's `<header>`, find `<nav class="header-nav-items">` and add the modifier:

```html
<nav class="header-nav-items header-nav-items--inline">
```

- [ ] **Step 2: Add row 2 HTML in each frame**

Insert this block inside each `<header>`, between the closing `</div>` of `.header-nav` and `<div class="header-line">`:

```html
<!-- Nav row 2 — shown at ≤1279px -->
<div class="header-nav-row2">
  <button class="header-nav-scroll-btn header-nav-scroll-btn--left" onclick="scrollNav(this, -200)" aria-label="Scroll left">
    <svg width="24" height="24" viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="scale(1,-1) translate(0,-1000)">
        <path d="M629.167 128.833L337 421L629.167 713.167C650.083 734.083 650.083 767.833 629.167 788.75C608.25 809.667 574.5 809.667 553.583 788.75L224.667 459.833C203.75 438.917 203.75 405.167 224.667 384.25L553.583 55.3333C574.417 34.5 608.167 34.5 629.083 55.4167C650 76.3333 650.083 110 629.167 128.833Z"/>
      </g>
    </svg>
  </button>
  <div class="header-nav-scrollable" id="header-nav-scrollable-large">
    <span class="header-nav-item2">Dashboard</span>
    <span class="header-nav-item2">Parties</span>
    <span class="header-nav-item2">Submissions</span>
    <span class="header-nav-item2">Task Manager</span>
    <span class="header-nav-item2">Submissions search</span>
    <span class="header-nav-item2">hxReview</span>
    <span class="header-nav-item2">Tools</span>
  </div>
  <button class="header-nav-scroll-btn header-nav-scroll-btn--right" onclick="scrollNav(this, 200)" aria-label="Scroll right">
    <svg width="24" height="24" viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="scale(1,-1) translate(0,-1000)">
        <path d="M370.833 871.167L663 579L370.833 286.833C349.917 265.917 349.917 232.167 370.833 211.25C391.75 190.333 425.5 190.333 446.417 211.25L775.333 540.167C796.25 561.083 796.25 594.833 775.333 615.75L446.417 944.667C425.583 965.5 391.833 965.5 370.917 944.583C350 923.667 349.917 890 370.833 871.167Z"/>
      </g>
    </svg>
  </button>
</div>
<div class="header-line header-line--row2"></div>
```

Note: give each `.header-nav-scrollable` a unique `id` per frame (`header-nav-scrollable-large`, `header-nav-scrollable-medium`, `header-nav-scrollable-small`) so the JS can reference them independently.

- [ ] **Step 3: Add row 2 CSS in `/* HEADER STYLES */`**

```css
/* Row 2 — hidden by default, shown at ≤1279px */
.header-nav-row2 {
  display: none;
  align-items: flex-end;
  position: relative;
  height: 64px;
  padding: 0 8px;
  background: var(--semantic-color-surface-default-resting);
}
.header-nav-scrollable {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 32px;
  overflow-x: scroll;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 12px;
}
.header-nav-scrollable::-webkit-scrollbar { display: none; }
.header-nav-item2 {
  font-size: 16px;
  line-height: 24px;
  color: var(--ui-06);
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
  padding-bottom: 4px;
  transition: color var(--semantic-duration-static-fast);
  position: relative;
}
.header-nav-item2:hover { color: var(--env-action-primary); }
.header-nav-item2.active {
  font-weight: 600;
  border-bottom: 2px solid var(--env-action-primary);
  padding-bottom: 2px;
}
.header-nav-scroll-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-06);
  flex-shrink: 0;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: color var(--semantic-duration-static-fast);
}
.header-nav-scroll-btn:hover { color: var(--env-action-primary); }
.header-nav-scroll-btn.hidden { visibility: hidden; }
.header-line--row2 {
  display: none;
}
```

- [ ] **Step 4: Add scroll JS before `</body>`**

```html
<script>
function scrollNav(btn, delta) {
  var row = btn.parentElement.querySelector('.header-nav-scrollable');
  row.scrollBy({ left: delta, behavior: 'smooth' });
}
function updateScrollBtns(scrollable) {
  var wrap = scrollable.parentElement;
  var leftBtn = wrap.querySelector('.header-nav-scroll-btn--left');
  var rightBtn = wrap.querySelector('.header-nav-scroll-btn--right');
  var atStart = scrollable.scrollLeft <= 0;
  var atEnd = scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 1;
  leftBtn.classList.toggle('hidden', atStart);
  rightBtn.classList.toggle('hidden', atEnd);
}
function initScrollNav() {
  document.querySelectorAll('.header-nav-scrollable').forEach(function(el) {
    updateScrollBtns(el);
    el.addEventListener('scroll', function() { updateScrollBtns(el); });
  });
}
window.addEventListener('load', initScrollNav);
</script>
```

- [ ] **Step 5: Verify in browser — row 2 is not yet visible (correct at this stage)**

- [ ] **Step 6: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: add row-2 nav structure and scroll JS"
```

---

## Task 7: Add toolbar breadcrumb collapse structure

Add the `breadcrumb-level1` wrapper and `breadcrumb-ellipsis` elements so the ≤703px rule can hide/show them independently.

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Refactor breadcrumb HTML in each frame**

Replace the existing breadcrumb markup inside each `.toolbar`:

**Before:**
```html
<div class="breadcrumb">
  <span class="breadcrumb-item">AON Insurance Germany</span>
  <svg class="breadcrumb-sep" ...>...</svg>
  <span class="breadcrumb-item bold">NLP0000005.6.1</span>
</div>
```

**After:**
```html
<div class="breadcrumb toolbar-actions-start">
  <span class="breadcrumb-level1">
    <span class="breadcrumb-item">AON Insurance Germany</span>
    <svg class="breadcrumb-sep" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5.5293 2.8623C5.78996 2.60165 6.21102 2.60164 6.47168 2.8623L11.1377 7.52832C11.3984 7.78899 11.3984 8.21101 11.1377 8.47168L6.47168 13.1377C6.34168 13.2677 6.17067 13.333 6 13.333C5.82945 13.333 5.65924 13.2676 5.5293 13.1377C5.26863 12.877 5.26863 12.456 5.5293 12.1953L9.72461 8L5.5293 3.80469C5.26863 3.54402 5.26863 3.12297 5.5293 2.8623Z" fill="currentColor"/>
    </svg>
  </span>
  <span class="breadcrumb-ellipsis breadcrumb-item" style="color: var(--breadcrumb-link-color); cursor: pointer;">…</span>
  <svg class="breadcrumb-sep" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.5293 2.8623C5.78996 2.60165 6.21102 2.60164 6.47168 2.8623L11.1377 7.52832C11.3984 7.78899 11.3984 8.21101 11.1377 8.47168L6.47168 13.1377C6.34168 13.2677 6.17067 13.333 6 13.333C5.82945 13.333 5.65924 13.2676 5.5293 13.1377C5.26863 12.877 5.26863 12.456 5.5293 12.1953L9.72461 8L5.5293 3.80469C5.26863 3.54402 5.26863 3.12297 5.5293 2.8623Z" fill="currentColor"/>
  </svg>
  <span class="breadcrumb-item bold breadcrumb-current">NLP0000005.6.1</span>
</div>
```

- [ ] **Step 2: Add new CSS**

```css
.toolbar-actions-start {
  /* default: shrink-0 behaviour */
}
.breadcrumb-level1 {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.breadcrumb-ellipsis {
  flex-shrink: 0;
}
.breadcrumb-current {
  /* inherits .breadcrumb-item.bold */
}
```

- [ ] **Step 3: Verify in browser — breadcrumb looks the same as before across all three frames**

- [ ] **Step 4: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: refactor breadcrumb for responsive collapse"
```

---

## Task 8: Add responsive CSS rules

All responsive rules go in the `/* RESPONSIVE RULES */` section. These use frame-scoped selectors so each fixed-width frame displays the correct breakpoint state regardless of the actual browser window width.

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Add frame-scoped responsive CSS**

```css
/* ── Large (992px) and Medium (704px): two-row header ── */
.frame--large .header-nav-items--inline,
.frame--medium .header-nav-items--inline {
  display: none;
}
.frame--large .header-nav-row2,
.frame--medium .header-nav-row2 {
  display: flex;
}
.frame--large .header-line--row2,
.frame--medium .header-line--row2 {
  display: block;
}

/* ── Small (320px): two-row header ── */
.frame--small .header-nav-items--inline {
  display: none;
}
.frame--small .header-nav-row2 {
  display: flex;
}
.frame--small .header-line--row2 {
  display: block;
}

/* ── Small (320px): toolbar breadcrumb collapse ── */
.frame--small .breadcrumb-level1 {
  display: none;
}
.frame--small .toolbar-actions-start {
  flex: 1 0 0;
  min-width: 0;
}
.frame--small .breadcrumb-current {
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

- [ ] **Step 2: Open in browser and verify each frame**

- Large frame (992px): row 1 shows logo/title/actions, row 2 shows scrollable nav. Toolbar shows full breadcrumb.
- Medium frame (704px): same two-row header. Toolbar shows full breadcrumb.
- Small frame (320px): two-row header. Toolbar shows `… > NLP0000005.6.1` (truncated if long).

- [ ] **Step 3: Commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: add frame-scoped responsive rules for header and toolbar"
```

---

## Task 9: Polish and final verification

**Files:**
- Modify: `~/responsive-mockup/ava-responsive.html`

- [ ] **Step 1: Set "Submissions" as the active nav item in all frames**

Find each `.header-nav-item2` for "Submissions" and add `class="header-nav-item2 active"`.

- [ ] **Step 2: Verify scroll buttons on Large frame**

In the browser, check the Large (992px) frame — all 7 nav items should fit without overflow (the scroll buttons should be hidden). If they don't all fit, verify the `.header-nav-scrollable` gap and padding are correct.

- [ ] **Step 3: Verify scroll buttons on Small frame**

In the Small (320px) frame, the nav items should overflow. The left scroll button should be hidden (at scroll start), the right scroll button visible. The left button should appear after you click the right button.

- [ ] **Step 4: Verify toolbar on Small frame**

The toolbar right side (Submission, Alt picker, sidebar icon) should still be visible and not wrapping. The breadcrumb should show `… > NLP0000005.6.1` with truncation if the page name is long.

- [ ] **Step 5: Final commit**

```bash
cd ~ && git add responsive-mockup/ava-responsive.html
git commit -m "feat: complete CWB header responsive mockup"
```
