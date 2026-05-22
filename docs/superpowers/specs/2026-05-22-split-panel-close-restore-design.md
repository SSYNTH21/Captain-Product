# Split Panel Close — Size Restore Design

## Goal

When the user closes a split panel (sources or files) via the X button, AVA returns to its exact pre-split size: default if it was default, maximized if the user had previously maximized it. The "Files" breadcrumb in file preview goes back to the file list without affecting size.

## Current behaviour (bug)

`_enterFilesSplit()` unconditionally overwrites `_filesPreState` every time it is called. When the user clicks the "Files" breadcrumb in preview, `_exitFilesPreview()` calls `_enterFilesSplit()`, which saves a new pre-state capturing the already-expanded 768px split width. When X is then clicked, `_exitFilesSplit()` "restores" to 768px instead of the original pre-split size.

The same latent bug exists in `_enterSourcesSplit()` / `_sourcesPreState`, though the sources panel has no preview sub-state that triggers a re-entry today.

## Design

### Rule

Pre-state is saved **once** — on the first entry into split mode. Re-entry calls (e.g. returning from preview to file list) must not overwrite it.

### Fix

Wrap the pre-state assignment in both `_enterFilesSplit()` and `_enterSourcesSplit()` with a null-guard:

```js
// _enterFilesSplit()
if (!_filesPreState) {
  _filesPreState = {
    wasExpanded: panelWrap.classList.contains('expanded'),
    width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
  };
}

// _enterSourcesSplit()
if (!_sourcesPreState) {
  _sourcesPreState = {
    wasExpanded: panelWrap.classList.contains('expanded'),
    width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
  };
}
```

Pre-state is already cleared to `null` in `_exitFilesSplit()` / `_exitSourcesSplit()`, so the guard resets correctly for the next open.

### Interaction matrix

| User action | Result |
|---|---|
| Open files split (AVA at default size) | pre-state saved: `{ wasExpanded: false }` |
| Click file row → preview | `_enterFilesSplit()` called again — guard skips overwrite |
| Click "Files" breadcrumb → list | `_enterFilesSplit()` called again — guard skips overwrite |
| Click X | `_exitFilesSplit()` restores to default size ✓ |
| Open files split (AVA maximized by user) | pre-state saved: `{ wasExpanded: true, width: <user width> }` |
| Click file row → preview | guard skips overwrite |
| Click X | `_exitFilesSplit()` restores to user's maximized width ✓ |

## Scope

Two one-line guard additions: one in `_enterFilesSplit()`, one in `_enterSourcesSplit()`. No other changes.
