---
date: 2026-05-19
topic: AVA Response-Ready Toast
status: approved
---

# AVA Response-Ready Toast

## Goal

Replace the "Response ready" notification popover (anchored above the AVA button) with a viewport-fixed toast that slides up from the bottom-center of the browser. The toast is informational only — it appears for 4s then slides back down. The existing AVA button pulsing animation is unchanged.

## Figma Reference

Node `842:35592` in file `yNnPAeNYg0KLWdqy64XsY9`

## What Changes

### Remove
- HTML: `div#ava-notif-popover` and its children (lines 2918–2923)
- CSS: `.ava-notif-popover`, `.ava-notif-popover.visible`, `.ava-notif-popover__content`, `::before`, `::after`, `.ava-notif-popover__icon`, `.ava-notif-popover__text` (lines 271–325)
- JS: `_avaNotifPopoverTimer` variable, `_showNotifPopover()`, `_hideNotifPopover()` functions (lines 4022–4041)

### Add

**HTML** — placed just before `</body>`:
```html
<div class="ava-toast" id="ava-toast" aria-hidden="true">
  <img class="ava-toast__icon" src="AVA-Sparkle_NEW.gif" alt="" aria-hidden="true">
  <span class="ava-toast__text">Response ready</span>
</div>
```

**CSS** — added in the `<style>` block:
```css
/* ── AVA response-ready toast ── */
.ava-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(calc(100% + 24px));
  opacity: 0;
  width: 320px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #F9F5FB;
  border: 1px solid #8A679C;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(65, 65, 65, 0.5);
  pointer-events: none;
  z-index: 2000;
  transition: opacity 300ms cubic-bezier(0,0,.2,1),
              transform 300ms cubic-bezier(0,0,.2,1);
}
.ava-toast.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
.ava-toast__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.ava-toast__text {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #414141;
}
```

**JS** — replaces the removed popover functions:
```js
let _avaToastTimer = null;

function _showToast() {
  const toast = document.getElementById('ava-toast');
  if (!toast) return;
  toast.classList.add('visible');
  _avaToastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    _avaToastTimer = null;
  }, 4000);
}

function _hideToast() {
  clearTimeout(_avaToastTimer);
  _avaToastTimer = null;
  const toast = document.getElementById('ava-toast');
  if (toast) toast.classList.remove('visible');
}
```

**JS call-sites** — update two references:
- Line ~4532: `_hideNotifPopover()` → `_hideToast()`
- Line ~5064: `_showNotifPopover()` → `_showToast()`

## Behaviour

| Trigger | Action |
|---|---|
| AVA background response completes | `_showToast()` — toast slides up, auto-dismisses after 4s |
| User opens AVA panel | `_hideToast()` — toast immediately slides out |
| Pulsing animation on AVA button | Unchanged — `has-response`/`pulse-ring` classes unaffected |
| Click on toast | No action — `pointer-events: none` |

## Visual Spec

| Property | Value |
|---|---|
| Position | `fixed`, `bottom: 24px`, `left: 50%` (centered) |
| Width | `320px` |
| Background | `#F9F5FB` |
| Border | `1px solid #8A679C` |
| Border-radius | `4px` |
| Shadow | `0px 2px 2px rgba(65,65,65,0.5)` |
| Padding | `16px 24px` |
| Icon | `AVA-Sparkle_NEW.gif`, `20×20px` |
| Icon–text gap | `16px` |
| Text | "Response ready", 16px/400, `#414141` |
| z-index | `2000` |

## Rollback

Revert to the previous commit which contains the `ava-notif-popover` implementation.
