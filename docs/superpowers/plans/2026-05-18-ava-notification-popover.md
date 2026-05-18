# AVA Notification Popover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Response ready" popover above the AVA toggle button that appears once (for 3 seconds) when a background response arrives, then auto-dismisses — giving users context for why the button is animating.

**Architecture:** The popover is a static `<div>` inside the existing `<button class="ava-btn">` element, shown/hidden via a `.visible` CSS class. Two helper functions (`_showNotifPopover` / `_hideNotifPopover`) manage the 3-second timer. The existing `showAvaResponse()` and `openAva()` functions are each extended with one line.

**Tech Stack:** Vanilla HTML/CSS/JS, single self-contained file. No build step. File: `~/AVA demo/feature-mockup/ava-mockup.html`

---

## File Structure

| File | What changes |
|---|---|
| `~/AVA demo/feature-mockup/ava-mockup.html` (CSS) | Add `.ava-notif-popover` rules after the existing notification block (~line 260) |
| `~/AVA demo/feature-mockup/ava-mockup.html` (HTML) | Add popover `<div>` inside `<button class="ava-btn">` (~line 2853) |
| `~/AVA demo/feature-mockup/ava-mockup.html` (JS state) | Add `let _avaNotifPopoverTimer = null` after `let _avaNotifLoopTimer` (~line 3959) |
| `~/AVA demo/feature-mockup/ava-mockup.html` (JS functions) | Add `_showNotifPopover()` and `_hideNotifPopover()` after the state vars |
| `~/AVA demo/feature-mockup/ava-mockup.html` (JS wiring) | Call `_showNotifPopover()` in `showAvaResponse()` and `_hideNotifPopover()` in `openAva()` |

---

## Task 1: Add popover CSS

**Files:**
- Modify: `~/AVA demo/feature-mockup/ava-mockup.html` — CSS section, after the `.ava-btn.has-response` block (~line 270)

- [ ] **Step 1: Read the exact end of the notification CSS block**

  Read lines 260–282 to confirm the last line of the notification section before inserting.

- [ ] **Step 2: Add popover CSS after `.ava-btn-inner` rule opening**

  Find this exact comment + rule:
  ```css
      .ava-btn-inner {
  ```
  Insert the entire popover CSS block **before** it (i.e. between the `.has-response` block and `.ava-btn-inner`):
  ```css
      /* ── AVA response-ready popover ── */
      .ava-notif-popover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        pointer-events: none;
        z-index: 200;
        opacity: 0;
        transition: opacity 150ms ease;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .ava-notif-popover.visible { opacity: 1; }
      .ava-notif-popover__content {
        background: #ffffff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        filter: drop-shadow(0 2px 4px rgba(65,65,65,0.50));
        padding: 24px 40px 24px 32px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ava-notif-popover__icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }
      .ava-notif-popover__text {
        font-family: var(--font-family);
        font-size: 16px;
        font-weight: 400;
        color: #414141;
        line-height: 1.5;
      }
      .ava-notif-popover__arrow {
        display: block;
        width: 16px;
        height: 8px;
        flex-shrink: 0;
        margin-top: -1px;
      }
  ```

- [ ] **Step 3: Verify in browser**

  Open `~/AVA demo/feature-mockup/ava-mockup.html`. Open DevTools, select `#ava-toggle`, and in the Console run:
  ```js
  document.querySelector('.ava-notif-popover')
  ```
  This will return `null` (the HTML hasn't been added yet) — that's expected. Just confirm the CSS parses with no errors in the Styles panel.

- [ ] **Step 4: Commit**

  ```bash
  git -C ~ add "AVA demo/feature-mockup/ava-mockup.html"
  git -C ~ commit -m "feat: add AVA notification popover CSS"
  ```

---

## Task 2: Add popover HTML inside the AVA button

**Files:**
- Modify: `~/AVA demo/feature-mockup/ava-mockup.html` — HTML, inside `<button class="ava-btn" id="ava-toggle">` (~line 2853)

- [ ] **Step 1: Read the AVA button HTML to find the insertion point**

  Read lines 2828–2880 to confirm the button structure. The `<button>` closes after the active-state icon. Find the last `</div>` that closes `<div class="ava-btn-inner">`.

- [ ] **Step 2: Add the popover div after `</div>` that closes `.ava-btn-inner`**

  Find:
  ```html
            </div>
          </button>
  ```
  where the first `</div>` closes `.ava-btn-inner` and `</button>` closes `.ava-btn`. Insert the popover between them so the result is:
  ```html
            </div>
            <!-- Response-ready notification popover -->
            <div class="ava-notif-popover" id="ava-notif-popover" role="status" aria-live="polite">
              <div class="ava-notif-popover__content">
                <svg class="ava-notif-popover__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_537_395179)">
                  <path d="M13.7759 7.95983C13.3514 6.82211 12.8271 5.36755 12.5996 4.53859C12.1872 3.03585 12 2 12 2C12 2 11.8122 3.03593 11.3996 4.53859C11.168 5.38212 10.6293 6.87357 10.2013 8.01969C9.82314 9.03238 9.03966 9.83932 8.03519 10.2388C6.97221 10.6616 5.61506 11.1776 4.79289 11.3999C3.28688 11.807 2 12 2 12C2 12 3.28686 12.1928 4.79289 12.5999C5.63103 12.8265 7.0251 13.3584 8.09676 13.7856C9.06437 14.1713 9.82903 14.9355 10.2152 15.9029C10.6421 16.9722 11.1732 18.3624 11.3996 19.1999C11.8068 20.706 12 22 12 22C12 22 12.1926 20.706 12.5996 19.1999C12.82 18.3842 13.3298 17.0441 13.7508 15.9869C14.1561 14.9694 14.9792 14.1801 16.0087 13.8061C17.1516 13.391 18.6265 12.8703 19.4614 12.6349C20.9606 12.2123 22 12 22 12C22 12 20.9641 11.8124 19.4614 11.3999C18.6325 11.1724 17.178 10.6482 16.0403 10.2238C14.9919 9.83284 14.1671 9.00813 13.7759 7.95983Z" fill="url(#paint0_linear_537_395179)"/>
                  <path d="M5.5 3L5.88841 3.98484C6.0917 4.50028 6.49972 4.9083 7.01516 5.11158L8 5.5L7.01516 5.88841C6.49972 6.0917 6.0917 6.49972 5.88841 7.01516L5.5 8L5.11159 7.01516C4.9083 6.49972 4.50028 6.0917 3.98484 5.88841L3 5.5L3.98484 5.11158C4.50028 4.9083 4.9083 4.50028 5.11159 3.98484L5.5 3Z" fill="url(#paint1_linear_537_395179)"/>
                  <path d="M19.5298 17.3434L19 16L18.4702 17.3434C18.2669 17.8589 17.8589 18.2669 17.3434 18.4702L16 19L17.3434 19.5298C17.8589 19.7331 18.2669 20.1411 18.4702 20.6566L19 22L19.5298 20.6566C19.7331 20.1411 20.1411 19.7331 20.6566 19.5298L22 19L20.6566 18.4702C20.1411 18.2669 19.7331 17.8589 19.5298 17.3434Z" fill="url(#paint2_linear_537_395179)"/>
                  </g>
                </svg>
                <span class="ava-notif-popover__text">Response ready</span>
              </div>
              <svg class="ava-notif-popover__arrow" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0,0 L16,0 L8,8 Z" fill="#ffffff"/>
                <path d="M0,0 L8,8 L16,0" fill="none" stroke="#d9d9d9" stroke-width="1" vector-effect="non-scaling-stroke"/>
              </svg>
            </div>
          </button>
  ```

  **Important:** The SVG `<defs>` (gradients/filter) for `filter0_d_537_395179`, `paint0_linear_537_395179` etc. are already declared in the button's existing default-state SVG. The popover icon SVG references the same `url(#...)` IDs — this works because they are in the same document. Do NOT copy the `<defs>` block again, as duplicate IDs would be invalid.

- [ ] **Step 3: Verify in browser**

  Open `~/AVA demo/feature-mockup/ava-mockup.html`. In the Console run:
  ```js
  const p = document.getElementById('ava-notif-popover');
  p.classList.add('visible');
  ```
  The popover should appear above the AVA button — white card, gradient sparkle icon on the left, "Response ready" text, downward triangle arrow at the bottom. Check alignment: the card should be centred over the AVA button with the arrow tip pointing at it.

  Then run:
  ```js
  p.classList.remove('visible');
  ```
  The popover fades out.

- [ ] **Step 4: Commit**

  ```bash
  git -C ~ add "AVA demo/feature-mockup/ava-mockup.html"
  git -C ~ commit -m "feat: add AVA notification popover HTML"
  ```

---

## Task 3: Add JS state variable and helper functions

**Files:**
- Modify: `~/AVA demo/feature-mockup/ava-mockup.html` — JS section, around line 3959

- [ ] **Step 1: Read the existing state variable block**

  Read lines 3955–3966 to confirm `_avaNotifLoopTimer` is at line 3959.

- [ ] **Step 2: Add `_avaNotifPopoverTimer` state variable**

  Find:
  ```js
    let _avaNotifLoopTimer = null;
  ```
  Replace with:
  ```js
    let _avaNotifLoopTimer = null;
    let _avaNotifPopoverTimer = null;
  ```

- [ ] **Step 3: Add helper functions after the state vars block**

  Find the line:
  ```js
    function navIsOpen() { return !sideNav.classList.contains('collapsed'); }
  ```
  Insert the two helper functions **before** it:
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

    function _hideNotifPopover() {
      clearTimeout(_avaNotifPopoverTimer);
      _avaNotifPopoverTimer = null;
      const popover = document.getElementById('ava-notif-popover');
      if (popover) popover.classList.remove('visible');
    }

  ```

- [ ] **Step 4: Commit**

  ```bash
  git -C ~ add "AVA demo/feature-mockup/ava-mockup.html"
  git -C ~ commit -m "feat: add _showNotifPopover and _hideNotifPopover JS helpers"
  ```

---

## Task 4: Wire `_showNotifPopover()` into `showAvaResponse()`

**Files:**
- Modify: `~/AVA demo/feature-mockup/ava-mockup.html` — JS `showAvaResponse()`, around line 4982

- [ ] **Step 1: Read the `showAvaResponse` notification block**

  Read lines 4954–4985 to confirm `_runNotifCycle()` is called at line 4982 inside the `if (!avaIsOpen())` block.

- [ ] **Step 2: Add `_showNotifPopover()` call after `_runNotifCycle()`**

  Find:
  ```js
        _runNotifCycle();
      }
      // Fade out thinking indicator
  ```
  Replace with:
  ```js
        _runNotifCycle();
        _showNotifPopover();
      }
      // Fade out thinking indicator
  ```

- [ ] **Step 3: Verify in browser**

  Open `~/AVA demo/feature-mockup/ava-mockup.html`. Open AVA, type a message, send it, then **immediately close AVA** before the response arrives (the Tokyo response takes ~14 seconds of thinking). Wait for the thinking animation to complete. The popover should appear above the AVA button at the same time as the pulse ring animation starts. After 3 seconds it should fade out on its own while the shimmer loop continues.

- [ ] **Step 4: Commit**

  ```bash
  git -C ~ add "AVA demo/feature-mockup/ava-mockup.html"
  git -C ~ commit -m "feat: show notification popover when background response arrives"
  ```

---

## Task 5: Wire `_hideNotifPopover()` into `openAva()`

**Files:**
- Modify: `~/AVA demo/feature-mockup/ava-mockup.html` — JS `openAva()`, around line 4446

- [ ] **Step 1: Read the `openAva` notification clear block**

  Read lines 4444–4453 to confirm the exact current text.

- [ ] **Step 2: Add `_hideNotifPopover()` call inside the clear block**

  Find:
  ```js
      if (avaHasPendingNotification) {
        avaHasPendingNotification = false;
        clearTimeout(_avaNotifLoopTimer);
        _avaNotifLoopTimer = null;
        const btn = document.getElementById('ava-toggle');
        btn.classList.remove('has-response', 'pulse-ring');
      }
  ```
  Replace with:
  ```js
      if (avaHasPendingNotification) {
        avaHasPendingNotification = false;
        clearTimeout(_avaNotifLoopTimer);
        _avaNotifLoopTimer = null;
        const btn = document.getElementById('ava-toggle');
        btn.classList.remove('has-response', 'pulse-ring');
        _hideNotifPopover();
      }
  ```

- [ ] **Step 3: Verify scenario — open AVA while popover is visible**

  Trigger the popover (send a message, close AVA, wait for response). Within the 3-second window while the popover is showing, click the AVA button to open AVA. The popover should disappear immediately (not wait for the 3-second timer).

- [ ] **Step 4: Verify scenario — open AVA after popover has already auto-dismissed**

  Trigger the notification, wait for the popover to auto-dismiss (3s), then open AVA. Everything should work normally — no console errors, no stale timer.

- [ ] **Step 5: Commit**

  ```bash
  git -C ~ add "AVA demo/feature-mockup/ava-mockup.html"
  git -C ~ commit -m "feat: dismiss notification popover immediately when AVA is opened"
  ```

---

## Task 6: End-to-end verification

**Files:**
- Read-only verification pass — no code changes

- [ ] **Step 1: Scenario — full flow**

  1. Open AVA, send any message (e.g. "Tell me about Tokyo")
  2. Close AVA immediately after sending
  3. Wait ~14 seconds for the Tokyo thinking sequence to complete
  4. **Expected:** Pulse ring fires → popover appears above AVA button showing sparkle icon + "Response ready" → popover fades out after 3s → shimmer loop continues
  5. Click the AVA button — **Expected:** popover gone (already dismissed), animation clears, AVA opens showing the response

- [ ] **Step 2: Scenario — open during popover window**

  Repeat the flow. While the popover is visible (within first 3s), click the AVA button.
  **Expected:** Popover disappears immediately on click. No visual glitch.

- [ ] **Step 3: Scenario — popover positioning check**

  After the popover appears, inspect it in DevTools. Confirm:
  - Card is centred horizontally over the button
  - Arrow tip points down toward the button
  - Card does not overflow off-screen to the left (it's near the right edge of the header)
  - If the card clips the right edge: change the CSS `left: 50%; transform: translateX(-50%)` on `.ava-notif-popover` to `right: 0; transform: none` so it right-aligns with the button instead — this keeps it on-screen.

- [ ] **Step 4: Scenario — AVA already open (no notification)**

  Open AVA and send a message. While AVA is open, the response arrives. **Expected:** No popover appears (the `if (!avaIsOpen())` guard prevents it).
