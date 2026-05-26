# PiP Panel Updates & Split Drag Handle Design

## Goal

Five coordinated changes to the AVA floating (PiP) panel and its split-view behaviour:
1. Visual fix — corner radius 12px → 8px, shadow colour
2. PiP maximize size — fixed 900×840px
3. Enable files/sources splits in floating mode
4. Add vertical drag handle between chat and secondary panel in split view
5. Drag handle behaviour — bidirectional resize with 384px minimum per panel

---

## 1. Visual Fixes

### Corner radius
`border-radius` on `.ava-panel-wrap.floating` and `.ava-panel-wrap.floating .ava-panel` changes from `12px` to `8px`.

### Shadow colour
`--shadow-overlay` (defined in `:root`) changes from:
```css
--shadow-overlay: 0 8px 24px rgba(0,0,0,0.20);
```
to:
```css
--shadow-overlay: 0 8px 24px rgba(65,65,65,0.35);
```
This matches the Figma token `Shadows/Bottom/800`.

---

## 2. PiP Maximize Size

`_togglePipMaximize()` maximize branch currently uses `Math.min(1030, window.innerWidth - 48)` for width and `Math.min(window.innerHeight * 0.8, window.innerHeight - 48)` for height.

**New:** Fixed **900×840px**, capped to `(window.innerWidth - 48)` × `(window.innerHeight - 48)` if viewport is smaller.

```js
const w = Math.min(900, window.innerWidth  - 48);
const h = Math.min(840, window.innerHeight - 48);
```

Minimize restores to 384×616 (unchanged).

---

## 3. Splits in Floating Mode

### Remove floating guard
Remove `panelWrap.classList.contains('floating')` early-return from:
- `_enterFilesSplit()`
- `_enterSourcesSplit()`

History split (`_enterHistorySplit`) keeps its floating guard — history panel does not work in PiP.

### Auto-maximize on split entry (floating only)
When `avaIsFloating()` is true and the panel is **not** already at 900×840 (i.e., `avaPipMaximized === false`):
- Call `_togglePipMaximize()` to auto-maximize
- Set a flag `_splitAutoMaximized = true`

When `avaIsFloating()` is true and `avaPipMaximized === true`:
- No resize needed
- `_splitAutoMaximized = false`

### Restore on split exit (floating only)
`_exitFilesSplit()` and `_exitSourcesSplit()` already restore pinned pre-state. Add a parallel restore for floating:

```js
if (avaIsFloating() && _splitAutoMaximized) {
  _togglePipMaximize(); // restores to 384×616
  _splitAutoMaximized = false;
}
```

`_splitAutoMaximized` is a module-level boolean (default `false`). It is also reset to `false` in `exitToChat()`.

### Pre-state in floating mode
The existing `_filesPreState` / `_sourcesPreState` objects track `{ wasExpanded, width }` for the **pinned** path. In floating mode, these are not meaningful (panel size is controlled by `--pip-w` / `--pip-h`, not `--ava-expanded-w`). The floating guard is removed but the pre-state assignment is gated on `!avaIsFloating()`:

```js
if (!_filesPreState && !avaIsFloating()) {
  _filesPreState = { wasExpanded: ..., width: ... };
}
```

This means `_filesPreState` remains `null` in floating mode and the pinned restore path is skipped.

---

## 4. Drag Handle: HTML & CSS

### HTML
A single `.ava-split-handle` div is inserted inside `#ava-body-row`, **between `.ava-chat-col` and `.ava-sources-col`**:

```html
<div class="ava-body-row" id="ava-body-row">
  <!-- History column (left, history-mode only) -->
  <div class="ava-history-col" id="ava-history-col">...</div>

  <!-- Chat column -->
  <div class="ava-chat-col">...</div>

  <!-- Split drag handle — shown in files-mode and sources-mode -->
  <div class="ava-split-handle" id="ava-split-handle"></div>

  <!-- Sources column (right) -->
  <div class="ava-sources-col">...</div>

  <!-- Files column (right) -->
  <div class="ava-files-col" id="ava-files-col">...</div>
</div>
```

One handle element, always present, toggled via CSS.

### CSS

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

/* Shown in any active split mode (not history — history uses border-right on the col itself) */
.ava-body-row.files-mode .ava-split-handle,
.ava-body-row.sources-mode .ava-split-handle {
  display: block;
}
```

---

## 5. Drag Handle Behaviour

### On split entry (`_enterFilesSplit` / `_enterSourcesSplit`)

After the mode class is applied to `bodyRow` (`bodyRow.classList.add('files-mode')` / `bodyRow.classList.add('sources-mode')`), call `_initSplitColumns()`. The secCol query uses the mode class so order matters — mode class first, then init.

```js
function _initSplitColumns() {
  const chatCol = document.querySelector('.ava-chat-col');
  const handle  = document.getElementById('ava-split-handle');
  if (!chatCol || !handle) return;

  // Total available width = panel inner width (excluding handle)
  const panelInner = document.querySelector('.ava-body-row');
  const totalWidth = panelInner.getBoundingClientRect().width - 6; // 6px handle

  // Equal split, clamped to 384px minimum each side
  const half = Math.floor(totalWidth / 2);
  const chatW = Math.max(384, Math.min(totalWidth - 384, half));
  const secW  = totalWidth - chatW;

  chatCol.style.width = chatW + 'px';
  chatCol.style.flex  = 'none';

  // Secondary col width is set by the mode-class (files or sources)
  // We override it here:
  const secCol = document.querySelector('.ava-body-row.files-mode .ava-files-col') ||
                 document.querySelector('.ava-body-row.sources-mode .ava-sources-col');
  if (secCol) secCol.style.width = secW + 'px';

  // Update bubble max-w to match chat col
  document.documentElement.style.setProperty('--ava-bubble-max-w', (chatW - 40) + 'px');
}
```

### During drag

`mousedown` on `.ava-split-handle` starts drag:

```js
let _splitDragState = null;

function _onSplitDragStart(e) {
  e.preventDefault();
  const chatCol = document.querySelector('.ava-chat-col');
  const secCol  = document.querySelector('.ava-body-row.files-mode .ava-files-col') ||
                  document.querySelector('.ava-body-row.sources-mode .ava-sources-col');
  const bodyRow = document.getElementById('ava-body-row');
  if (!chatCol || !secCol || !bodyRow) return;

  _splitDragState = {
    startX:    e.clientX,
    chatW0:    chatCol.getBoundingClientRect().width,
    secW0:     secCol.getBoundingClientRect().width,
    totalWidth: bodyRow.getBoundingClientRect().width - 6
  };

  document.addEventListener('mousemove', _onSplitDragMove);
  document.addEventListener('mouseup',   _onSplitDragEnd);
}

function _onSplitDragMove(e) {
  if (!_splitDragState) return;
  const dx = e.clientX - _splitDragState.startX;
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
```

### On split exit

In `_exitFilesSplit()` and `_exitSourcesSplit()`, reset chat-col to flex layout:

```js
function _resetSplitColumns() {
  const chatCol = document.querySelector('.ava-chat-col');
  if (chatCol) {
    chatCol.style.width = '';
    chatCol.style.flex  = '';
  }
  // Secondary col width is reset by removing its mode class (col goes display:none)
  // No explicit reset needed for secCol
}
```

Call `_resetSplitColumns()` at the start of `_exitFilesSplit()` and `_exitSourcesSplit()`.

---

## Interaction Matrix

| Scenario | Result |
|---|---|
| PiP not maximized → click Files | Auto-maximize 900×840, enter files split, equal split columns |
| PiP already maximized → click Files | Enter files split at current size, equal split columns |
| In files split → drag handle left | Chat narrows (min 384px), files widens |
| In files split → drag handle right | Chat widens, files narrows (min 384px) |
| In files split → click X | `_exitFilesSplit()` → reset columns, restore PiP size if auto-maximized |
| Pinned → click Files | Same split entry, no PiP maximize (uses `--ava-expanded-w: 768px`) |
| Pinned in split → drag handle | Same bidirectional drag, same 384px minimums |

---

## Files Modified

- `AVA demo/feature-mockup/AVA-mockup_update.html` — CSS section and JS section only. No new files.
