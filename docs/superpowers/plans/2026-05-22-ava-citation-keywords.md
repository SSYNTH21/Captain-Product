# AVA Citation Keywords & Source Popover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Tokyo AVA response with 3 citation keywords styled as NDBX text links; clicking each opens a fixed-position source popover listing the reference(s) AVA used.

**Architecture:** All changes are in a single file (`AVA demo/feature-mockup/AVA-mockup_update.html`). Six sequential tasks: CSS for the citation link style → CSS + HTML for the popover → JS data store → JS open/close functions → updated Tokyo response array → click delegation wiring. No new files.

**Tech Stack:** Plain HTML, CSS, JavaScript (no build step)

---

## File modified

- `AVA demo/feature-mockup/AVA-mockup_update.html`

---

### Task 1: Add `.ava-citation-link` CSS

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (after line 2374, inside `<style>`)

- [ ] **Step 1: Confirm insertion point**

Run:
```bash
grep -n "\.ava-msg-body li" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: one line around 2374 — `.ava-msg-body li { margin-bottom: 4px; line-height: 24px; }`

- [ ] **Step 2: Insert citation link CSS after `.ava-msg-body li` rule**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```css
    .ava-msg-body li { margin-bottom: 4px; line-height: 24px; }
```

Replace with:
```css
    .ava-msg-body li { margin-bottom: 4px; line-height: 24px; }
    /* ── AVA inline citation link (NDBX Link / medium) ── */
    .ava-citation-link {
      display: inline;
      color: #006192;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
      letter-spacing: 1px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
    }
    .ava-citation-link:hover { color: #008ED6; }
    .ava-citation-link:active { color: #003781; }
```

- [ ] **Step 3: Verify the CSS was inserted**

Run:
```bash
grep -n "ava-citation-link" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: 3 lines — `.ava-citation-link {`, `.ava-citation-link:hover`, `.ava-citation-link:active`

- [ ] **Step 4: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: add .ava-citation-link CSS (NDBX text link style)"
```

---

### Task 2: Add citation popover CSS and HTML

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html`
  - CSS: after the `.ava-toast` block (around line 305)
  - HTML: just before `</body>`

- [ ] **Step 1: Confirm CSS insertion point**

Run:
```bash
grep -n "\.ava-toast__text" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: one line around 301–308 — the last rule in the `.ava-toast` block.

- [ ] **Step 2: Insert popover CSS after `.ava-toast__text` rule**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```css
    .ava-toast__text {
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #414141;
    }
```

Replace with:
```css
    .ava-toast__text {
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #414141;
    }
    /* ── AVA citation source popover ── */
    .ava-citation-popover {
      position: fixed;
      width: 380px;
      max-height: 420px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(65,65,65,0.5);
      z-index: 3000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease;
      display: flex;
      flex-direction: column;
    }
    .ava-citation-popover.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .ava-citation-popover__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 12px 24px;
      border-bottom: 1px solid #d9d9d9;
      flex-shrink: 0;
    }
    .ava-citation-popover__title {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #414141;
    }
    .ava-citation-popover__body {
      overflow-y: auto;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    /* Arrow pointing RIGHT (popover is left of keyword) */
    .ava-citation-popover.arrow-right::before,
    .ava-citation-popover.arrow-right::after {
      content: '';
      position: absolute;
      top: var(--arrow-offset, 50%);
      transform: translateY(-50%);
    }
    .ava-citation-popover.arrow-right::before {
      right: -9px;
      border: 8px solid transparent;
      border-right: none;
      border-left: 9px solid #d9d9d9;
    }
    .ava-citation-popover.arrow-right::after {
      right: -7px;
      border: 7px solid transparent;
      border-right: none;
      border-left: 8px solid #ffffff;
    }
    /* Arrow pointing DOWN (popover is above keyword) */
    .ava-citation-popover.arrow-bottom::before,
    .ava-citation-popover.arrow-bottom::after {
      content: '';
      position: absolute;
      left: var(--arrow-offset, 50%);
      transform: translateX(-50%);
    }
    .ava-citation-popover.arrow-bottom::before {
      bottom: -9px;
      border: 8px solid transparent;
      border-bottom: none;
      border-top: 9px solid #d9d9d9;
    }
    .ava-citation-popover.arrow-bottom::after {
      bottom: -7px;
      border: 7px solid transparent;
      border-bottom: none;
      border-top: 8px solid #ffffff;
    }
    /* Arrow pointing UP (popover is below keyword) */
    .ava-citation-popover.arrow-top::before,
    .ava-citation-popover.arrow-top::after {
      content: '';
      position: absolute;
      left: var(--arrow-offset, 50%);
      transform: translateX(-50%);
    }
    .ava-citation-popover.arrow-top::before {
      top: -9px;
      border: 8px solid transparent;
      border-top: none;
      border-bottom: 9px solid #d9d9d9;
    }
    .ava-citation-popover.arrow-top::after {
      top: -7px;
      border: 7px solid transparent;
      border-top: none;
      border-bottom: 8px solid #ffffff;
    }
```

- [ ] **Step 3: Confirm CSS was inserted**

Run:
```bash
grep -n "ava-citation-popover" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html" | grep -v "ava-citation-link"
```
Expected: multiple lines — `.ava-citation-popover {`, `.ava-citation-popover.visible`, `.ava-citation-popover__header`, `.ava-citation-popover__body`, arrow variants.

- [ ] **Step 4: Add popover HTML before `</body>`**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```html
  <!-- Response-ready toast -->
```

Replace with:
```html
  <!-- Citation source popover (singleton) -->
  <div class="ava-citation-popover" id="ava-citation-popover" aria-hidden="true">
    <div class="ava-citation-popover__header">
      <span class="ava-citation-popover__title">Sources</span>
      <button class="ava-plain-btn" onclick="_closeCitationPopover()" aria-label="Close sources">
        <svg width="24" height="24" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true">
          <g transform="scale(1,-1) translate(0,-1000)">
            <path d="M558.9166666666666 500L779.4583333333334 720.5416666666667A41.6666666666667 41.6666666666667 0 1 1 720.5416666666666 779.4583333333334L500 558.9166666666667L279.4583333333333 779.4583333333334A41.6666666666667 41.6666666666667 0 0 1 220.5416666666667 720.5416666666667L441.0833333333333 500L220.5416666666667 279.4583333333334A41.6666666666667 41.6666666666667 0 1 1 279.4583333333333 220.5416666666666L500 441.0833333333334L720.5416666666666 220.5416666666666A41.6666666666667 41.6666666666667 0 0 1 779.4583333333334 279.4583333333334z"/>
          </g>
        </svg>
      </button>
    </div>
    <div class="ava-citation-popover__body" id="ava-citation-popover__body"></div>
  </div>

  <!-- Response-ready toast -->
```

- [ ] **Step 5: Verify popover HTML is present**

Run:
```bash
grep -n "ava-citation-popover\b" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html" | grep "id="
```
Expected: two lines — `id="ava-citation-popover"` and `id="ava-citation-popover__body"`.

- [ ] **Step 6: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: add citation popover CSS and HTML (singleton, arrow variants)"
```

---

### Task 3: Add `CITATION_SOURCES` JS data object

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (in `<script>`, before `CANNED_RESPONSES`)

- [ ] **Step 1: Confirm insertion point**

Run:
```bash
grep -n "CANNED_RESPONSES\s*=" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: one line around 4700 — `const CANNED_RESPONSES = {`

- [ ] **Step 2: Insert CITATION_SOURCES before CANNED_RESPONSES**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```js
  const CANNED_RESPONSES = {
```

Replace with:
```js
  /* ── Citation sources per keyword ── */
  const CITATION_SOURCES = {
    'tsi-rate': [
      {
        type: 'web',
        title: 'Allianz Underwriting Guidelines',
        subtitle: 'allianz-underwriting.com · Earthquake Deductibles',
        excerpt: 'Mandatory earthquake deductibles apply in critical seismic zones including Japan and California. The deductible is set at 5% of exposed TSI with a minimum floor of 100,000 EUR and no cap.',
        linkText: 'allianz-underwriting.com/earthquake-deductibles',
        linkUrl: 'https://www.allianz.com'
      }
    ],
    'min-floor': [
      {
        type: 'web',
        title: 'Allianz Underwriting Guidelines',
        subtitle: 'allianz-underwriting.com · Earthquake Deductibles',
        excerpt: 'Mandatory earthquake deductibles apply in critical seismic zones including Japan and California. The deductible is set at 5% of exposed TSI with a minimum floor of 100,000 EUR and no cap.',
        linkText: 'allianz-underwriting.com/earthquake-deductibles',
        linkUrl: 'https://www.allianz.com'
      },
      {
        type: 'web',
        title: 'Global Property Underwriting Manual',
        subtitle: 'allianz-re.com · Location Risk Rules',
        excerpt: 'Tokyo falls under the highest seismic risk classification. Location rules mandate deductibles that scale with TSI, ensuring adequate risk retention for catastrophe perils.',
        linkText: 'allianz-re.com/location-risk/tokyo',
        linkUrl: 'https://www.allianz.com'
      }
    ],
    'zone': [
      {
        type: 'web',
        title: 'Global Property Underwriting Manual',
        subtitle: 'allianz-re.com · Location Risk Rules',
        excerpt: 'Tokyo falls under the highest seismic risk classification. Location rules mandate deductibles that scale with TSI, ensuring adequate risk retention for catastrophe perils.',
        linkText: 'allianz-re.com/location-risk/tokyo',
        linkUrl: 'https://www.allianz.com'
      }
    ]
  };

  const CANNED_RESPONSES = {
```

- [ ] **Step 3: Verify data object is present**

Run:
```bash
grep -n "CITATION_SOURCES\|tsi-rate\|min-floor\|'zone'" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html" | head -10
```
Expected: `const CITATION_SOURCES = {`, plus lines for `'tsi-rate'`, `'min-floor'`, `'zone'`.

- [ ] **Step 4: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: add CITATION_SOURCES data object"
```

---

### Task 4: Add `_openCitationPopover` and `_closeCitationPopover` JS functions

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (in `<script>`, near `_showToast` / `_hideToast`)

- [ ] **Step 1: Confirm insertion point**

Run:
```bash
grep -n "function _hideToast" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: one line around 4014.

- [ ] **Step 2: Insert citation popover functions after `_hideToast`**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html` (the closing brace of `_hideToast`):
```js
  function _hideToast() {
    clearTimeout(_avaToastTimer);
    _avaToastTimer = null;
    const toast = document.getElementById('ava-toast');
    if (toast) toast.classList.remove('visible');
  }
```

Replace with:
```js
  function _hideToast() {
    clearTimeout(_avaToastTimer);
    _avaToastTimer = null;
    const toast = document.getElementById('ava-toast');
    if (toast) toast.classList.remove('visible');
  }

  /* ── Citation popover ── */
  function _closeCitationPopover() {
    const pop = document.getElementById('ava-citation-popover');
    if (!pop) return;
    pop.classList.remove('visible', 'arrow-right', 'arrow-bottom', 'arrow-top');
    pop.setAttribute('aria-hidden', 'true');
  }

  function _openCitationPopover(anchorEl, citationKey) {
    const pop = document.getElementById('ava-citation-popover');
    const body = document.getElementById('ava-citation-popover__body');
    if (!pop || !body) return;
    if (pop.classList.contains('visible')) return; // must close first

    const sources = CITATION_SOURCES[citationKey] || [];

    // Build source items HTML using existing .ava-src-item structure
    const GLOBE_SVG = '<svg width="24" height="24" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true"><g transform="scale(1,-1) translate(0,-1000)"><path d="M500 958.3333333333334C247.2916666666667 958.3333333333334 41.6666666666667 752.7083333333334 41.6666666666667 500S247.2916666666667 41.6666666666667 500 41.6666666666667S958.3333333333331 247.2916666666667 958.3333333333331 500S752.7083333333334 958.3333333333334 500 958.3333333333334zM891.6666666666665 500C891.6666666666665 466.4583333333334 887.2916666666665 434 879.3749999999998 402.9583333333334H712.0416666666665C719.3333333333333 446.0416666666668 720.8333333333331 480.6666666666666 720.8333333333331 500C720.8333333333331 538.25 716.6666666666664 573.625 710.5833333333333 607.1666666666666H876.6249999999999C886.2916666666665 573.0833333333333 891.6666666666665 537.2083333333333 891.6666666666665 500zM333.3333333333333 500C333.3333333333333 538.375 337.5833333333333 573.9583333333334 344.2916666666666 607.125L655.6666666666665 607.1666666666666C662.4166666666665 573.9583333333333 666.6666666666665 538.375 666.6666666666665 500C666.6666666666665 488.5000000000001 666.2083333333331 452.0416666666667 657.0416666666665 402.9583333333334H342.9583333333332C333.7916666666665 452.0416666666667 333.3333333333332 488.5000000000001 333.3333333333332 500zM856.8333333333333 661.3333333333334H698.1249999999999C670.0416666666666 760.75 621.2499999999999 835.7916666666667 582.2083333333333 882.875C704.9166666666666 856.6666666666667 806.2499999999999 772.9583333333334 856.8333333333333 661.3333333333334zM500 891.6666666666666C516.0416666666666 876.75 599.5833333333334 796.1666666666666 641.9166666666666 661.3333333333334H358.0833333333334C400.4166666666667 796.1666666666667 483.9583333333334 876.75 500.0000000000001 891.6666666666666zM417.7916666666667 882.875C378.75 835.7916666666666 329.9583333333333 760.75 301.875 661.2916666666667H143.125C193.75 772.9166666666667 295.0833333333333 856.625 417.7916666666667 882.875zM123.375 607.125H289.4166666666667C283.3333333333333 573.5833333333334 279.1666666666667 538.2083333333334 279.1666666666667 500C279.1666666666667 480.6666666666666 280.6666666666667 446.0416666666668 288 402.9583333333334H120.6666666666666C112.7083333333333 434 108.3333333333333 466.4583333333334 108.3333333333333 500C108.3333333333333 537.1666666666667 113.7083333333333 573.0833333333333 123.375 607.125zM139 348.7916666666667H299.5833333333333C317.9583333333333 277.8749999999999 352.5416666666666 194.1666666666668 417.3333333333333 117.25C291.2083333333333 144.375 187.875 232.3333333333334 139 348.7916666666668zM355.6666666666667 348.7916666666667H644.2916666666666C623 273.8750000000001 581.3749999999999 184.0416666666666 500 108.3333333333333C418.625 184.0416666666666 377 273.8749999999999 355.6666666666667 348.7916666666667zM582.6666666666666 117.25C647.4999999999999 194.1666666666668 682.0416666666666 277.8750000000001 700.4166666666666 348.7916666666668H860.9999999999999C812.1249999999999 232.3333333333334 708.7916666666666 144.375 582.6666666666665 117.25z"/></g></svg>';
    const EXTERNAL_LINK_SVG = '<svg width="20" height="20" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true"><g transform="scale(1,-1) translate(0,-1000)"><path d="M864.0833333333333 846.07625A33.4420833333333 33.4420833333333 0 0 1 833.3333333333333 866.6708333333333H583.3333333333333A33.3254166666667 33.3254166666667 0 0 1 583.3333333333333 800.0204166666667H752.8891666666666L393.1070833333333 440.2383333333334A33.3183333333333 33.3183333333333 0 1 1 440.22625 393.1191666666668L800.0083333333332 752.90125V583.3454166666667A33.325 33.325 0 0 1 866.6583333333332 583.3454166666667V833.3454166666667A33.245 33.245 0 0 1 864.0833333333333 846.07625zM833.3333333333333 408.3375000000001A33.3416666666667 33.3416666666667 0 0 1 800.0083333333332 375.0120833333334V200.0041666666667H199.9916666666667V800.0204166666667H375A33.3254166666667 33.3254166666667 0 0 1 375 866.6708333333333H166.6666666666667A33.3416666666667 33.3416666666667 0 0 1 133.3416666666667 833.3454166666667V166.67875A33.34125 33.34125 0 0 1 166.6666666666667 133.35375H833.3333333333333A33.34125 33.34125 0 0 1 866.6583333333333 166.67875V375.0120833333334A33.3416666666667 33.3416666666667 0 0 1 833.3333333333333 408.3375000000001z"/></g></svg>';

    body.innerHTML = sources.map(s => `
      <div class="ava-src-item">
        <div class="ava-src-title-row">
          <span class="ava-src-icon">${GLOBE_SVG}</span>
          <span class="ava-src-title">${s.title}</span>
        </div>
        <span class="ava-src-subtitle">${s.subtitle}</span>
        <span class="ava-src-excerpt">${s.excerpt}</span>
        <button class="ava-src-link" onclick="window.open('${s.linkUrl}', '_blank')">${EXTERNAL_LINK_SVG}<span class="ava-src-link-text">${s.linkText}</span></button>
      </div>
    `).join('');

    // Measure anchor and popover
    pop.style.visibility = 'hidden';
    pop.style.opacity = '0';
    pop.classList.add('visible');
    pop.setAttribute('aria-hidden', 'false');

    const anchorRect = anchorEl.getBoundingClientRect();
    const popW = pop.offsetWidth;
    const popH = pop.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 24;
    const gap = 12;

    // Compute anchor midpoints
    const anchorMidX = anchorRect.left + anchorRect.width / 2;
    const anchorMidY = anchorRect.top + anchorRect.height / 2;

    let top, left, arrowClass, arrowOffset;

    // Try LEFT
    if (anchorRect.left - popW - gap >= margin) {
      left = anchorRect.left - popW - gap;
      top = anchorMidY - popH / 2;
      top = Math.max(margin, Math.min(top, vh - popH - margin));
      arrowClass = 'arrow-right';
      arrowOffset = (anchorMidY - top) + 'px';
      pop.style.setProperty('--arrow-offset', arrowOffset);
    }
    // Try ABOVE
    else if (anchorRect.top - popH - gap >= margin) {
      top = anchorRect.top - popH - gap;
      left = anchorMidX - popW / 2;
      left = Math.max(margin, Math.min(left, vw - popW - margin));
      arrowClass = 'arrow-bottom';
      arrowOffset = (anchorMidX - left) + 'px';
      pop.style.setProperty('--arrow-offset', arrowOffset);
    }
    // Fallback BELOW
    else {
      top = anchorRect.bottom + gap;
      left = anchorMidX - popW / 2;
      left = Math.max(margin, Math.min(left, vw - popW - margin));
      arrowClass = 'arrow-top';
      arrowOffset = (anchorMidX - left) + 'px';
      pop.style.setProperty('--arrow-offset', arrowOffset);
    }

    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
    pop.classList.remove('arrow-right', 'arrow-bottom', 'arrow-top');
    pop.classList.add(arrowClass);

    // Reveal
    pop.style.visibility = '';
    pop.style.opacity = '';
  }
```

- [ ] **Step 3: Verify functions are present**

Run:
```bash
grep -n "_openCitationPopover\|_closeCitationPopover" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: `function _closeCitationPopover()` and `function _openCitationPopover(anchorEl, citationKey)` declarations.

- [ ] **Step 4: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: add _openCitationPopover and _closeCitationPopover JS functions"
```

---

### Task 5: Update Tokyo response array

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (lines ~4729–4733)

- [ ] **Step 1: Confirm current Tokyo response array**

Run:
```bash
grep -n "tokyo:" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html" | head -5
```
Expected: first match around line 4729 inside `CANNED_RESPONSES`.

- [ ] **Step 2: Replace the Tokyo response entries**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```js
    tokyo: [
      { type: 'p',  text: "No, setting the deductible to 75,000 EUR for a location based in Tokyo with a TSI of 15,000,000 EUR is not possible." },
      { type: 'p',  text: "The mandatory deductible for earthquake perils in the critical category, which includes California and Japan, is 5% of the exposed TSI with a minimum of 100,000 EUR and no maximum cap." },
      { type: 'p',  text: "For a TSI of 15,000,000 EUR, the deductible would be 5% of 15,000,000 EUR, which is 750,000 EUR, since this amount is higher than the minimum of 100,000 EUR." }
    ]
```

Replace with:
```js
    tokyo: [
      { type: 'p', text: "No, setting the deductible to 75,000 EUR for a location based in Tokyo with a TSI of 15,000,000 EUR is not possible." },
      { type: 'p', html: true, text: 'The mandatory deductible for earthquake perils in the critical category, which includes California and Japan, is <a class="ava-citation-link" data-citation="tsi-rate">5% of the exposed TSI</a> with a minimum of <a class="ava-citation-link" data-citation="min-floor">100,000 EUR and no maximum cap.</a>' },
      { type: 'p', text: "For a TSI of 15,000,000 EUR, the deductible would be 5% of 15,000,000 EUR, which is 750,000 EUR, since this amount is higher than the minimum of 100,000 EUR. The requested 75,000 EUR represents only 0.5% of TSI — well below both the 5% mandatory rate and the 100,000 EUR floor." },
      { type: 'p', html: true, text: 'Tokyo falls under the highest seismic risk classification (<a class="ava-citation-link" data-citation="zone">Zone 1 NatCat critical</a>), which is why the 5% mandatory floor applies rather than a standard deductible table.' },
      { type: 'p', text: "To proceed, the minimum deductible must be set to 750,000 EUR. Would you like me to update the location rule draft accordingly?" }
    ]
```

- [ ] **Step 3: Verify the replacement**

Run:
```bash
grep -n "ava-citation-link" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: CSS lines (from Task 1) plus the 3 `data-citation` instances in the tokyo array (`tsi-rate`, `min-floor`, `zone`).

- [ ] **Step 4: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: update tokyo response array with citation keyword links"
```

---

### Task 6: Wire click delegation for `.ava-citation-link`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (in `<script>`, near the `buildResponseBody` function renderer)

- [ ] **Step 1: Confirm the html:true branch in buildResponseBody**

Run:
```bash
grep -n "line\.html\|innerHTML\|html: true" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html" | head -10
```
Expected: no existing `line.html` branch — the current renderer uses `el.textContent = line.text` for all `'p'` types.

- [ ] **Step 2: Update the `'p'` branch of `buildResponseBody` to support `html: true`**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```js
      if (line.type === 'p') {
        el = document.createElement('p');
        el.textContent = line.text;
        currentUl = null;
        container.appendChild(el);
```

Replace with:
```js
      if (line.type === 'p') {
        el = document.createElement('p');
        if (line.html) { el.innerHTML = line.text; } else { el.textContent = line.text; }
        currentUl = null;
        container.appendChild(el);
```

- [ ] **Step 3: Add click delegation on the AVA panel content area**

Find in `AVA demo/feature-mockup/AVA-mockup_update.html`:
```js
  function _closeCitationPopover() {
```

Replace with:
```js
  // Citation link click delegation — attached once on the AVA panel scroll container
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.ava-citation-link');
    if (link) {
      e.preventDefault();
      _openCitationPopover(link, link.dataset.citation);
    }
  });

  function _closeCitationPopover() {
```

- [ ] **Step 4: Verify delegation and html branch are present**

Run:
```bash
grep -n "closest.*ava-citation-link\|line\.html" "/Users/AZT251742/AVA demo/feature-mockup/AVA-mockup_update.html"
```
Expected: one line for `closest('.ava-citation-link')` and one line for `line.html`.

- [ ] **Step 5: Open in browser and test manually**

Open `AVA demo/feature-mockup/AVA-mockup_update.html` in a browser. Send the Tokyo message ("deductible" / "tokyo" keyword). Verify:

| Test | Expected |
|---|---|
| AVA response renders | 5 paragraphs, 3 underlined blue links (semibold) |
| Click "5% of the exposed TSI" | Popover opens left of keyword, 1 source, arrow points right |
| Click "100,000 EUR and no maximum cap." | Popover opens, 2 sources, arrow points right |
| Click "Zone 1 NatCat critical" | Popover opens, 1 source, arrow points right |
| Click X on open popover | Popover closes |
| Click second keyword while one is open | Nothing happens |
| Hover over citation link | Color changes to `#008ED6` |
| Popover does not clip off screen | Clamped within 24px viewport margin |

(Cannot be automated — flag for user to verify manually.)

- [ ] **Step 6: Commit**

```bash
git -C "/Users/AZT251742" add "AVA demo/feature-mockup/AVA-mockup_update.html"
git -C "/Users/AZT251742" commit -m "feat: wire citation link click delegation and html renderer support"
```

---

## Rollback

All 6 tasks are independent commits. To fully revert:
```bash
git -C "/Users/AZT251742" revert HEAD HEAD~1 HEAD~2 HEAD~3 HEAD~4 HEAD~5
```
Or revert individually by commit hash.
