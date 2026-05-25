# AVA History Split Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the full-panel history takeover with a 320px left-column split layout — history on the left, full chat visible on the right — using `history-mode` on `#ava-body-row`, matching the files/sources split pattern.

**Architecture:** A new `.ava-history-col` div wraps the existing `#ava-history-panel` as the left sibling of `.ava-chat-col` inside `#ava-body-row`. `history-mode` on `#ava-body-row` triggers `flex-direction: row` and shows the col. `_enterHistorySplit()` / `_exitHistorySplit()` handle pre-state save/restore (704px forced width, restore to default or user's prior expanded width). The old `history-mode` CSS on `.ava-panel` (which hid toolbar/content/footer) is removed entirely.

**Tech Stack:** Plain HTML/CSS/JS, single-file mockup. No build step. Open directly in browser to verify.

---

### Task 1: Add `.ava-history-col` CSS

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — CSS section, after the files-mode rules (~line 1899)

Add CSS for the history column. The history panel inside it already has its own styles; this just controls the column wrapper visibility and sizing.

- [ ] **Step 1: Insert CSS after the files-mode block**

Find this exact line (around line 1899):

```css
    .ava-body-row.files-mode .ava-footer-actions { max-width: none; }
```

Insert after it:

```css

    /* ── History split layout ── */

    /* The history column: fixed 320px, hidden by default, left of chat */
    .ava-history-col {
      display: none;
      flex-direction: column;
      width: 320px;
      flex-shrink: 0;
      border-right: 1px solid #d9d9d9;
      background: #ffffff;
      overflow: hidden;
    }

    /* In history-mode: body-row becomes a side-by-side row, history column becomes visible */
    .ava-body-row.history-mode {
      flex-direction: row;
    }
    .ava-body-row.history-mode .ava-history-col { display: flex; }
    /* Constrain bubbles in the narrower chat column */
    .ava-body-row.history-mode .ava-msg-wrap,
    .ava-body-row.history-mode .ava-footer > * { max-width: 344px; }
    .ava-body-row.history-mode .ava-footer-actions { max-width: none; }
```

- [ ] **Step 2: Verify visually**

Open the file in browser. Open AVA, the layout should be unchanged (history col is hidden). No visual regressions.

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: add .ava-history-col CSS for history split layout"
```

---

### Task 2: Add `.ava-history-col` HTML, move `#ava-history-panel` inside it, update history panel CSS

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — HTML section (~line 3885) and CSS (~line 2207)

The `#ava-history-panel` currently sits directly inside `.ava-panel` (after the chat col and split cols, around line 4030–4077). It needs to move into a new `.ava-history-col` wrapper as the **first child** of `#ava-body-row` (before `.ava-chat-col`).

Also update the `.ava-history-panel` CSS: remove the `display: none` default (the col wrapper now controls visibility), set it to always `display: flex; flex: 1; flex-direction: column; overflow: hidden`.

Remove max-width caps on `.ava-history-search-wrap` and `.ava-history-list > *` — the 320px col already constrains width.

- [ ] **Step 1: Add `.ava-history-col` wrapper as first child of `#ava-body-row`, before `.ava-chat-col`**

Find this (line 3885–3888):

```html
        <div class="ava-body-row" id="ava-body-row">

        <!-- Chat column: toolbar + content + footer (left side in sources-mode split) -->
        <div class="ava-chat-col">
```

Replace with:

```html
        <div class="ava-body-row" id="ava-body-row">

        <!-- History column: shown as left panel in history-mode split -->
        <div class="ava-history-col" id="ava-history-col">
          <!-- #ava-history-panel moved here from below -->
        </div><!-- /ava-history-col -->

        <!-- Chat column: toolbar + content + footer (left side in sources-mode split) -->
        <div class="ava-chat-col">
```

- [ ] **Step 2: Move `#ava-history-panel` block into `#ava-history-col`**

Find the entire history panel block (lines 4030–4077):

```html
        <div class="ava-history-panel" id="ava-history-panel">
          <!-- Search bar -->
          <div class="ava-history-search-wrap">
            ...
          </div>

          <!-- List -->
          <div class="ava-history-list" id="ava-history-list">
            ...
          </div>

          <!-- Help center footer -->
          <div class="ava-history-footer">
            ...
          </div>
        </div>
```

Remove it from its current location and place it inside `#ava-history-col`:

```html
        <!-- History column: shown as left panel in history-mode split -->
        <div class="ava-history-col" id="ava-history-col">
          <div class="ava-history-panel" id="ava-history-panel">
            <!-- Search bar -->
            <div class="ava-history-search-wrap">
              ...
            </div>

            <!-- List -->
            <div class="ava-history-list" id="ava-history-list">
              ...
            </div>

            <!-- Help center footer -->
            <div class="ava-history-footer">
              ...
            </div>
          </div>
        </div><!-- /ava-history-col -->
```

- [ ] **Step 3: Update `.ava-history-panel` CSS (~line 2207)**

Find:

```css
    .ava-history-panel {
      display: none;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
    }
```

Replace with:

```css
    .ava-history-panel {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
    }
```

- [ ] **Step 4: Remove max-width caps that don't fit a 320px column**

Find and remove this property from `.ava-history-search-wrap` (~line 2220):

```css
      max-width: calc(672px + 32px);
```

Find and change `.ava-history-list > *` (~line 2281):

```css
    .ava-history-list > * {
      width: 100%;
      max-width: 672px;
    }
```

Replace with:

```css
    .ava-history-list > * {
      width: 100%;
    }
```

- [ ] **Step 5: Verify in browser**

Open file. AVA history col is hidden by default. No regressions in chat or other splits.

- [ ] **Step 6: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: move #ava-history-panel into .ava-history-col, update panel CSS"
```

---

### Task 3: Remove old `history-mode` CSS rules on `.ava-panel`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — CSS section (~lines 2201–2205)

These rules hide the toolbar/content/footer when history was a full-panel takeover. They must be removed entirely — in the new design the chat remains fully visible alongside the history column.

- [ ] **Step 1: Delete the four old rules**

Find and delete this entire block (lines 2201–2205):

```css
    .ava-panel.history-mode .ava-history-panel { display: flex; }
    .ava-panel.history-mode .ava-toolbar { display: none; }
    .ava-panel.history-mode .ava-content { display: none; }
    .ava-panel.history-mode .ava-footer { display: none; }
    .ava-history-btn.active { background: var(--ui-04); }
```

Note: keep the second `.ava-history-btn.active` rule at line 2378 — that one is correct (`#ececec`). Only delete these five lines.

- [ ] **Step 2: Verify in browser**

Open file. No visual regressions. The old toggle should no longer hide chat content (JS toggle still works — will be fixed in Task 5).

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: remove old history-mode full-panel CSS rules"
```

---

### Task 4: Add `_historyPreState`, `_enterHistorySplit()`, `_exitHistorySplit()`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — JS section, near `_sourcesPreState` declaration (~line 5912)

Add the three new JS pieces immediately after the `exitToChat()` function block (after line 5910), following the exact same pattern as `_sourcesPreState` / `_enterSourcesSplit()` / `_exitSourcesSplit()`.

- [ ] **Step 1: Insert after `exitToChat()` (~after line 5910)**

Find:

```js
  let _sourcesPreState = null;
  let _sourcesHtml = '';
```

Insert before it:

```js
  let _historyPreState = null;

  function _enterHistorySplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow || panelWrap.classList.contains('floating')) return;

    if (!_historyPreState) {
      _historyPreState = {
        wasExpanded: panelWrap.classList.contains('expanded'),
        width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
      };
    }

    panelWrap.classList.add('expanded');
    panelWrap.style.setProperty('--ava-expanded-w', '704px');
    document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');

    bodyRow.classList.add('history-mode');

    const historyBtn = document.getElementById('ava-history-btn');
    if (historyBtn) historyBtn.classList.add('active');
  }

  function _exitHistorySplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('history-mode');

    if (_historyPreState) {
      if (_historyPreState.wasExpanded) {
        panelWrap.style.setProperty('--ava-expanded-w', _historyPreState.width + 'px');
        document.documentElement.style.setProperty('--ava-bubble-max-w', (_historyPreState.width - 40) + 'px');
      } else {
        panelWrap.classList.remove('expanded');
        panelWrap.style.removeProperty('--ava-expanded-w');
        document.documentElement.style.setProperty('--ava-bubble-max-w', '312px');
      }
      _historyPreState = null;
    }

    const historyBtn = document.getElementById('ava-history-btn');
    if (historyBtn) historyBtn.classList.remove('active');
  }

```

- [ ] **Step 2: Verify functions exist**

Open browser console, type `typeof _enterHistorySplit` — should return `"function"`.

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: add _historyPreState, _enterHistorySplit(), _exitHistorySplit()"
```

---

### Task 5: Update `toggleHistoryPanel()`, `exitToChat()`, PiP guard

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — JS section

Three JS call-site updates:

1. `toggleHistoryPanel()` — replace body with enter/exit split calls
2. `exitToChat()` — add `_exitHistorySplit()` call
3. PiP guard in `unpinAva()` — replace old manual class removal with `_exitHistorySplit()`

- [ ] **Step 1: Replace `toggleHistoryPanel()` body (~line 5594)**

Find:

```js
  function toggleHistoryPanel() {
    const avaPanel  = document.querySelector('.ava-panel');
    const historyBtn = document.getElementById('ava-history-btn');
    const isHistory = avaPanel.classList.toggle('history-mode');
    // Close preview-mode if open
    if (isHistory) {
      avaPanel.classList.remove('preview-mode');
      _hideBreadcrumb();
    }
    historyBtn.classList.toggle('active', isHistory);
  }
```

Replace with:

```js
  function toggleHistoryPanel() {
    const bodyRow = document.getElementById('ava-body-row');
    const isHistory = bodyRow && bodyRow.classList.contains('history-mode');
    if (isHistory) {
      _exitHistorySplit();
    } else {
      _enterHistorySplit();
    }
  }
```

- [ ] **Step 2: Add `_exitHistorySplit()` to `exitToChat()` (~line 5904)**

Find:

```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _exitSourcesSplit();
    _exitFilesSplit();
    _hideBreadcrumb();
  }
```

Replace with:

```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _exitSourcesSplit();
    _exitFilesSplit();
    _exitHistorySplit();
    _hideBreadcrumb();
  }
```

- [ ] **Step 3: Replace PiP guard in `unpinAva()` (~line 4493)**

Find:

```js
    // Exit history mode when floating — history panel doesn't belong in pip
    const avaPanel = document.querySelector('.ava-panel');
    if (avaPanel && avaPanel.classList.contains('history-mode')) {
      avaPanel.classList.remove('history-mode');
      const histBtn = document.getElementById('ava-history-btn');
      if (histBtn) histBtn.classList.remove('active');
    }
```

Replace with:

```js
    // Exit history split when entering PiP — history panel doesn't belong in pip
    _exitHistorySplit();
```

- [ ] **Step 4: Verify in browser**

Test A — history toggle:
1. Open AVA (default size)
2. Click History button → history col appears on left, chat on right, panel at 704px, button active ✓
3. Click History button again → history col hides, panel returns to default size, button inactive ✓

Test B — history + close (X):
1. Open history (panel at 704px)
2. Click X (close AVA) → history closes, AVA closes ✓

- [ ] **Step 5: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: wire toggleHistoryPanel, exitToChat, PiP guard to history split"
```

---

### Task 6: Update `toggleExpandAva()` guard for history-mode

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` — JS section (~line 4733)

When history is open and user clicks Expand: close history AND enter maximized state. The expand button stays as Expand (not Minimize) while history is open — this is intentional and different from files/sources.

- [ ] **Step 1: Add history-mode guard to `toggleExpandAva()` (~line 4733)**

Find:

```js
    if (avaIsExpanded()) {
      // If a split panel is open, Minimize closes it instead of collapsing to default
      const bodyRow = document.getElementById('ava-body-row');
      if (bodyRow && bodyRow.classList.contains('sources-mode')) { exitToChat(); return; }
      if (bodyRow && bodyRow.classList.contains('files-mode')) { exitToChat(); return; }
      minimizeAva();
      return;
    }
```

Replace with:

```js
    if (avaIsExpanded()) {
      // If a split panel is open, Minimize closes it instead of collapsing to default
      const bodyRow = document.getElementById('ava-body-row');
      if (bodyRow && bodyRow.classList.contains('sources-mode')) { exitToChat(); return; }
      if (bodyRow && bodyRow.classList.contains('files-mode')) { exitToChat(); return; }
      // History-mode: Expand closes history and maximizes the panel
      if (bodyRow && bodyRow.classList.contains('history-mode')) {
        _exitHistorySplit();
        expandAva();
        return;
      }
      minimizeAva();
      return;
    }
```

- [ ] **Step 2: Verify `expandAva` exists**

Search the file for `function expandAva` to confirm it exists. If it doesn't exist as a named function, find the expand logic inside `toggleExpandAva()` (the block that runs when `!avaIsExpanded()`) and extract what it does — but only if needed. Check first.

- [ ] **Step 3: Verify in browser**

Test — expand while history open:
1. Open AVA (default size)
2. Click History button → panel at 704px with history col visible
3. Click Expand button → history col closes, panel maximizes to full expand width ✓
4. Click Minimize → panel returns to default (NOT 704px, history was discarded) ✓

Test — maximize then open history then expand:
1. Expand AVA manually to max
2. Click History → panel at 704px
3. Click Expand → history closes, panel re-maximizes ✓

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: expand button closes history and maximizes panel"
```
