# All-Risk Configuration Flow Demo — Design

## Summary

Add a new demo flow, "All-risk configuration flow demo," to the Captain Product Angular app. Unlike the existing "All-risk creation flow demo" (a multi-step wizard ending at the Product Details page), this new flow consists of a single page: a duplicate of the just-finished Product Details page, wired with a dirty-state interaction model so Save/Cancel and Duplicate/Publish toggle availability based on whether the user has touched anything in the General or Components overview tabs.

## Scope

In scope:
- One new route/page (`/all-risk-config`), duplicated from `product-details.component.ts/.html/.scss`
- New directory entry linking to it
- Dirty-state ("has interacted") behavior gating Save/Cancel vs. Duplicate/Publish button states
- Interaction triggers limited to the General tab and Components overview tab

Out of scope:
- Any wizard steps preceding this page (the page itself is the entire flow for now)
- New/separate mock data or service (reuses `ProductTemplateService` and its existing `DEFAULT_*` seed data as-is)
- Functional changes to Overall limits & deductibles, Localisations, or UW view tabs (remain empty placeholders, as they already are on Product Details)
- Any data-editing behavior on Components overview beyond what already exists (the radio-toggle view filter) — no new editable fields are being added there

## Routing & Files

- New route `all-risk-config` added to `app.routes.ts`, lazy-loaded like the existing `sync`/`all-risk`/`product-details` routes.
- New folder `src/app/pages/all-risk-config/` containing `all-risk-config.component.ts`, `.html`, `.scss` — created as a direct duplicate of `product-details.component.ts/.html/.scss`, then modified per the behavior below. Not a shared/abstracted component with Product Details; kept as an independent duplicate to match the existing per-flow-page pattern already used by `sync-flow`/`all-risk-flow`/`product-details`.
- Component class name: `AllRiskConfigComponent`, selector `app-all-risk-config`.
- Reuses `ProductTemplateService` unmodified — same `templateInfo`/`teamMembers`/`coverages`/`exclusions`/`extensions`/`writebacks` signals and `DEFAULT_*` seed data fallbacks already in place for direct navigation.

## Directory Entry & Flow Title

- `directory.component.html`: add `<nx-link size="small"><a routerLink="/all-risk-config">All-risk configuration flow demo</a></nx-link>` below the existing "All-risk creation flow demo" link.
- New page's `.back-to-directory-bar` `.flow-title` reads "All-risk configuration flow demo" (same markup/style as the creation flow's title, ported from the just-fixed `product-details.component.html`).
- Breadcrumb trail unchanged: "Administration > Product templates > {name}".

## Tabs

All 5 tabs remain visible and in the same order: General, Overall limits & deductibles, Components overview, Localisations, UW view.
- General and Components overview carry the real (duplicated) content and the new dirty-state behavior.
- Overall limits & deductibles, Localisations, UW view remain empty placeholders, unchanged from Product Details.

## Dirty-State Interaction Model

A single boolean signal `hasInteracted = signal(false)` on `AllRiskConfigComponent`, replacing the current always-static button-disabled logic inherited from Product Details.

**Triggers that set `hasInteracted` to `true`** (anywhere under the General or Components overview tab content):
- Clicking or focusing the Product description `<textarea>`
- Clicking/opening the Operational entities `<nx-multi-select>`
- Any Team action: opening the "Add member" card, submitting Add/Edit member, deleting a member

**Explicitly excluded (do NOT set `hasInteracted`):**
- The Components overview `<nx-radio-toggle>` (Coverages/Exclusions/Extensions/Writebacks) — this only changes which read-only table is displayed, not any data value.

**Button state derivation:**
- Save button: `[disabled]="!hasInteracted()"`
- Cancel button: `[disabled]="!hasInteracted()"`
- Duplicate button: `[disabled]="hasInteracted()"`
- Publish button: `[disabled]="hasInteracted()"`

**Reset behavior:**
- On Save click: run existing `saveGeneralInfo()` persistence logic, then `hasInteracted.set(false)`.
- On Cancel click: run existing `cancelGeneralInfo()` reset logic, then `hasInteracted.set(false)`.

**Implementation approach:** Angular's `FormGroup.dirty`/`touched` states won't catch a bare click with no value change (e.g., clicking into the textarea without typing), so `hasInteracted` is driven by explicit template event bindings (e.g. `(focus)`, `(click)`, `(ngModelChange)` where already present) on the relevant elements, rather than relying on reactive-forms dirty tracking.

## Non-Goals / Explicit Decisions

- No new mock data — both flows show identical demo data by design (per user confirmation).
- No shared component abstraction between Product Details and this new page — accepted duplication, consistent with how `sync-flow`/`all-risk-flow` are already independent, non-shared page components.
- Components overview tab's radio-toggle never triggers the dirty state, even though it lives under an in-scope tab.
