# AVA Notification Popover — Design Spec

**Date:** 2026-05-18
**File:** `~/AVA demo/feature-mockup/ava-mockup.html`
**Figma ref:** `839:50546` (LCUW - Introducing the AI Canvas — Popover frame)

---

## 1. Overview

When AVA finishes responding while the panel is closed, the existing notification plays (pulse ring → shimmer icon loop). This spec adds a popover that appears simultaneously with that animation to explain *why* the button is pulsing. The popover shows once per notification event for 3 seconds, then auto-dismisses.

---

## 2. Trigger & Lifecycle

| Event | Action |
|---|---|
| `showAvaResponse()` called while `!avaIsOpen()` | Show popover immediately, start 3s auto-dismiss timer |
| 3s timer fires | Hide popover, clear timer ref |
| `openAva()` called while popover is showing | Hide popover immediately, clear timer |
| Notification cleared for any other reason | Popover already gone (timer already fired) |

The popover appears **once per notification event only** — it is not shown again on subsequent shimmer loop cycles.

---

## 3. DOM Structure

The popover is injected as a **direct child of `.ava-btn`** (which already has `position: relative`).

```html
<button class="ava-btn" id="ava-toggle">
  <!-- existing content -->
  <div class="ava-notif-popover" id="ava-notif-popover" role="status" aria-live="polite">
    <div class="ava-notif-popover__content">
      <!-- AVA sparkle icon (24px, inline SVG reusing existing paths) -->
      <svg class="ava-notif-popover__icon" ...></svg>
      <span class="ava-notif-popover__text">Response ready</span>
    </div>
    <svg class="ava-notif-popover__arrow" ...></svg>
  </div>
</button>
```

The popover is present in the DOM at all times — shown/hidden via `.visible` class. No dynamic injection required.

---

## 4. Positioning

The popover floats **above and centred on** the AVA button.

| Property | Value | Rationale |
|---|---|---|
| `position` | `absolute` | Anchored to `.ava-btn` (`position: relative`) |
| `bottom` | `calc(100% + 8px)` | 8px gap above the button |
| `left` | `50%` | Centre alignment anchor |
| `transform` | `translateX(-50%)` | Centres the card over the button |
| `white-space` | `nowrap` | Prevents "Response ready" from wrapping |
| `pointer-events` | `none` | Non-interactive — click passes through to button |
| `z-index` | `200` | Above header content, below side panel overlays |

Arrow pointer is pinned to the bottom centre of the card:

| Property | Value |
|---|---|
| `position` | `absolute` |
| `bottom` | `-8px` (height of arrow) |
| `left` | `50%` |
| `transform` | `translateX(-50%)` |

---

## 5. Visual Style

Matches Figma node `839:50546` and NDBX popover component tokens.

### Card (`.ava-notif-popover__content`)

| Property | Value | Source |
|---|---|---|
| Background | `#ffffff` | Figma fill |
| Border | `1px solid #d9d9d9` | Figma stroke / NDBX `--core-color-gray-300` |
| Border-radius | `4px` | Figma `cornerRadius` |
| Padding | `24px 40px 24px 32px` | Figma: top 24 / right 40 / bottom 24 / left 32 |
| Display | `flex` + `align-items: center` + `gap: 8px` | Figma itemSpacing 8px |

**Note:** The `drop-shadow` filter is applied to the **wrapper** `.ava-notif-popover` (not the content div) so that the shadow renders correctly across both the card and the SVG arrow triangle as a unified shape.

| Property | Value | Source |
|---|---|---|
| Filter (on wrapper) | `drop-shadow(0 2px 4px rgba(65,65,65,0.50))` | Figma shadow: offset (0,2), radius 4, color #414141 50% |

### Icon (`.ava-notif-popover__icon`)

| Property | Value |
|---|---|
| Size | `24×24px` |
| Source | Reuse existing inline AVA sparkle gradient SVG paths already in `.ava-icon-default` |
| `flex-shrink` | `0` |

### Text (`.ava-notif-popover__text`)

| Property | Value | Source |
|---|---|---|
| Content | `"Response ready"` | Figma node `text='Response ready'` |
| Font-size | `16px` | Figma `fs=16` |
| Font-weight | `400` | Figma `fw=400` |
| Color | `#414141` | Figma fill `rgba(65,65,65,1)` |
| Font-family | `var(--font-family)` | AllianzNeo per file convention |

### Arrow (`.ava-notif-popover__arrow`)

Downward-pointing triangle, SVG `16×8px`:

| Property | Value |
|---|---|
| Size | `16×8px` |
| Fill | `#ffffff` |
| Stroke | `#d9d9d9` |
| Stroke-width | `1px` (vector-effect: non-scaling-stroke) |
| Shape | Triangle path: `M0,0 L16,0 L8,8 Z` (pointing down) |

---

## 6. Show/Hide Mechanism

CSS-only transition — no layout shift, no JS DOM manipulation beyond class toggling.

```css
.ava-notif-popover {
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}
.ava-notif-popover.visible {
  opacity: 1;
}
```

---

## 7. New JS State

```js
let _avaNotifPopoverTimer = null;
```

One new variable alongside existing `_avaNotifLoopTimer`.

### Show (called from `showAvaResponse()`, inside the `!avaIsOpen()` block):

```js
function _showNotifPopover() {
  const popover = document.getElementById('ava-notif-popover');
  if (!popover) return;
  popover.classList.add('visible');
  _avaNotifPopoverTimer = setTimeout(() => {
    popover.classList.remove('visible');
    _avaNotifPopoverTimer = null;
  }, 3000);
}
```

### Hide (called from `openAva()`, inside the existing notification clear block):

```js
function _hideNotifPopover() {
  clearTimeout(_avaNotifPopoverTimer);
  _avaNotifPopoverTimer = null;
  const popover = document.getElementById('ava-notif-popover');
  if (popover) popover.classList.remove('visible');
}
```

---

## 8. Integration Points

| Location | Change |
|---|---|
| `showAvaResponse()` — inside `if (!avaIsOpen())` block, after `_runNotifCycle()` | Call `_showNotifPopover()` |
| `openAva()` — inside existing `if (avaHasPendingNotification)` clear block | Call `_hideNotifPopover()` |
| HTML — inside `<button class="ava-btn" id="ava-toggle">` | Add `.ava-notif-popover` div |
| CSS — after existing `/* ── AVA button: background-response notification ── */` block | Add popover CSS rules |
| JS state variables — after `let _avaNotifLoopTimer` | Add `let _avaNotifPopoverTimer = null` |

---

## 9. Files Changed

| File | Changes |
|---|---|
| `ava-mockup.html` (HTML) | Add `.ava-notif-popover` structure inside `.ava-btn` |
| `ava-mockup.html` (CSS) | Add popover positioning, card, arrow, and show/hide rules |
| `ava-mockup.html` (JS) | Add `_avaNotifPopoverTimer`, `_showNotifPopover()`, `_hideNotifPopover()`, wire into `showAvaResponse()` and `openAva()` |

---

## 10. Out of Scope

| Item | When |
|---|---|
| Click-to-open-AVA on popover tap | Not needed — popover has `pointer-events: none` |
| Popover in floating (PiP) mode | TBD — AVA toggle button position differs; defer to PiP refinement sprint |
| Animation on popover entry (slide-in) | Not in Figma design — keep opacity fade only |
