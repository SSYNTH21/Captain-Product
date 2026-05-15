# AVA Notification + Slow Response Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a background-response notification animation to the AVA header button, and modify the Tokyo thinking flow to demonstrate a slow response with an inline "Answer now" escape hatch.

**Architecture:** All changes are in a single file (`AVA demo/feature-mockup/ava-mockup.html`). CSS additions go in the `<style>` block near existing `.ava-btn` rules. JS additions go inline near the existing `showAvaResponse`, `openAva`, and thinking-interval code. No new files.

**Tech Stack:** Vanilla HTML/CSS/JS, inline in one file. NDBX design tokens for colours.

---

## Files

- Modify: `AVA demo/feature-mockup/ava-mockup.html`
  - CSS block ~line 227 — add pulse keyframe + `.ava-btn.has-response` rules
  - JS ~line 4799 — replace thinking interval block with slow-aware version
  - JS ~line 4830 — add notification hook in `showAvaResponse`
  - JS ~line 4399 — add notification clear in `openAva`

---

## Task 1: CSS — pulse ring + notification shimmer on AVA button

**Files:**
- Modify: `AVA demo/feature-mockup/ava-mockup.html` (CSS block, after `.ava-btn.active:hover` rule at ~line 245)

- [ ] **Step 1: Add CSS after the `.ava-btn.active:hover` rule**

Find this exact line (around line 245):
```css
    .ava-btn.active:hover { background: linear-gradient(133.34deg, rgb(2,47,111) 8.28%, rgb(95,60,136) 47.67%, rgb(95,60,136) 53.78%, rgb(13,112,165) 90.65%); }
```

Insert immediately after it:
```css
    /* ── AVA button: background-response notification ── */
    .ava-btn { position: relative; }
    @keyframes ava-response-pulse {
      0%   { transform: scale(1);    opacity: 0.5; }
      100% { transform: scale(1.7);  opacity: 0; }
    }
    .ava-btn.pulse-ring::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 100px;
      background: #5A3982;
      animation: ava-response-pulse 800ms ease-out 1 forwards;
      pointer-events: none;
    }
    /* Shimmer: one sweep of the gradient across the default sparkle icon */
    @keyframes ava-icon-shimmer {
      0%,  57% { background-position: 100% 0; }
      100%     { background-position:   0% 0; }
    }
    .ava-btn.has-response .ava-icon-default svg path {
      fill: url(#ava-shimmer-grad) !important;
    }
    .ava-btn.has-response .ava-icon-default::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 100px;
      background: linear-gradient(90deg,
        #5A3982  0%,
        #003781 17%,
        #00275B 33%,
        #9B6CC7 50%,
        #5A3982 67%,
        #003781 83%,
        #00275B 100%
      );
      background-size: 300% 100%;
      animation: ava-icon-shimmer 3.5s ease-in-out 1 forwards;
      mix-blend-mode: color;
      pointer-events: none;
    }
    .ava-btn.has-response .ava-icon-default {
      position: relative;
      filter: hue-rotate(0deg) saturate(1.4) brightness(0.85);
    }
```

- [ ] **Step 2: Verify CSS is syntactically valid**

Open `AVA demo/feature-mockup/ava-mockup.html` in a browser. Open DevTools Console — confirm zero CSS parse errors. The button should look identical to before (no classes applied yet).

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/ava-mockup.html"
git commit -m "feat: add AVA button pulse ring + shimmer CSS for background response notification"
```

---

## Task 2: JS — notification state flag + trigger in `showAvaResponse`

**Files:**
- Modify: `AVA demo/feature-mockup/ava-mockup.html`
  - Add flag near other `let` state variables (~line 3911)
  - Hook into `showAvaResponse` (~line 4830)

- [ ] **Step 1: Add the state flag**

Find this block (around line 3911):
```js
  let avaPipSize      = null;
  let avaPipPos       = null;
  let avaPipMaximized = false;
  let avaLastWasFloating = false;
```

Add one line after `avaLastWasFloating`:
```js
  let avaHasPendingNotification = false;
```

- [ ] **Step 2: Add notification trigger at the top of `showAvaResponse`**

Find the start of `showAvaResponse` (around line 4830):
```js
  function showAvaResponse(thinkingEl, messages, ts, avaContent, chatTitle, responseKey, promptText) {
    // Fade out thinking indicator
    thinkingEl.style.transition = 'opacity 300ms ease';
```

Insert after the opening brace, before the fade-out:
```js
  function showAvaResponse(thinkingEl, messages, ts, avaContent, chatTitle, responseKey, promptText) {
    // Notify via header button if AVA was closed when response arrived
    if (!avaIsOpen()) {
      avaHasPendingNotification = true;
      const btn = document.getElementById('ava-toggle');
      // One-shot pulse ring: add class, remove after animation ends so it can replay
      btn.classList.add('pulse-ring');
      btn.addEventListener('animationend', function removePulse() {
        btn.classList.remove('pulse-ring');
        btn.removeEventListener('animationend', removePulse);
        // Shimmer sweep starts after pulse
        btn.classList.add('has-response');
      }, { once: true });
    }
    // Fade out thinking indicator
    thinkingEl.style.transition = 'opacity 300ms ease';
```

- [ ] **Step 3: Open browser, send the Tokyo prompt, close AVA while it thinks, wait for response**

Steps to test:
1. Open `AVA demo/feature-mockup/ava-mockup.html` in browser
2. Click the AVA button to open it
3. Type "I have a client with a location based in Tokyo" and press Enter
4. Immediately click the AVA button again to close AVA while thinking is in progress
5. Wait ~8–10 seconds

**Expected:** The AVA header button plays a purple pulse ring outward, then the sparkle icon shifts to a purple-tinted shimmer sweep. After ~3.5s the shimmer settles.

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/ava-mockup.html"
git commit -m "feat: trigger pulse ring + shimmer on AVA button when background response arrives"
```

---

## Task 3: JS — clear notification on `openAva`

**Files:**
- Modify: `AVA demo/feature-mockup/ava-mockup.html` (JS `openAva` function ~line 4399)

- [ ] **Step 1: Add clear logic at the top of `openAva`**

Find the start of `openAva` (around line 4399):
```js
  function openAva() {
    // large+ pinned: rule 1 — auto-collapse nav when AVA opens
    if (!isMedium() && !isSmall() && !avaIsFloating() && navIsOpen()) {
```

Insert after the opening brace:
```js
  function openAva() {
    // Clear pending notification if present
    if (avaHasPendingNotification) {
      avaHasPendingNotification = false;
      const btn = document.getElementById('ava-toggle');
      btn.classList.remove('has-response', 'pulse-ring');
    }
    // large+ pinned: rule 1 — auto-collapse nav when AVA opens
    if (!isMedium() && !isSmall() && !avaIsFloating() && navIsOpen()) {
```

- [ ] **Step 2: Test the clear behaviour**

1. Repeat the test from Task 2 Step 3 — trigger the notification
2. Once the shimmer is showing on the button, click the AVA button to open it
**Expected:** The shimmer/tint disappears immediately, button returns to its normal default gradient sparkle state. AVA opens and shows the completed response.

- [ ] **Step 3: Test edge case — AVA already open when response arrives**

1. Open AVA, send the Tokyo prompt, do NOT close AVA
2. Wait for the response to appear
**Expected:** No pulse ring, no shimmer — response appears normally in the chat, button unchanged.

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/ava-mockup.html"
git commit -m "feat: clear AVA button notification state when user opens AVA"
```

---

## Task 4: JS — slow Tokyo thinking step + "Answer now" button

**Files:**
- Modify: `AVA demo/feature-mockup/ava-mockup.html` (thinking interval block ~line 4798)

- [ ] **Step 1: Add constants just before the thinking interval**

Find this line (around line 4798):
```js
    const thinkingSteps = (THINKING_STEPS[responseKey] || THINKING_STEPS.capabilities).map(s => s.label + '...');
```

Insert before it:
```js
    const SLOW_RESPONSE_KEYS = ['tokyo'];
    const SLOW_STEP_INDEX = 2;          // 0-based: step 3 = "Calculating mandatory deductible"
    const SLOW_STEP_DURATION_MS = 12000;
    const SLOW_STEP_THRESHOLD_MS = 8000;
    const isSlowResponse = SLOW_RESPONSE_KEYS.includes(responseKey);
```

- [ ] **Step 2: Replace the entire thinking interval block**

Find and replace this entire block (lines ~4798–4821):
```js
    const thinkingSteps = (THINKING_STEPS[responseKey] || THINKING_STEPS.capabilities).map(s => s.label + '...');
    const LAST_STEP = thinkingSteps.length - 1;
    let stepIndex = 0;

    const thinkingInterval = setInterval(() => {
      const textEl = document.getElementById('ava-thinking-text');
      if (!textEl) { clearInterval(thinkingInterval); return; }

      const nextIndex = stepIndex + 1;
      if (nextIndex > LAST_STEP) return; // already on Refining, wait for timeout

      textEl.style.opacity = '0';
      setTimeout(() => {
        stepIndex = nextIndex;
        textEl.textContent = thinkingSteps[stepIndex];
        textEl.style.opacity = '1';

        if (stepIndex === LAST_STEP) {
          // Hold 2s on "Refining" then transition to response
          clearInterval(thinkingInterval);
          setTimeout(() => showAvaResponse(thinking, messages, ts, avaContent, chatTitle, responseKey, promptText), 2000);
        }
      }, 300);
    }, 1800);
```

Replace with:
```js
    const thinkingSteps = (THINKING_STEPS[responseKey] || THINKING_STEPS.capabilities).map(s => s.label + '...');
    const LAST_STEP = thinkingSteps.length - 1;
    let stepIndex = 0;
    let slowAnswerNowTimer = null;
    let slowStepTimer = null;

    function _transitionToStep(idx) {
      const textEl = document.getElementById('ava-thinking-text');
      if (!textEl) return;
      textEl.style.opacity = '0';
      setTimeout(() => {
        stepIndex = idx;
        textEl.textContent = thinkingSteps[idx];
        textEl.style.opacity = '1';
      }, 300);
    }

    function _removeAnswerNowBtn() {
      const btn = document.getElementById('ava-answer-now-btn');
      if (btn) btn.remove();
    }

    function _finishWithResponse() {
      clearTimeout(slowAnswerNowTimer);
      clearTimeout(slowStepTimer);
      clearInterval(thinkingInterval);
      _removeAnswerNowBtn();
      setTimeout(() => showAvaResponse(thinking, messages, ts, avaContent, chatTitle, responseKey, promptText), 2000);
    }

    // Global so the inline onclick can reach it
    window._avaAnswerNow = function() {
      clearTimeout(slowAnswerNowTimer);
      clearTimeout(slowStepTimer);
      clearInterval(thinkingInterval);
      _removeAnswerNowBtn();
      // Flash "Confirming result..." for 1s then show response
      _transitionToStep(LAST_STEP);
      setTimeout(() => showAvaResponse(thinking, messages, ts, avaContent, chatTitle, responseKey, promptText), 1000);
    };

    const thinkingInterval = setInterval(() => {
      const textEl = document.getElementById('ava-thinking-text');
      if (!textEl) { clearInterval(thinkingInterval); return; }

      const nextIndex = stepIndex + 1;
      if (nextIndex > LAST_STEP) return;

      // Slow step: use a one-off timer instead of the regular interval tick
      if (isSlowResponse && nextIndex === SLOW_STEP_INDEX) {
        clearInterval(thinkingInterval);
        // Transition to the slow step immediately (step 3)
        _transitionToStep(SLOW_STEP_INDEX);

        // After threshold: inject "Answer now" button
        slowAnswerNowTimer = setTimeout(() => {
          const thinkingRow = document.getElementById('ava-thinking');
          if (!thinkingRow) return;
          const answerBtn = document.createElement('button');
          answerBtn.id = 'ava-answer-now-btn';
          answerBtn.className = 'ava-answer-now-btn';
          answerBtn.textContent = 'Answer now';
          answerBtn.onclick = window._avaAnswerNow;
          answerBtn.style.opacity = '0';
          thinkingRow.appendChild(answerBtn);
          // Fade in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { answerBtn.style.opacity = '1'; });
          });
        }, SLOW_STEP_THRESHOLD_MS);

        // After full slow duration: proceed naturally
        slowStepTimer = setTimeout(() => {
          _removeAnswerNowBtn();
          _transitionToStep(LAST_STEP);
          setTimeout(() => showAvaResponse(thinking, messages, ts, avaContent, chatTitle, responseKey, promptText), 2000);
        }, SLOW_STEP_DURATION_MS);

        return;
      }

      textEl.style.opacity = '0';
      setTimeout(() => {
        stepIndex = nextIndex;
        textEl.textContent = thinkingSteps[stepIndex];
        textEl.style.opacity = '1';

        if (stepIndex === LAST_STEP) {
          clearInterval(thinkingInterval);
          setTimeout(() => showAvaResponse(thinking, messages, ts, avaContent, chatTitle, responseKey, promptText), 2000);
        }
      }, 300);
    }, 1800);
```

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/ava-mockup.html"
git commit -m "feat: extend Tokyo step 3 to 12s with Answer now escape hatch"
```

---

## Task 5: CSS — "Answer now" button styles

**Files:**
- Modify: `AVA demo/feature-mockup/ava-mockup.html` (CSS block, after the `.ava-msg-thinking` rules ~line 2156)

- [ ] **Step 1: Find the thinking indicator CSS block**

Find this rule (around line 2157):
```css
    .ava-msg-thinking {
```

Add the following after the `.ava-thinking-text` rule that follows it:
```css
    /* "Answer now" inline plain button */
    .ava-answer-now-btn {
      margin-left: auto;
      flex-shrink: 0;
      background: none;
      border: none;
      padding: 0 0 0 12px;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      color: #006192;
      cursor: pointer;
      transition: color 150ms ease, opacity 200ms ease;
      white-space: nowrap;
    }
    .ava-answer-now-btn:hover { color: #008ED6; }
```

- [ ] **Step 2: Verify the thinking row is a flex container**

Check the `.ava-msg-thinking` rule. It must have `display: flex` and `align-items: center` so `margin-left: auto` pushes "Answer now" to the right. If it doesn't, add those properties to `.ava-msg-thinking`.

Current `.ava-msg-thinking` should look like:
```css
    .ava-msg-thinking {
      display: flex;
      align-items: center;
      gap: 8px;
      ...
    }
```

If `display: flex` is missing, add it now.

- [ ] **Step 3: Full slow-response test**

1. Open `AVA demo/feature-mockup/ava-mockup.html`
2. Open AVA, type the Tokyo prompt, send
3. Watch steps 1 and 2 cycle normally (~2s each)
4. Step 3 "Calculating mandatory deductible..." stalls
5. At 8s: "Answer now" fades in on the right of the thinking row
6. Click "Answer now"
7. **Expected:** Text immediately changes to "Confirming result...", "Answer now" disappears, after 1s the thinking row fades out and the full Tokyo response appears

- [ ] **Step 4: Test natural completion (no click)**

1. Repeat the Tokyo prompt
2. Do NOT click "Answer now"
3. Wait the full 12 seconds
4. **Expected:** Step 3 completes naturally, transitions to "Confirming result...", "Answer now" is removed, response appears after ~2s

- [ ] **Step 5: Test non-Tokyo flow is unaffected**

1. Open AVA, type any other prompt (e.g. "What can you do?")
2. **Expected:** Thinking cycles at normal speed (~2s per step), no "Answer now" button appears

- [ ] **Step 6: Commit**

```bash
git add "AVA demo/feature-mockup/ava-mockup.html"
git commit -m "feat: style Answer now plain button in thinking row"
```

---

## Task 6: Combined integration test

- [ ] **Step 1: Test both features together**

Scenario — background notification + slow response:
1. Open AVA, send the Tokyo prompt
2. Immediately close AVA (before thinking finishes)
3. Watch the "Answer now" appear on the hidden panel (it still runs)
4. Wait the full 12s (or re-open AVA, click Answer now, re-close)
5. Once response completes: **Expected:** Pulse ring plays on header button, then shimmer sweep on the sparkle icon
6. Click the header button: **Expected:** Notification clears, AVA opens, shows the completed Tokyo response

- [ ] **Step 2: Test notification does not double-fire**

1. Close AVA mid-thinking
2. Response arrives → notification plays
3. Open AVA, close it again immediately (no new prompt)
4. **Expected:** No second pulse/shimmer — `avaHasPendingNotification` was cleared on open
