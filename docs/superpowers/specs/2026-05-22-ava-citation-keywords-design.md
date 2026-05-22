# AVA Citation Keywords & Source Popover — Design Spec

**Date:** 2026-05-22
**File:** `AVA demo/feature-mockup/AVA-mockup_update.html`
**Goal:** Update the Tokyo AVA response to match Figma node 940-89530. Underlined citation keywords open a fixed-position source popover showing which references AVA used to produce that information.

---

## Section 1 — Updated AVA response text & keyword markup

| Detail | Spec |
|---|---|
| Element | `<a>` (inline, no `href`) |
| Trigger attribute | `data-citation="key"` |
| Citation keys | `"tsi-rate"`, `"min-floor"`, `"zone"` |
| Color | `#006192` |
| Font weight | 600 (semibold) |
| Text decoration | underline |
| Letter spacing | 1px |
| Line height | 24px |
| Hover | `#008ED6` |
| Active | `#003781` |
| Render method | Existing `html: true` flag in the response renderer |

### Updated Tokyo response paragraphs

| Para | Text (HTML) |
|---|---|
| 1 | `No, setting the deductible to 75,000 EUR for a location based in Tokyo with a TSI of 15,000,000 EUR is not possible.` |
| 2 | `The mandatory deductible for earthquake perils in the critical category, which includes California and Japan, is <a class="ava-citation-link" data-citation="tsi-rate">5% of the exposed TSI</a> with a minimum of <a class="ava-citation-link" data-citation="min-floor">100,000 EUR and no maximum cap.</a>` |
| 3 | `For a TSI of 15,000,000 EUR, the deductible would be 5% of 15,000,000 EUR, which is 750,000 EUR, since this amount is higher than the minimum of 100,000 EUR. The requested 75,000 EUR represents only 0.5% of TSI — well below both the 5% mandatory rate and the 100,000 EUR floor.` |
| 4 | `Tokyo falls under the highest seismic risk classification (<a class="ava-citation-link" data-citation="zone">Zone 1 NatCat critical</a>), which is why the 5% mandatory floor applies rather than a standard deductible table.` |
| 5 | `To proceed, the minimum deductible must be set to 750,000 EUR. Would you like me to update the location rule draft accordingly?` |

---

## Section 2 — Citation data store

JS object `CITATION_SOURCES` in the `<script>` block, near the existing sources data.

| Citation key | Keyword text | Source(s) |
|---|---|---|
| `"tsi-rate"` | 5% of the exposed TSI | Allianz Underwriting Guidelines |
| `"min-floor"` | 100,000 EUR and no maximum cap. | Allianz Underwriting Guidelines + Global Property Underwriting Manual |
| `"zone"` | Zone 1 NatCat critical | Global Property Underwriting Manual |

Each source object shape (reuses existing sources panel structure):

```js
{
  type: 'web' | 'pdf',
  title: string,
  subtitle: string,      // "domain · Section name"
  excerpt: string,
  linkText: string,
  linkUrl: string
}
```

Source definitions to reuse from existing sources panel data:

| Source | type | title | subtitle |
|---|---|---|---|
| Allianz Underwriting Guidelines | `web` | Allianz Underwriting Guidelines | allianz-underwriting.com · Earthquake Deductibles |
| Global Property Underwriting Manual | `web` | Global Property Underwriting Manual | allianz-re.com · Location Risk Rules |

---

## Section 3 — Popover HTML & CSS

| Detail | Spec |
|---|---|
| Element | Single `<div id="ava-citation-popover">` appended to `<body>` |
| Position | `fixed` |
| Default state | Hidden (`opacity: 0`, `pointer-events: none`) |
| Visible state | `.visible` class → `opacity: 1`, `pointer-events: auto` |
| Width | `380px` |
| Max height | `420px` (≈ 3 sources × ~130px); `overflow-y: auto` beyond |
| Background | `#ffffff` |
| Border | `1px solid #d9d9d9` |
| Border radius | `4px` |
| Box shadow | `0 2px 4px rgba(65,65,65,0.5)` |
| Header | "Sources" label (`font-size: 16px`, `font-weight: 600`, `color: #414141`) + X close button (`ava-plain-btn` with existing close icon SVG) |
| Header padding | `16px 16px 12px 24px` |
| Header border | `border-bottom: 1px solid #d9d9d9` |
| Source items | Reuse existing `.ava-src-item` CSS and structure from sources panel |
| Arrow | CSS `::before` (border colour triangle) / `::after` (white fill triangle) pseudo-elements on the card — no seam (per session 4 feedback) |
| Arrow placement classes | `.arrow-right` (pointing right, popover is to the left of keyword), `.arrow-top` (pointing up, popover is below keyword), `.arrow-bottom` (pointing down, popover is above keyword) |
| z-index | `3000` (above AVA panel z-index ~2000, above toast z-index 2000) |
| Transition | `opacity 200ms ease` |

---

## Section 4 — Positioning logic

| Step | Detail |
|---|---|
| Guard | If `ava-citation-popover` already has `.visible` → do nothing; user must X-close first |
| Populate | Clear inner content, render header + source items for the given `citationKey` |
| Anchor measurement | `anchorEl.getBoundingClientRect()` |
| Preferred position | **Left** of keyword (popover to the left, arrow points right toward keyword) |
| Fallback order | Left → Above → Below |
| Left placement | `top` = keyword midY − popoverHeight/2; `left` = keywordRect.left − popoverWidth − 12 (arrow gap) |
| Above placement | `top` = keywordRect.top − popoverHeight − 12; `left` = keywordRect.left + keywordWidth/2 − popoverWidth/2 |
| Below placement | `top` = keywordRect.bottom + 12; `left` = keywordRect.left + keywordWidth/2 − popoverWidth/2 |
| Viewport clamping | Clamp `top` to `[24, viewportH − popoverHeight − 24]`; clamp `left` to `[24, viewportW − popoverWidth − 24]` |
| Arrow midpoint | Arrow `::before`/`::after` `top` or `left` offset computed from keyword midpoint relative to final clamped popover position |
| Close trigger | X button only — calls `_closeCitationPopover()` |
| Close function | Removes `.visible` class; does NOT clear DOM content (avoids flash on reopen) |

---

## CSS class: `.ava-citation-link`

| Property | Value |
|---|---|
| `color` | `#006192` |
| `font-weight` | `600` |
| `text-decoration` | `underline` |
| `text-underline-offset` | `2px` |
| `letter-spacing` | `1px` |
| `cursor` | `pointer` |
| `background` | `none` |
| `border` | `none` |
| `padding` | `0` |
| `display` | `inline` |
| hover `color` | `#008ED6` |
| active `color` | `#003781` |

---

## Out of scope

- No changes to the existing Sources panel (still accessible via the "Sources" button on the AVA response)
- No changes to any other AVA response (only the `tokyo` response is updated)
- No animation on the popover arrow position change
