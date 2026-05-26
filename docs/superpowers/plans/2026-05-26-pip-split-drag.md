# PiP Panel Updates & Split Drag Handle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Five coordinated changes to the AVA floating (PiP) panel: visual fixes, fixed maximize size, files/sources splits in floating mode, and a bidirectional drag handle between chat and secondary panels.

**Architecture:** All changes are confined to a single HTML file (`AVA demo/feature-mockup/AVA-mockup_update.html`). CSS changes live in the `<style>` block (lines ~60–3900). JS changes live in the inline `<script>` block (lines ~4300–6270). HTML structure changes are in the `#ava-body-row` section (lines ~3900–4270). No build step — open the file in a browser to test.

**Tech Stack:** Vanilla HTML/CSS/JS, single-file mockup. No dependencies, no build step.

---

## File Structure

One file modified: `AVA demo/feature-mockup/AVA-mockup_update.html`

| Section | Lines (approx) | What changes |
|---|---|---|
| CSS `:root` | ~114 | `--shadow-overlay` colour |
| CSS `.ava-panel-wrap.floating` | ~1348 | `border-radius: 12px → 8px` |
| CSS `.ava-panel-wrap.floating .ava-panel` | ~1360 | `border-radius: 12px → 8px` |
| CSS split cols (after `.ava-files-col` block ~1881) | new | `.ava-split-handle` block |
| HTML `#ava-body-row` | ~4194 | Insert `.ava-split-handle` div |
| JS `_togglePipMaximize()` | ~4710–4711 | `900 × 840` fixed size |
| JS `let _splitAutoMaximized` | new (near `_filesPreState` ~5884) | Module-level flag |
| JS `_exitFilesSplit()` | ~5886 | Prepend `_resetSplitColumns()` + floating restore |
| JS `_exitSourcesSplit()` | ~5908 | Prepend `_resetSplitColumns()` + floating restore |
| JS `_enterSourcesSplit()` | ~5992 | Remove floating guard, gate pre-state on `!avaIsFloating()`, add auto-maximize, call `_initSplitColumns()` |
| JS `_enterFilesSplit()` | ~6060 | Remove floating guard, gate pre-state on `!avaIsFloating()`, add auto-maximize, call `_initSplitColumns()` |
| JS new drag functions | after `_exitSourcesSplit` | `_resetSplitColumns`, `_initSplitColumns`, `_splitDragState`, `_onSplitDragStart/Move/End` |
| JS `exitToChat()` | ~5930 | Reset `_splitAutoMaximized = false` |

---

## Task 1: Visual Fixes — Corner Radius & Shadow Colour

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (lines 114, 1348, 1360)

**How to verify:** Open the file in a browser. Click the unpin button (top-right of AVA panel) to make AVA float. The panel should have a slightly tighter corner radius and a darker shadow than before.

- [ ] **Step 1: Change `--shadow-overlay` at line 114**

Find:
```css
--shadow-overlay: 0 8px 24px rgba(0, 0, 0, 0.20);
```
Replace with:
```css
--shadow-overlay: 0 8px 24px rgba(65, 65, 65, 0.35);
```

- [ ] **Step 2: Change `border-radius` on `.ava-panel-wrap.floating` at line 1348**

Find (inside `.ava-panel-wrap.floating { ... }`):
```css
      border-radius: 12px;
      box-shadow: var(--shadow-overlay);
```
Replace with:
```css
      border-radius: 8px;
      box-shadow: var(--shadow-overlay);
```

- [ ] **Step 3: Change `border-radius` on `.ava-panel-wrap.floating .ava-panel` at line 1360**

Find (inside `.ava-panel-wrap.floating .ava-panel { ... }`):
```css
      border-radius: 12px;
```
Replace with:
```css
      border-radius: 8px;
```

- [ ] **Step 4: Open in browser and verify**

Open `AVA demo/feature-mockup/AVA-mockup_update.html` in a browser. Unpin AVA. Confirm:
- Panel corners are visibly tighter (8px vs 12px)
- Shadow is darker/warmer (grey, not pure-black translucent)

- [ ] **Step 5: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "fix: PiP corner radius 12px→8px, shadow colour rgba(65,65,65,0.35)"
```

---

## Task 2: PiP Maximize Size — 900×840

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (lines 4710–4711)

**How to verify:** Unpin AVA. Click the Maximize button. The panel should expand to 900px wide × 840px tall (or viewport-limited if smaller).

- [ ] **Step 1: Update `_togglePipMaximize()` maximize branch**

Find (lines 4709–4713):
```js
      avaPipMaximized = true;
      const w = Math.min(1030, window.innerWidth  - 48);
      const h = Math.min(Math.round(window.innerHeight * 0.8), window.innerHeight - 48);
      panelWrap.style.setProperty('--pip-w', w + 'px');
      panelWrap.style.setProperty('--pip-h', h + 'px');
```
Replace with:
```js
      avaPipMaximized = true;
      const w = Math.min(900, window.innerWidth  - 48);
      const h = Math.min(840, window.innerHeight - 48);
      panelWrap.style.setProperty('--pip-w', w + 'px');
      panelWrap.style.setProperty('--pip-h', h + 'px');
```

- [ ] **Step 2: Open in browser and verify**

Unpin AVA. Click Maximize. Verify the panel is 900×840 (or viewport-constrained). DevTools: inspect `--pip-w` / `--pip-h` on `.ava-panel-wrap`. Click Minimize to restore to 384×616.

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "fix: PiP maximize size fixed at 900x840px"
```

---

## Task 3: Drag Handle — HTML & CSS

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (HTML ~line 4194, CSS after `.ava-files-col` block ~line 1899)

**How to verify:** Open in browser. Enter files split (click Files button). A 6px vertical bar appears between the chat and files columns. Enter sources split — the same bar appears. Exit — bar disappears.

- [ ] **Step 1: Insert `.ava-split-handle` div into HTML**

Find (line ~4194–4196):
```html
        </div><!-- /ava-chat-col -->

        <!-- Sources column: shown as right panel in sources-mode split -->
```
Replace with:
```html
        </div><!-- /ava-chat-col -->

        <!-- Split drag handle — shown in files-mode and sources-mode -->
        <div class="ava-split-handle" id="ava-split-handle"></div>

        <!-- Sources column: shown as right panel in sources-mode split -->
```

- [ ] **Step 2: Add `.ava-split-handle` CSS after the `.ava-files-col` block**

Find (line ~1899):
```css
    .ava-body-row.files-mode .ava-footer-actions { max-width: none; }
```
After this line, insert:

```css

    /* Drag handle between chat col and secondary col */
    .ava-split-handle {
      display: none;
      width: 6px;
      flex-shrink: 0;
      background: #f5f5f5;
      border-left: 1px solid #d9d9d9;
      border-right: 1px solid #d9d9d9;
      cursor: col-resize;
      position: relative;
      z-index: 1;
      align-self: stretch;
      box-sizing: border-box;
    }

    /* Show handle in files-mode and sources-mode (not history — uses border-right on col) */
    .ava-body-row.files-mode .ava-split-handle,
    .ava-body-row.sources-mode .ava-split-handle {
      display: block;
    }
```

- [ ] **Step 3: Open in browser and verify**

Enter files split. Verify the 6px handle appears between chat and files columns. Enter sources split — same handle appears between chat and sources columns. Exit split — handle hidden. History split — handle not shown (history uses its own border-right).

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: add .ava-split-handle HTML and CSS for files/sources splits"
```

---

## Task 4: Drag Handle — JS Behaviour

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (JS section, after `_exitSourcesSplit` ~line 5928)

**How to verify:** Enter files or sources split. Drag the handle left/right. Both panels resize. Neither panel can go below 384px wide.

- [ ] **Step 1: Add `_splitAutoMaximized` flag and drag helper functions after `_exitSourcesSplit`**

Find (line ~5928–5930):
```js
      _sourcesPreState = null;
    }
  }

  function exitToChat() {
```
Replace with:
```js
      _sourcesPreState = null;
    }
  }

  let _splitAutoMaximized = false;

  function _resetSplitColumns() {
    const chatCol = document.querySelector('.ava-chat-col');
    if (chatCol) {
      chatCol.style.width = '';
      chatCol.style.flex  = '';
    }
  }

  function _initSplitColumns() {
    const chatCol  = document.querySelector('.ava-chat-col');
    const handle   = document.getElementById('ava-split-handle');
    if (!chatCol || !handle) return;

    const panelInner = document.getElementById('ava-body-row');
    const totalWidth = panelInner.getBoundingClientRect().width - 6; // 6px handle

    const half  = Math.floor(totalWidth / 2);
    const chatW = Math.max(384, Math.min(totalWidth - 384, half));
    const secW  = totalWidth - chatW;

    chatCol.style.width = chatW + 'px';
    chatCol.style.flex  = 'none';

    const secCol = document.querySelector('.ava-body-row.files-mode .ava-files-col') ||
                   document.querySelector('.ava-body-row.sources-mode .ava-sources-col');
    if (secCol) secCol.style.width = secW + 'px';

    document.documentElement.style.setProperty('--ava-bubble-max-w', (chatW - 40) + 'px');
  }

  let _splitDragState = null;

  function _onSplitDragStart(e) {
    e.preventDefault();
    const chatCol = document.querySelector('.ava-chat-col');
    const secCol  = document.querySelector('.ava-body-row.files-mode .ava-files-col') ||
                    document.querySelector('.ava-body-row.sources-mode .ava-sources-col');
    const bodyRow = document.getElementById('ava-body-row');
    if (!chatCol || !secCol || !bodyRow) return;

    _splitDragState = {
      startX:     e.clientX,
      chatW0:     chatCol.getBoundingClientRect().width,
      secW0:      secCol.getBoundingClientRect().width,
      totalWidth: bodyRow.getBoundingClientRect().width - 6
    };

    document.addEventListener('mousemove', _onSplitDragMove);
    document.addEventListener('mouseup',   _onSplitDragEnd);
  }

  function _onSplitDragMove(e) {
    if (!_splitDragState) return;
    const dx    = e.clientX - _splitDragState.startX;
    const total = _splitDragState.totalWidth;

    let chatW = _splitDragState.chatW0 + dx;
    chatW = Math.max(384, Math.min(total - 384, chatW));
    const secW = total - chatW;

    const chatCol = document.querySelector('.ava-chat-col');
    const secCol  = document.querySelector('.ava-body-row.files-mode .ava-files-col') ||
                    document.querySelector('.ava-body-row.sources-mode .ava-sources-col');
    if (chatCol) chatCol.style.width = chatW + 'px';
    if (secCol)  secCol.style.width  = secW  + 'px';

    document.documentElement.style.setProperty('--ava-bubble-max-w', (chatW - 40) + 'px');
  }

  function _onSplitDragEnd() {
    _splitDragState = null;
    document.removeEventListener('mousemove', _onSplitDragMove);
    document.removeEventListener('mouseup',   _onSplitDragEnd);
  }

  function exitToChat() {
```

- [ ] **Step 2: Wire `mousedown` listener on the handle**

Find (line ~6225, near the end of the script where other event listeners are registered):
```js
    document.addEventListener('mousedown', hideTip);
```
After this line, add:
```js
    const splitHandle = document.getElementById('ava-split-handle');
    if (splitHandle) splitHandle.addEventListener('mousedown', _onSplitDragStart);
```

- [ ] **Step 3: Open in browser and verify drag**

Enter files split. Drag the handle left → chat shrinks, files widens. Drag right → chat widens, files shrinks. Try to drag past min: both panels stop at 384px. Do the same in sources split.

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: drag handle JS — _initSplitColumns, _onSplitDragStart/Move/End, _resetSplitColumns"
```

---

## Task 5: Enable Splits in Floating Mode & Auto-Maximize

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (JS: `_enterFilesSplit` ~6060, `_enterSourcesSplit` ~5992, `_exitFilesSplit` ~5886, `_exitSourcesSplit` ~5908, `exitToChat` ~5930)

**How to verify:** Unpin AVA (default 384×616). Click Files. Panel auto-maximizes to 900×840 and enters files split with equal columns. Click X to close → panel restores to 384×616. If AVA is already maximized when clicking Files, it enters split without auto-maximizing, and closing does NOT restore size.

- [ ] **Step 1: Update `_enterSourcesSplit()` — remove floating guard, gate pre-state, add auto-maximize, call `_initSplitColumns()`**

Find (lines 5992–6024 — the full `_enterSourcesSplit` function body):
```js
  function _enterSourcesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow || panelWrap.classList.contains('floating')) return;

    // Save pre-state so _exitSourcesSplit can restore it — only on first entry
    if (!_sourcesPreState) {
      _sourcesPreState = {
        wasExpanded: panelWrap.classList.contains('expanded'),
        width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
      };
    }

    // Force 768px split width — bypass hasRoom() guard
    panelWrap.classList.add('expanded');
    panelWrap.style.setProperty('--ava-expanded-w', '768px');
    document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');
    const expandBtnSrc = document.getElementById('ava-expand-btn');
    if (expandBtnSrc) { expandBtnSrc.setAttribute('data-tooltip', 'Minimize'); expandBtnSrc.innerHTML = REDUCE_ICON_SVG; }

    // Close citation popover if open
    _closeCitationPopover();

    // Apply sources-mode to the body row (header stays full-width above the row)
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('preview-mode');
    bodyRow.classList.remove('files-mode');
    bodyRow.classList.add('sources-mode');

    // Populate sources panel
    if (_sourcesHtml) {
      document.getElementById('ava-sources-panel').innerHTML = _sourcesHtml;
    }
  }
```
Replace with:
```js
  function _enterSourcesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow) return;

    // Save pre-state (pinned only — floating uses pip size, not --ava-expanded-w)
    if (!_sourcesPreState && !avaIsFloating()) {
      _sourcesPreState = {
        wasExpanded: panelWrap.classList.contains('expanded'),
        width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
      };
    }

    if (avaIsFloating()) {
      // Auto-maximize if not already at 900×840
      if (!avaPipMaximized) {
        _togglePipMaximize();
        _splitAutoMaximized = true;
      } else {
        _splitAutoMaximized = false;
      }
    } else {
      // Force 768px split width — bypass hasRoom() guard
      panelWrap.classList.add('expanded');
      panelWrap.style.setProperty('--ava-expanded-w', '768px');
      document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');
      const expandBtnSrc = document.getElementById('ava-expand-btn');
      if (expandBtnSrc) { expandBtnSrc.setAttribute('data-tooltip', 'Minimize'); expandBtnSrc.innerHTML = REDUCE_ICON_SVG; }
    }

    // Close citation popover if open
    _closeCitationPopover();

    // Apply sources-mode to the body row (header stays full-width above the row)
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('preview-mode');
    bodyRow.classList.remove('files-mode');
    bodyRow.classList.add('sources-mode');

    // Populate sources panel
    if (_sourcesHtml) {
      document.getElementById('ava-sources-panel').innerHTML = _sourcesHtml;
    }

    _initSplitColumns();
  }
```

- [ ] **Step 2: Update `_enterFilesSplit()` — remove floating guard, gate pre-state, add auto-maximize, call `_initSplitColumns()`**

Find the opening guard in `_enterFilesSplit` (line ~6060–6062):
```js
  function _enterFilesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow || panelWrap.classList.contains('floating')) return;

    // Save pre-state so _exitFilesSplit can restore it — only on first entry
    if (!_filesPreState) {
      _filesPreState = {
        wasExpanded: panelWrap.classList.contains('expanded'),
        width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
      };
    }

    // Force 768px split width — bypass hasRoom() guard
    panelWrap.classList.add('expanded');
    panelWrap.style.setProperty('--ava-expanded-w', '768px');
    document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');
    const expandBtnFiles = document.getElementById('ava-expand-btn');
    if (expandBtnFiles) { expandBtnFiles.setAttribute('data-tooltip', 'Minimize'); expandBtnFiles.innerHTML = REDUCE_ICON_SVG; }

    // Apply files-mode to the body row (header stays full-width above the row)
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('preview-mode');
    bodyRow.classList.remove('sources-mode');
    bodyRow.classList.add('files-mode');
```
Replace with:
```js
  function _enterFilesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow) return;

    // Save pre-state (pinned only — floating uses pip size, not --ava-expanded-w)
    if (!_filesPreState && !avaIsFloating()) {
      _filesPreState = {
        wasExpanded: panelWrap.classList.contains('expanded'),
        width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
      };
    }

    if (avaIsFloating()) {
      // Auto-maximize if not already at 900×840
      if (!avaPipMaximized) {
        _togglePipMaximize();
        _splitAutoMaximized = true;
      } else {
        _splitAutoMaximized = false;
      }
    } else {
      // Force 768px split width — bypass hasRoom() guard
      panelWrap.classList.add('expanded');
      panelWrap.style.setProperty('--ava-expanded-w', '768px');
      document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');
      const expandBtnFiles = document.getElementById('ava-expand-btn');
      if (expandBtnFiles) { expandBtnFiles.setAttribute('data-tooltip', 'Minimize'); expandBtnFiles.innerHTML = REDUCE_ICON_SVG; }
    }

    // Apply files-mode to the body row (header stays full-width above the row)
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('preview-mode');
    bodyRow.classList.remove('sources-mode');
    bodyRow.classList.add('files-mode');
```
Note: the rest of `_enterFilesSplit` (populating the files panel) is unchanged. After `bodyRow.classList.add('files-mode');` and the panel population block, add `_initSplitColumns();` as the last line before the closing `}`.

Find the end of `_enterFilesSplit` (the closing lines just before the `_filesColHtml` const):
```js
      panel.innerHTML = `<div class="ava-files-empty">
        <p class="ava-files-empty-text">No files attached to this chat</p>
        <button class="ava-files-attach-btn" onclick="document.getElementById('ava-attach-input').click()">Attach file</button>
```

Read more to find the closing `}` of `_enterFilesSplit`, then add `_initSplitColumns();` just before it.

- [ ] **Step 3: Find and update the closing `}` of `_enterFilesSplit`**

Read lines 6095–6115 to find the exact closing brace:

```js
      panel.innerHTML = _filesColHtml;
    }
  }
```
The full close is `  }` on its own line. Add `_initSplitColumns();` on the line before `  }`:

Find:
```js
      panel.innerHTML = _filesColHtml;
    }
  }

  const _filesColHtml
```
Replace with:
```js
      panel.innerHTML = _filesColHtml;
    }
    _initSplitColumns();
  }

  const _filesColHtml
```

- [ ] **Step 4: Update `_exitFilesSplit()` — prepend `_resetSplitColumns()` and add floating restore**

Find (line ~5886–5906):
```js
  function _exitFilesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('files-mode');

    if (_filesPreState) {
```
Replace with:
```js
  function _exitFilesSplit() {
    _resetSplitColumns();
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('files-mode');

    if (avaIsFloating() && _splitAutoMaximized) {
      _togglePipMaximize(); // restores to 384×616
      _splitAutoMaximized = false;
    }

    if (_filesPreState) {
```

- [ ] **Step 5: Update `_exitSourcesSplit()` — prepend `_resetSplitColumns()` and add floating restore**

Find (line ~5908–5928):
```js
  function _exitSourcesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('sources-mode');

    if (_sourcesPreState) {
```
Replace with:
```js
  function _exitSourcesSplit() {
    _resetSplitColumns();
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('sources-mode');

    if (avaIsFloating() && _splitAutoMaximized) {
      _togglePipMaximize(); // restores to 384×616
      _splitAutoMaximized = false;
    }

    if (_sourcesPreState) {
```

- [ ] **Step 6: Reset `_splitAutoMaximized` in `exitToChat()`**

Find (line ~5930–5935):
```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _exitSourcesSplit();
    _exitFilesSplit();
```
Replace with:
```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _splitAutoMaximized = false;
    _exitSourcesSplit();
    _exitFilesSplit();
```

- [ ] **Step 7: Open in browser and verify full floating split flow**

1. Unpin AVA (default 384×616). Click Files. Panel should auto-maximize to 900×840, show split with equal columns (~447px each). Handle visible.
2. Drag handle — both panels resize bidirectionally, neither below 384px.
3. Click X / exitToChat — panel restores to 384×616.
4. Unpin AVA. Click Maximize (panel is now 900×840). Click Files. Panel stays 900×840 (no extra maximize). Click X — panel stays 900×840 (was already maximized, not auto-maximized).
5. Pin AVA. Click Files. Panel expands to 768px (pinned flow unchanged). Click X — restores previous state.

- [ ] **Step 8: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: enable files/sources splits in floating mode with auto-maximize"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] § 1 Visual fixes: corner radius + shadow → Tasks 1
- [x] § 2 PiP maximize 900×840 → Task 2
- [x] § 3 Splits in floating mode, `_splitAutoMaximized`, pre-state gated on `!avaIsFloating()`, `_exitFilesSplit`/`_exitSourcesSplit` restore → Task 5
- [x] § 4 Drag handle HTML + CSS → Task 3
- [x] § 5 `_initSplitColumns()`, `_splitDragState`, `_onSplitDragStart/Move/End`, `_resetSplitColumns()`, mousedown listener → Task 4

**Placeholder scan:** None found — all steps have concrete code.

**Type consistency:** `_splitAutoMaximized` declared in Task 4 (after `_exitSourcesSplit`), read in Task 5 (`_exitFilesSplit`/`_exitSourcesSplit`). Declaration appears before first read in file order ✓. `_resetSplitColumns` declared in Task 4, called in Task 5 ✓. `_initSplitColumns` declared in Task 4, called in Task 5 ✓.

**Task order note:** Tasks 3 and 4 can run independently of Task 5. Task 5 depends on Task 4 (`_resetSplitColumns`, `_initSplitColumns`, `_splitAutoMaximized` must exist). Correct execution order: 1 → 2 → 3 → 4 → 5.
