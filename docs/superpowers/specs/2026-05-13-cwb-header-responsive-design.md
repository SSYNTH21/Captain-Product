# CWB Header Responsive Design

**Date:** 2026-05-13  
**File:** `ava-mockup.html`  
**Scope:** Header + Toolbar responsive behaviour at Large (992–1279px), Medium (704–991px), and Small (320–703px). Breakpoints ≥1280px (xlarge, 2xlarge, 3xlarge) are untouched.

---

## Figma References

- Header [CWB LC] default: `yNnPAeNYg0KLWdqy64XsY9`, node `1:485920`
- Toolbar responsive cookbook: `8suv3EzDyf0zjFrDdXTo70`, node `15849:94585`
  - 992px instance (Large, no multi-edit): `15849:94587`
  - 704px instance (Medium): `15849:94590`

---

## Header: Two-Row Structure at ≤1279px

### Default (≥1280px) — no change

The existing single-row header stays exactly as-is. No CSS or HTML changes apply at this range.

### ≤1279px — two rows

Row 1 (64px): Logo + App Title + Action icons + Avatar — same content as the current single row.  
Row 2 (64px): Scrollable tab nav bar with left/right chevron scroll buttons.

#### HTML additions

1. The existing `.header-nav-items` gets a modifier class: `header-nav-items--inline` — hidden at ≤1279px via media query.
2. A new `.header-nav-row2` div is inserted between `.header-nav` and `.header-line`. Hidden at ≥1280px. Contains:
   - `.header-nav-scroll-btn.header-nav-scroll-btn--left` — plain button, `c-icon--chevron-left`, hidden when already at scroll start
   - `.header-nav-scrollable` — the scrollable container, holds the same nav items
   - `.header-nav-scroll-btn.header-nav-scroll-btn--right` — plain button, `c-icon--chevron-right`, hidden when already at scroll end
3. `.header-nav-row2` gets its own `.header-line` div (1px `#D9D9D9` bottom border).

#### Nav items in the scrollable row

Same items as the existing inline nav: Dashboard, Parties, Submissions, Task Manager, Submissions search, hxReview, Tools.  
Styling mirrors the NDBX tab nav bar: `font-size: 16px; color: #414141; white-space: nowrap`. Active item: `font-weight: 600; border-bottom: 2px solid #006192`.  
The scrollable container uses `overflow-x: scroll; scrollbar-width: none` with `-webkit-scrollbar { display: none }`.

#### Scroll button behaviour (JS)

- On load and on window resize: check if `.header-nav-scrollable` content overflows its container. If not overflowing, hide both buttons.
- Left button hidden when `scrollLeft === 0`.
- Right button hidden when `scrollLeft + clientWidth >= scrollWidth`.
- Each button click scrolls by 200px (smooth).
- On scroll event: update button visibility.

#### CSS breakpoints

```
@media (max-width: 1279px):
  .header-nav-items--inline { display: none }
  .header-nav-row2 { display: flex }

Default (≥1280px):
  .header-nav-items--inline { display: flex }  /* no change — already flex */
  .header-nav-row2 { display: none }
```

---

## Toolbar: Breadcrumb Collapse at ≤703px

The right-side toolbar actions (Submission status, Alt picker, co-edit hub, Sidebar icon) are identical at all breakpoints — no changes.

Only the **breadcrumb on the left** responds.

### ≥704px (current behaviour preserved)

Full trail: `[Client name] > […] > [Current page name]`  
The level-1 crumb (client name) and the `…` middle crumb are both visible.  
`.toolbar-actions-start` remains `shrink-0`.

### ≤703px

- `.toolbar-breadcrumb-level1` (the client name crumb + its chevron) is hidden with `display: none`.
- The `…` button becomes the first visible element.
- `.toolbar-actions-start` switches to `flex: 1 0 0; min-width: 0` so the breadcrumb area can flex and truncation works.
- The current page name span uses `overflow: hidden; text-overflow: ellipsis; flex: 1 0 0; min-width: 0`.

#### CSS breakpoints

```
Default (≥704px):
  .toolbar-breadcrumb-level1 { display: flex }
  .toolbar-actions-start { flex-shrink: 0 }

@media (max-width: 703px):
  .toolbar-breadcrumb-level1 { display: none }
  .toolbar-actions-start { flex: 1 0 0; min-width: 0 }
  .breadcrumb-current { flex: 1 0 0; min-width: 0; overflow: hidden; text-overflow: ellipsis }
```

---

## What Is Not Changed

- All breakpoints ≥1280px: zero changes to header or toolbar.
- Side nav, main content, AVA panel: out of scope.
- Toolbar right-side actions: no changes at any breakpoint.
- The existing `.header-line` between the nav row and the toolbar is retained.
