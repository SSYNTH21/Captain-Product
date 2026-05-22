# AVA Files Split Panel — Design Spec

**Date:** 2026-05-22
**File:** `AVA demo/feature-mockup/AVA-mockup_update.html`
**Goal:** Replace the full-panel file-mode takeover with a split layout: left chat column (flex-1) + right files column (384px fixed), matching Figma node 953:98054 / 911:78626.

---

## Section 1 — Layout architecture

Same pattern as the sources split. `.ava-body-row` (already present) gains a `files-mode` class that triggers `flex-direction: row`. The existing `.ava-chat-col` is unchanged. A new `.ava-files-col` div (384px fixed) is added as a sibling inside `.ava-body-row`, parallel to `.ava-sources-col`.

**`.ava-panel` stays `flex-col` always.** `files-mode` is applied only to `.ava-body-row`, not to `.ava-panel`.

### Before (current file-mode)

```
.ava-panel (flex-col)
  └── .ava-header          ← full-width
  └── .ava-body-row (flex-col)
        └── .ava-chat-col
              └── .ava-toolbar
              └── .ava-content   ← hidden in file-mode
              └── .ava-footer    ← hidden in file-mode
              └── .ava-file-list ← full-width takeover in file-mode
        └── .ava-sources-col (hidden unless sources-mode)
```

### After (new files-mode)

```
.ava-panel (flex-col)
  └── .ava-header          ← full-width (unchanged)
  └── .ava-body-row (flex-row in files-mode)
        └── .ava-chat-col (flex-1) ← always shows chat
        └── .ava-sources-col      ← unchanged (hidden unless sources-mode)
        └── .ava-files-col (384px fixed) ← new, visible in files-mode
```

`.ava-file-list` (the old full-panel file list inside `.ava-chat-col`) is **removed from the chat column** — file listing moves entirely to `.ava-files-col`.

---

## Section 2 — Files column CSS

| Property | Value |
|---|---|
| Width | `384px`, `flex-shrink: 0` |
| Height | `100%` |
| Border | `border-left: 1px solid #d9d9d9` |
| Overflow | `overflow: hidden` |
| Display | `none` by default; `flex` + `flex-direction: column` when `.ava-body-row.files-mode` |

### Toolbar

| Property | Value |
|---|---|
| Height | `40px` |
| Background | `#f5f5f5` |
| Border bottom | `1px solid #d9d9d9` |
| Padding | `px-24px py-4px` → `padding: 4px 24px` |
| Layout | `display: flex; align-items: center; gap: 16px` |
| Left: label | "Files" — SemiBold 16px `#414141` `line-height: 24px` |
| Right: actions | `gap: 4px; padding-right: 4px` — X close button only (`ava-tertiary-btn`, close icon) |

### Content area

| Property | Value |
|---|---|
| Background | `#ffffff` |
| Padding | `16px` |
| Overflow | `overflow-y: auto` |
| Layout | `display: flex; flex-direction: column; gap: 24px` (between date groups) |
| `flex` | `1 0 0` (fills remaining height below toolbar) |

---

## Section 3 — Date group header (Day Divider)

| Property | Value |
|---|---|
| Text examples | `Today · 5 files attached`, `Last week · 5 files attached` |
| Font | SemiBold 14px |
| Color | `#767676` |
| Line height | `20px` |
| Letter spacing | `0.2px` |
| Container | `display: flex; align-items: center; gap: 12px` |
| No divider lines | Label only — no horizontal rules flanking it |

---

## Section 4 — File row

Each file row structure (directly from Figma node 921:141213 "🧬 File"):

| Part | Spec |
|---|---|
| Outer content row | `display: flex; gap: 8px; align-items: center; padding: 8px 8px 7px 0` |
| Filename area | `flex: 1 0 0; display: flex; gap: 8px; align-items: flex-start; padding: 8px; min-width: 0` |
| PDF icon | 24×24px — reuse existing inline SVG from `.ava-file-list` |
| Filename text | Regular 16px `#414141` `line-height: 24px`; `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1` |
| Date text | Regular 14px `#414141` `line-height: 20px` `letter-spacing: 0.2px`; `text-align: right; flex-shrink: 0; white-space: nowrap` |
| Action button | `ava-tertiary-btn` with vertical 3-dot menu icon (`c-icon--ellipsis-h` or equivalent) |
| Row bottom border | `1px solid #d9d9d9` full-width |
| Row height | ~56px (pt-8 + icon/text 24px + pb-7 + 1px border) |

### Comparison: old vs new file row padding

| Property | Old `.ava-file-list` row | New `.ava-files-col` row |
|---|---|---|
| Left padding | varies (likely 16–24px on outer) | `8px` on filename area, `0` on outer |
| Top padding | likely `12px` | `8px` |
| Bottom padding | likely `12px` | `7px` |
| Right padding | likely `16px` | `8px` on outer |
| Gap (icon → text) | `8px` | `8px` |

---

## Section 5 — JS functions

### `_filesPreState` (module-level)

```js
let _filesPreState = null;
```

### `_enterFilesSplit()`

1. Get `bodyRow = document.getElementById('ava-body-row')`
2. If `!bodyRow` or `panelWrap.classList.contains('floating')` → return
3. Save pre-state: `_filesPreState = { wasExpanded: panelWrap.classList.contains('expanded'), width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640 }`
4. Force 768px: `panelWrap.classList.add('expanded'); panelWrap.style.setProperty('--ava-expanded-w', '768px')`
5. Set bubble max-w: `document.documentElement.style.setProperty('--ava-bubble-max-w', '344px')`
6. Remove `file-mode`, `sources-mode`, `preview-mode` from `.ava-panel`
7. Add `files-mode` to `bodyRow`
8. Show breadcrumb: `_showFileBreadcrumb('Files')`

### `_exitFilesSplit()`

1. Get `bodyRow = document.getElementById('ava-body-row')`
2. If `bodyRow` → `bodyRow.classList.remove('files-mode')`
3. If `_filesPreState`:
   - If `wasExpanded` → restore width + restore `--ava-bubble-max-w` to `(width - 40)px`; reset expand button icon+tooltip to EXPAND state
   - If `!wasExpanded` → `panelWrap.classList.remove('expanded'); panelWrap.style.removeProperty('--ava-expanded-w'); document.documentElement.style.setProperty('--ava-bubble-max-w', '312px')`; reset expand button
4. `_filesPreState = null`

### `exitToChat()` update

Add `_exitFilesSplit()` call alongside the existing `_exitSourcesSplit()` call.

---

## Section 6 — Call sites

The current `enterFileMode()` function is called from:
- File chips in user message bubbles (onclick)
- File chips in AVA message bubbles (onclick)
- "View files" button / "Files" button on AVA response (if present)
- Context menu "Preview" item triggers `enterPreviewMode()`, not `enterFileMode()` — leave unchanged

All `enterFileMode()` call sites are replaced with `_enterFilesSplit()`.

`enterFileMode()` itself is removed (or emptied — prefer removal).

The `file-mode` CSS rules that hide `.ava-content`, `.ava-footer`, `.ava-toolbar` and show `.ava-file-list` are removed. The `.ava-file-list` element inside `.ava-chat-col` is removed from the HTML.

---

## Section 7 — File data for the mockup

The files column is populated with static HTML matching the mockup's existing file data. Two date groups:

| Group | Label | Count |
|---|---|---|
| Group 1 | `Today · 5 files attached` | 5 rows |
| Group 2 | `Last week · 5 files attached` | 5 rows |

Files use the same PDF icon SVG already present in the existing `.ava-file-list`. Date format: `DD/MM/YYYY`. Action button: 3-dot vertical menu (no dropdown needed for mockup — button present but inert).

A module-level `let _filesColHtml = ''` variable holds the static HTML string. Call sites set it immediately before calling `_enterFilesSplit()`, mirroring the `_sourcesHtml` pattern.

---

## Out of scope

- No changes to `enterPreviewMode()` or the preview panel
- No changes to the sources split
- No dropdown on the 3-dot file action button (static mockup)
- No file upload interaction
- Float/PiP mode: `_enterFilesSplit()` guards on `panelWrap.classList.contains('floating')` and returns early — files split does not apply in float mode
