# AVA: Background Response Notification + Slow Response Demo

**Date:** 2026-05-15  
**File:** `AVA demo/feature-mockup/ava-mockup.html`

---

## Feature 1: Background Response Notification

### Overview
When the user sends a prompt and closes AVA while it is still thinking, the response continues in the background. Once the response is ready, the AVA header button animates to notify the user.

### State
- New boolean flag: `avaHasPendingNotification` (module-scoped, default `false`)
- Set to `true` inside `showAvaResponse()` when `!avaIsOpen()`
- Cleared and animation removed when `openAva()` is called

### Animation sequence (triggers when AVA is closed at response time)

1. **Pulse ring** — one-shot CSS animation on the `.ava-btn` element
   - A pseudo-element (`::after`) expands from 100% to 160% scale and fades out over 800ms
   - Colour: `#5A3982` (AVA purple), opacity 0.5 → 0
   - Keyframe: `ava-response-pulse`
   - Plays once (`animation-iteration-count: 1`), does not repeat

2. **Gradient shimmer** — immediately after pulse, class `has-response` is added to `.ava-btn`
   - Drives the sparkle icon into a one-sweep gradient animation (same `ava-gradient-flow` keyframe used for the welcome "AVA" text)
   - After one sweep (~3.5s), the icon holds the resting purple state (animation does not loop)
   - The `has-response` class keeps the sparkle visually "lit" (purple tint) until cleared

### Clear condition
- `openAva()` removes `has-response` from `.ava-btn` and resets `avaHasPendingNotification = false`
- If AVA is already open when response arrives: no notification plays, response renders normally

---

## Feature 2: Slow Response Demo ("Answer now")

### Overview
The Tokyo scenario ("Location rule in Tokyo") is modified to demonstrate a slow AI response. Step 3 of the thinking sequence stalls for 12 seconds. After 8 seconds an "Answer now" button appears inline. Clicking it skips to a brief "Confirming result" flash then shows the answer.

### Modified timing — Tokyo flow only

| Step | Label | Duration (normal) | Duration (slow) |
|---|---|---|---|
| 1 | Reading Lob-presentation_240116.pdf | ~2s | ~2s (unchanged) |
| 2 | Checking Japan earthquake rules | ~2s | ~2s (unchanged) |
| 3 | Calculating mandatory deductible | ~2s | **12s** |
| 4 | Confirming result | ~2s | 1s (skip mode) or ~2s (natural) |

### "Answer now" button

- **Appears:** 8 seconds after step 3 starts (threshold constant: `SLOW_STEP_THRESHOLD_MS = 8000`)
- **Position:** Inline right side of the thinking row, replacing whitespace to the right of the truncated step label
- **Style:** NDBX plain button — no background, no border, `color: #006192`, `hover: color: #008ED6`, `font-size: 0.875rem`, `font-weight: 600`
- **Appearance:** Fades in over 200ms (`opacity: 0 → 1`)
- **Label:** "Answer now"

### Click behaviour

1. Cancel all pending step-3 timers (`clearTimeout` / `clearInterval`)
2. Update thinking text to "Confirming result..." (step 4 label)
3. Remove "Answer now" button from DOM
4. Wait 1000ms
5. Call existing `showAvaResponse()` — fades out thinking indicator, renders response

### Natural completion (no click)

- After 12s, step 3 transitions to step 4 normally
- "Answer now" button is removed when step 3 completes
- Step 4 plays at normal speed, then `showAvaResponse()` is called as usual

### Scope
- Slow timing applies to the `tokyo` response key only
- All other response keys (`capabilities`, etc.) are unaffected
- A module-level constant `SLOW_RESPONSE_KEYS = ['tokyo']` controls which keys get the slow path, making it easy to extend later

---

## Implementation touch points

| Area | Change |
|---|---|
| CSS | Add `@keyframes ava-response-pulse`, `.ava-btn.has-response` shimmer rule, `.ava-btn::after` pulse pseudo-element, `.ava-answer-now-btn` styles |
| JS — `showAvaResponse()` | Add check: if `!avaIsOpen()`, set `avaHasPendingNotification = true`, trigger pulse + shimmer on `#ava-toggle` |
| JS — `openAva()` | Clear `has-response` class and `avaHasPendingNotification` flag |
| JS — thinking interval (Tokyo) | Extend step 3 duration to 12s; set 8s timeout to inject "Answer now" button |
| JS — "Answer now" handler | `answerNow()` function: cancel timers, flash step 4 for 1s, call `showAvaResponse()` |
