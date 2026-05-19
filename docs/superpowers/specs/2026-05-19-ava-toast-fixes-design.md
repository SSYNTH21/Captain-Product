---
date: 2026-05-19
topic: AVA Toast Fixes — Loop & Icon
status: approved
---

# AVA Toast Fixes — Loop & Icon

## Goal

Fix two issues with the "Response ready" toast:
1. Toast currently shows on every notification loop cycle (should show only once)
2. Toast icon is the animated GIF — replace with the static gradient SVG sparkle

## Fix 1: Toast shows only once per notification

### Root Cause

`_showToast()` is called inside `_runNotifCycle()`, which repeats every ~3s. Each call resets the 4s auto-hide timer, so the toast never dismisses.

### Change

**File:** `AVA demo/feature-mockup/ava-mockup.html`

Move `_showToast()` out of `_runNotifCycle()` and call it once, immediately after `avaHasPendingNotification = true`, before `_runNotifCycle()`:

```js
// Before (inside _runNotifCycle, after btn.classList.add('has-response')):
btn.classList.add('has-response');
_showToast();   // ← REMOVE from here

// After (outside _runNotifCycle, called once when notification starts):
avaHasPendingNotification = true;
_showToast();   // ← ADD here
function _runNotifCycle() { ... }
_runNotifCycle();
```

### Behaviour After Fix

| Event | Toast | Pulsing animation |
|---|---|---|
| Response arrives, AVA closed | Toast slides up once | Pulsing starts |
| 4s elapses | Toast slides down | Pulsing continues |
| User opens AVA | Toast hides immediately (if still visible) | Pulsing stops |

---

## Fix 2: Replace GIF icon with static gradient SVG

### Change

**File:** `AVA demo/feature-mockup/ava-mockup.html`

Replace in toast HTML:
```html
<img class="ava-toast__icon" src="AVA-Sparkle_NEW.gif" alt="" aria-hidden="true">
```

With:
```html
<svg class="ava-toast__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="toast-sparkle-grad" x1="2.20833" y1="2.27778" x2="23.1806" y2="22.0694" gradientUnits="userSpaceOnUse">
      <stop offset="0.0692778" stop-color="#022F6F"/>
      <stop offset="0.455458" stop-color="#5F3C88"/>
      <stop offset="0.51538" stop-color="#5F3C88"/>
      <stop offset="0.876908" stop-color="#0D70A5"/>
    </linearGradient>
  </defs>
  <path d="M13.7759 7.95983C13.3514 6.82211 12.8271 5.36755 12.5996 4.53859C12.1872 3.03585 12 2 12 2C12 2 11.8122 3.03593 11.3996 4.53859C11.168 5.38212 10.6293 6.87357 10.2013 8.01969C9.82314 9.03238 9.03966 9.83932 8.03519 10.2388C6.97221 10.6616 5.61506 11.1776 4.79289 11.3999C3.28688 11.807 2 12 2 12C2 12 3.28686 12.1928 4.79289 12.5999C5.63103 12.8265 7.0251 13.3584 8.09676 13.7856C9.06437 14.1713 9.82903 14.9355 10.2152 15.9029C10.6421 16.9722 11.1732 18.3624 11.3996 19.1999C11.8068 20.706 12 22 12 22C12 22 12.1926 20.706 12.5996 19.1999C12.82 18.3842 13.3298 17.0441 13.7508 15.9869C14.1561 14.9694 14.9792 14.1801 16.0087 13.8061C17.1516 13.391 18.6265 12.8703 19.4614 12.6349C20.9606 12.2123 22 12 22 12C22 12 20.9641 11.8124 19.4614 11.3999C18.6325 11.1724 17.178 10.6482 16.0403 10.2238C14.9919 9.83284 14.1671 9.00813 13.7759 7.95983Z" fill="url(#toast-sparkle-grad)"/>
  <path d="M5.5 3L5.88841 3.98484C6.0917 4.50028 6.49972 4.9083 7.01516 5.11158L8 5.5L7.01516 5.88841C6.49972 6.0917 6.0917 6.49972 5.88841 7.01516L5.5 8L5.11159 7.01516C4.9083 6.49972 4.50028 6.0917 3.98484 5.88841L3 5.5L3.98484 5.11158C4.50028 4.9083 4.9083 4.50028 5.11159 3.98484L5.5 3Z" fill="url(#toast-sparkle-grad)"/>
  <path d="M19.5298 17.3434L19 16L18.4702 17.3434C18.2669 17.8589 17.8589 18.2669 17.3434 18.4702L16 19L17.3434 19.5298C17.8589 19.7331 18.2669 20.1411 18.4702 20.6566L19 22L19.5298 20.6566C19.7331 20.1411 20.1411 19.7331 20.6566 19.5298L22 19L20.6566 18.4702C20.1411 18.2669 19.7331 17.8589 19.5298 17.3434Z" fill="url(#toast-sparkle-grad)"/>
</svg>
```

### CSS

No changes needed. `.ava-toast__icon { width: 20px; height: 20px; flex-shrink: 0; }` applies to SVG elements directly.

### Notes

- Gradient ID `toast-sparkle-grad` is unique — no clash with the button's `paint0/1/2_linear_537_395179` IDs
- The drop-shadow filter from the button SVG is intentionally omitted — not appropriate for a small toast icon
- `aria-hidden="true"` preserved for accessibility

---

## Rollback

Revert both changes via git history.
