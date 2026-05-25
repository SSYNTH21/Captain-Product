# AVA History Split Panel Design

## Goal

Replace the current full-panel history takeover with a left-column split layout: 320px history column on the left, full chat on the right — both visible simultaneously inside the AVA panel.

## Current behaviour

`toggleHistoryPanel()` adds `history-mode` to `.ava-panel`, which hides `.ava-toolbar`, `.ava-content`, and `.ava-footer` and shows `.ava-history-panel` as a full-panel replacement. The panel size does not change.

## New behaviour

History opens as a 320px left column inside `.ava-body-row`, with the chat remaining fully visible on the right. The panel forces to 704px wide. The expand button stays as Expand (not Minimize). Closing history restores the pre-split size.

---

## Layout & Structure

### `.ava-body-row` split

`history-mode` class moves from `.ava-panel` to `#ava-body-row` (same pattern as `files-mode` / `sources-mode`).

When `history-mode` is active on `#ava-body-row`:
- `flex-direction: row`
- `.ava-history-col` is visible as the left column (320px fixed, `flex-shrink: 0`)
- `.ava-chat-col` takes `flex: 1`, all chat content (toolbar, content, footer) fully visible

### `.ava-history-col`

New structural wrapper div added to `.ava-body-row` HTML, as the first child (left of `.ava-chat-col`):

```html
<div class="ava-history-col" id="ava-history-col">
  <!-- existing #ava-history-panel markup moves here -->
</div>
```

CSS:
```css
.ava-history-col {
  display: none;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid #d9d9d9;
  background: #ffffff;
  overflow: hidden;
}
.ava-body-row.history-mode .ava-history-col { display: flex; }
```

### `.ava-history-panel` CSS changes

The existing `#ava-history-panel` moves inside `#ava-history-col` and fills it entirely:
- Remove `display: none` / `flex` toggle (parent col handles visibility)
- Set `display: flex; flex: 1; flex-direction: column; overflow: hidden`
- Remove `max-width` cap on `.ava-history-search-wrap` (320px col is already the right width)
- `.ava-history-list > *` max-width: remove 672px cap

### Old `history-mode` CSS removed

These rules are deleted entirely:
```css
.ava-panel.history-mode .ava-history-panel { display: flex; }
.ava-panel.history-mode .ava-toolbar { display: none; }
.ava-panel.history-mode .ava-content { display: none; }
.ava-panel.history-mode .ava-footer { display: none; }
```

---

## JavaScript: Enter / Exit

### `_historyPreState`

```js
let _historyPreState = null;
```

### `_enterHistorySplit()`

```js
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
```

### `_exitHistorySplit()`

```js
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

### `toggleHistoryPanel()` updated

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

### `toggleExpandAva()` guard updated

When history is open, clicking Expand closes history then maximizes:

```js
// existing guard block (around line 4736):
if (avaIsExpanded()) {
  const bodyRow = document.getElementById('ava-body-row');
  if (bodyRow && bodyRow.classList.contains('sources-mode')) { exitToChat(); return; }
  if (bodyRow && bodyRow.classList.contains('files-mode')) { exitToChat(); return; }
  if (bodyRow && bodyRow.classList.contains('history-mode')) {
    _exitHistorySplit();
    expandAva(); // enter maximized
    return;
  }
  minimizeAva();
  return;
}
```

Note: `expandAva()` is the existing function that sets the panel to maximized state.

### `exitToChat()` updated

Add `_exitHistorySplit()` call:

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

### Float mode guard

When AVA enters floating (PiP) mode, if history is open it must be closed:

```js
// existing float entry guard (around line 4495):
if (avaPanel && avaPanel.classList.contains('history-mode')) {
  avaPanel.classList.remove('history-mode'); // OLD — remove this
}
// Replace with:
_exitHistorySplit();
```

---

## Interaction matrix

| Scenario | Result |
|---|---|
| Open history (default panel) | pre-state `{ wasExpanded: false }`, panel → 704px |
| Open history (user had maximized) | pre-state `{ wasExpanded: true, width: N }`, panel → 704px |
| Click History button again | `_exitHistorySplit()` → restore pre-state |
| Click Expand while history open | `_exitHistorySplit()` → `expandAva()` (ignore pre-state) |
| Click Close (X) while history open | `exitToChat()` → `_exitHistorySplit()` → restore pre-state |
| Enter PiP while history open | `_exitHistorySplit()` → restore pre-state, then enter PiP |

---

## Reuse principle

- All existing `#ava-history-panel` HTML (search, list, section label, items, footer link) moves unchanged into `#ava-history-col`
- All existing history item CSS (`.ava-history-item`, `.ava-history-section-label`, etc.) is kept as-is
- Only width-related max-width caps on `.ava-history-search-wrap` and `.ava-history-list > *` are removed
- No new panel markup is written
