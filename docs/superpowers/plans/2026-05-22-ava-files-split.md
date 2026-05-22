# AVA Files Split Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the full-panel `file-mode` takeover with a 768px split layout — left chat column (flex-1) and right files column (384px fixed) — using the same `.ava-body-row.files-mode` pattern already established by the sources split.

**Architecture:** `.ava-files-col` is added as a third sibling inside `.ava-body-row` (alongside `.ava-chat-col` and `.ava-sources-col`). `.ava-body-row.files-mode { flex-direction: row }` reveals it. `_enterFilesSplit()` / `_exitFilesSplit()` mirror the existing `_enterSourcesSplit()` / `_exitSourcesSplit()` pattern exactly. The old `enterFileListMode()` function, `.ava-file-list` HTML element, and `file-mode` CSS rules are all removed.

**Tech Stack:** Plain HTML/CSS/JS, single-file mockup — no build step. File: `AVA demo/feature-mockup/AVA-mockup_update.html`

---

## File Structure

- Modify only: `AVA demo/feature-mockup/AVA-mockup_update.html`

---

### Task 1: Add `.ava-files-col` CSS rules

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (~line 1983)

- [ ] **Step 1: Add `.ava-files-col` CSS after the sources-mode rules**

Find this line (~line 1983):
```css
    .ava-body-row.sources-mode .ava-toolbar-breadcrumb .crumb-sources-label { display: block; }
```

After it, add:
```css

    /* ── Files split layout ── */

    /* The files column: fixed 384px, hidden by default */
    .ava-files-col {
      display: none;
      flex-direction: column;
      width: 384px;
      flex-shrink: 0;
      border-left: 1px solid #d9d9d9;
      height: 100%;
      overflow: hidden;
    }

    /* In files-mode: body-row becomes a side-by-side row, files column becomes visible */
    .ava-body-row.files-mode {
      flex-direction: row;
    }
    .ava-body-row.files-mode .ava-files-col { display: flex; }
    /* Constrain bubbles in the narrower chat column */
    .ava-body-row.files-mode .ava-msg-wrap,
    .ava-body-row.files-mode .ava-footer > * { max-width: 344px; }
    .ava-body-row.files-mode .ava-footer-actions { max-width: none; }

    /* Files column toolbar */
    .ava-files-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 4px 24px;
      height: 40px;
      flex-shrink: 0;
      background: #f5f5f5;
      border-bottom: 1px solid #d9d9d9;
      box-sizing: border-box;
    }
    .ava-files-toolbar-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5rem;
      color: #414141;
      flex: 1;
      min-width: 0;
    }
    .ava-files-toolbar-actions {
      display: flex;
      gap: 4px;
      align-items: center;
      padding-right: 4px;
      flex-shrink: 0;
    }

    /* Files content area */
    .ava-files-content {
      display: flex;
      flex: 1 0 0;
      flex-direction: column;
      background: white;
      overflow-y: auto;
      padding: 16px;
      gap: 24px;
      box-sizing: border-box;
    }

    /* Files column date group header (Day Divider) */
    .ava-files-date-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ava-files-date-label {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0.2px;
      color: #767676;
    }

    /* Files column file row */
    .ava-files-row {
      display: flex;
      flex-direction: column;
    }
    .ava-files-row-content {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 8px 7px 0;
    }
    .ava-files-row-filename {
      flex: 1 0 0;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      padding: 8px;
      min-width: 0;
    }
    .ava-files-row-icon { flex-shrink: 0; width: 24px; height: 24px; }
    .ava-files-row-name {
      flex: 1;
      min-width: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #414141;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ava-files-row-date {
      flex-shrink: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0.2px;
      color: #414141;
      white-space: nowrap;
      text-align: right;
    }
    .ava-files-row-border {
      height: 1px;
      background: #d9d9d9;
      width: 100%;
    }
```

- [ ] **Step 2: Verify in browser**

Open `AVA demo/feature-mockup/AVA-mockup_update.html`. Nothing should look different yet — `.ava-files-col` doesn't exist in HTML. Check browser console for CSS errors.

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "style: add .ava-files-col CSS — files-mode split on body-row, file row spacing from Figma"
```

---

### Task 2: Add `.ava-files-col` HTML inside `.ava-body-row`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (~line 4099)

- [ ] **Step 1: Add `.ava-files-col` HTML after `.ava-sources-col`**

Find this block (~line 4099):
```html
        </div><!-- /ava-sources-col -->

        </div><!-- /ava-body-row -->
```

Replace with:
```html
        </div><!-- /ava-sources-col -->

        <!-- Files column: shown as right panel in files-mode split -->
        <div class="ava-files-col" id="ava-files-col">
          <div class="ava-files-toolbar">
            <span class="ava-files-toolbar-title">Files</span>
            <div class="ava-files-toolbar-actions">
              <button class="ava-plain-btn" onclick="exitToChat()" aria-label="Close files">
                <svg width="24" height="24" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true">
                  <g transform="scale(1,-1) translate(0,-1000)">
                    <path d="M558.9166666666666 500L779.4583333333334 720.5416666666667A41.6666666666667 41.6666666666667 0 1 1 720.5416666666666 779.4583333333334L500 558.9166666666667L279.4583333333333 779.4583333333334A41.6666666666667 41.6666666666667 0 0 1 220.5416666666667 720.5416666666667L441.0833333333333 500L220.5416666666667 279.4583333333334A41.6666666666667 41.6666666666667 0 1 1 279.4583333333333 220.5416666666666L500 441.0833333333334L720.5416666666666 220.5416666666666A41.6666666666667 41.6666666666667 0 0 1 779.4583333333334 279.4583333333334z"/>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div class="ava-files-content" id="ava-files-panel"></div>
        </div><!-- /ava-files-col -->

        </div><!-- /ava-body-row -->
```

- [ ] **Step 2: Verify structure in browser**

Open the file. The AVA panel should look identical to before (`.ava-files-col` is `display:none`). Inspect the DOM: `.ava-body-row` → `.ava-chat-col` + `.ava-sources-col` + `.ava-files-col`.

- [ ] **Step 3: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "markup: add .ava-files-col HTML inside .ava-body-row with toolbar + files panel"
```

---

### Task 3: Remove old `file-mode` CSS rules and `.ava-file-list` HTML

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html`

The old `file-mode` CSS blocks that hide `.ava-content`/`.ava-footer` and show `.ava-file-list` are no longer needed. The `.ava-file-list` HTML element inside `.ava-chat-col` is also removed. The `.ava-file-actions` rules are removed too.

- [ ] **Step 1: Remove the 3 old file-mode visibility rules from CSS**

Find (~line 1669):
```css
    .ava-panel.file-mode .ava-file-list { display: flex; }
    .ava-panel.file-mode .ava-content { display: none; }
    .ava-panel.file-mode .ava-footer { display: none; }
```

Delete all three lines.

- [ ] **Step 2: Remove the file-mode toolbar rule**

Find (~line 1898):
```css
    .ava-panel.file-mode .ava-toolbar-actions { display: none; }
    /* File list toolbar actions — only when files exist */
    .ava-file-actions { display: none; align-items: center; flex-shrink: 0; margin-left: auto; }
    .ava-panel.file-mode:has(.ava-file-list.has-files) .ava-file-actions { display: flex; }
```

Delete all four lines (including the comment).

- [ ] **Step 3: Remove the `.ava-file-list` base CSS block and related rules**

Find and remove this entire block (~lines 1659–1737, `.ava-file-list` through `.ava-file-row-menu-btn:active`):
```css
    .ava-file-list {
      display: none;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: white;
      overflow-y: auto;
    }
```
...through:
```css
    .ava-file-row-menu-btn:active { background: #d9d9d9; }
```

Also remove the `.ava-file-ctx-menu`, `.ava-file-ctx-item` blocks immediately following (lines ~1738–1765).

Also remove the date group / file row CSS:
```css
    .ava-file-list.has-files {
```
...through:
```css
    .ava-file-date-label {
```
(lines ~1674–1691).

Also find and remove (~line 1782):
```css
    .ava-panel.preview-mode .ava-file-list { display: none; }
```

- [ ] **Step 4: Remove the `.ava-file-list` HTML element from the chat column**

Find (~line 3878):
```html
        <!-- File list panel — shown when file-mode is active -->
        <div class="ava-file-list" id="ava-file-list">
          <p class="ava-file-empty-text">No files attached to this chat</p>
          <button class="ava-attach-btn" onclick="document.getElementById('ava-file-input').click()">Attach file</button>
        </div>
```

Delete all five lines (comment + div + contents + closing div).

- [ ] **Step 5: Verify in browser**

Open the file. AVA panel should look identical to before. No console errors. Opening the file panel (if you temporarily call `enterFileListMode()` in console) should no longer show the old takeover — but wait for Task 5 before testing this.

- [ ] **Step 6: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "refactor: remove old file-mode CSS + .ava-file-list HTML — replaced by files split"
```

---

### Task 4: Add `_filesPreState`, `_enterFilesSplit()`, and `_exitFilesSplit()`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (~line 5659, before `_exitSourcesSplit`)

- [ ] **Step 1: Add `_filesPreState` + `_exitFilesSplit()` immediately before `_exitSourcesSplit()`**

Find (~line 5659):
```js
  function _exitSourcesSplit() {
```

Immediately before it, add:
```js
  let _filesPreState = null;

  function _exitFilesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (bodyRow) bodyRow.classList.remove('files-mode');

    if (_filesPreState) {
      if (_filesPreState.wasExpanded) {
        panelWrap.style.setProperty('--ava-expanded-w', _filesPreState.width + 'px');
        document.documentElement.style.setProperty('--ava-bubble-max-w', (_filesPreState.width - 40) + 'px');
      } else {
        panelWrap.classList.remove('expanded');
        panelWrap.style.removeProperty('--ava-expanded-w');
        document.documentElement.style.setProperty('--ava-bubble-max-w', '312px');
        const expandBtn = document.getElementById('ava-expand-btn');
        if (expandBtn) {
          expandBtn.setAttribute('data-tooltip', 'Expand');
          expandBtn.innerHTML = EXPAND_ICON_SVG;
        }
      }
      _filesPreState = null;
    }
  }

```

- [ ] **Step 2: Add `let _filesColHtml = ''` and `_enterFilesSplit()` after `_enterSourcesSplit()`**

Find the end of `_enterSourcesSplit()` (~line where `_sourcesHtml` and `_sourcesPreState` are declared). Locate the line:
```js
  let _sourcesPreState = null;
  let _sourcesHtml = '';
```

After the entire `_enterSourcesSplit()` function body (find its closing `}`), add:
```js
  let _filesColHtml = '';

  function _enterFilesSplit() {
    const bodyRow = document.getElementById('ava-body-row');
    if (!bodyRow || panelWrap.classList.contains('floating')) return;

    // Save pre-state so _exitFilesSplit can restore it
    _filesPreState = {
      wasExpanded: panelWrap.classList.contains('expanded'),
      width: parseFloat(panelWrap.style.getPropertyValue('--ava-expanded-w')) || 640
    };

    // Force 768px split width — bypass hasRoom() guard
    panelWrap.classList.add('expanded');
    panelWrap.style.setProperty('--ava-expanded-w', '768px');
    document.documentElement.style.setProperty('--ava-bubble-max-w', '344px');

    // Apply files-mode to the body row (header stays full-width above the row)
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('sources-mode', 'preview-mode');
    bodyRow.classList.add('files-mode');

    // Show files breadcrumb
    _showFileBreadcrumb('Files');

    // Populate files panel
    if (_filesColHtml) {
      document.getElementById('ava-files-panel').innerHTML = _filesColHtml;
    }
  }
```

- [ ] **Step 3: Verify in browser console**

Open the file, open browser console, and run:
```js
_enterFilesSplit();
```
Expected: AVA panel expands to 768px, right column appears with "Files" header. Run:
```js
exitToChat();
```
Expected: panel collapses back (but exitToChat doesn't call `_exitFilesSplit` yet — that's Task 5). Then manually run:
```js
_exitFilesSplit();
```

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: add _filesPreState + _enterFilesSplit() + _exitFilesSplit() — mirrors sources split pattern"
```

---

### Task 5: Update `exitToChat()` and clean up remaining `file-mode` references

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html` (~line 5681)

- [ ] **Step 1: Update `exitToChat()` to call `_exitFilesSplit()`**

Find:
```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _exitSourcesSplit();
    _hideBreadcrumb();
  }
```

Replace with:
```js
  function exitToChat() {
    const avaPanel = document.querySelector('.ava-panel');
    avaPanel.classList.remove('file-mode', 'sources-mode', 'preview-mode');
    _exitSourcesSplit();
    _exitFilesSplit();
    _hideBreadcrumb();
  }
```

- [ ] **Step 2: Remove `file-mode` from remaining `classList.remove` calls that no longer need it**

Find (~line 5449):
```js
      avaPanel.classList.remove('file-mode', 'preview-mode');
```
This is inside the resize/collapse logic. Change to:
```js
      avaPanel.classList.remove('preview-mode');
```

Find (~line 5495):
```js
    avaPanel.classList.remove('history-mode', 'file-mode', 'preview-mode', 'chat-mode');
```
Change to:
```js
    avaPanel.classList.remove('history-mode', 'preview-mode', 'chat-mode');
```

Find (~line 5513):
```js
    avaPanel.classList.remove('history-mode', 'file-mode', 'preview-mode');
```
Change to:
```js
    avaPanel.classList.remove('history-mode', 'preview-mode');
```

Find (~line 5708):
```js
    avaPanel.classList.remove('file-mode', 'preview-mode');
```
This is inside `_enterSourcesSplit()`. Change to:
```js
    avaPanel.classList.remove('preview-mode');
```

- [ ] **Step 3: Remove `enterFileListMode()`, `toggleFileList()`, and `renderFileList()` functions**

Find and remove the entire `enterFileListMode()` function body:
```js
  function enterFileListMode() {
    const avaPanel = document.querySelector('.ava-panel');
    const inChatOrPreview = avaPanel.classList.contains('chat-mode') || avaPanel.classList.contains('preview-mode');
    avaPanel.classList.remove('preview-mode');
    avaPanel.classList.add('file-mode');
    _showFileBreadcrumb();
    // Populate file list with the attachment if we're in a tokyo chat
    renderFileList(avaPanel.dataset.hasFile === 'true');
  }
```

Find and remove the entire `toggleFileList()` function:
```js
  function toggleFileList() {
    const avaPanel = document.querySelector('.ava-panel');
    if (avaPanel.classList.contains('file-mode')) {
      exitToChat();
    } else {
      enterFileListMode();
    }
  }
```

Find and remove the entire `renderFileList()` function (from `function renderFileList(hasFile) {` through its closing `}`).

- [ ] **Step 4: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "refactor: update exitToChat() + remove enterFileListMode/renderFileList — file-mode fully retired"
```

---

### Task 6: Update call sites — wire `_enterFilesSplit()` with `_filesColHtml`

**Files:**
- Modify: `AVA demo/feature-mockup/AVA-mockup_update.html`

The call sites for `enterFileListMode()` in HTML are:
1. The toolbar "Files" button onclick (~line 3836)
2. The crumb-files "Files" breadcrumb button onclick (~line 3808)

Both need to call `_enterFilesSplit()` instead. `_filesColHtml` must be set before calling it for the files panel to be populated. Since the file list content is static (the same 10 files regardless of which button triggers it), we pre-set `_filesColHtml` once at page-load time (or lazily on first call). The simplest approach: set `_filesColHtml` in the call site just before calling `_enterFilesSplit()`.

The PDF icon SVG is already defined as `PDF_ICON_SVG` inside `renderFileList()` — once that function is removed, we need to inline the SVG in `_filesColHtml`. The MENU_ICON_SVG is also needed.

- [ ] **Step 1: Update the HTML toolbar "Files" button**

Find (~line 3836):
```html
            <button class="ava-tertiary-btn" data-tooltip="Files" data-tooltip-pos="below" onclick="enterFileListMode()">
```

Replace with:
```html
            <button class="ava-tertiary-btn" data-tooltip="Files" data-tooltip-pos="below" onclick="_enterFilesSplit()">
```

- [ ] **Step 2: Update the breadcrumb "Files" button**

Find (~line 3808):
```html
              <button class="crumb-parent" onclick="enterFileListMode()">Files</button>
```

Replace with:
```html
              <button class="crumb-parent" onclick="_enterFilesSplit()">Files</button>
```

- [ ] **Step 3: Set `_filesColHtml` as a module-level constant near `_enterFilesSplit()`**

After the line `let _filesColHtml = '';`, replace it with a populated value. The PDF icon SVG and MENU icon SVG are the same as those defined inside the old `renderFileList()`. Place this immediately before `function _enterFilesSplit()`:

```js
  const _PDF_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g clip-path="url(#fl-pdf-clip)"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 21.4032H8C7.783 21.4032 7.601 21.2202 7.601 21.0042V3.00024C7.601 2.78324 7.783 2.59924 8 2.59924H15.4V6.79924C15.4 7.24124 15.759 7.59924 16.2 7.59924H20.4V21.0042C20.4 21.2202 20.217 21.4032 20 21.4032ZM19.269 6.00024H17V3.73124L19.269 6.00024ZM21.993 6.80524C21.994 6.59524 21.92 6.38824 21.766 6.23424L16.766 1.23424C16.608 1.07624 16.396 1.00224 16.181 1.00624L16.175 1.00024H8C6.9 1.00024 6 1.89924 6 3.00024V21.0042C6 22.1032 6.9 23.0042 8 23.0042H20C21.101 23.0042 22 22.1032 22 21.0042V6.81224L21.993 6.80524Z" fill="#767676"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21 9H20H4C3.45 9 3 9.45 3 10V19C3 19.55 3.45 20 4 20H20H21H22V19V10V9H21Z" fill="#DC3149"/><path d="M18.4602 11.8315V12.7675H16.3722V14.2005H18.0602V15.1275H16.3722V17.1675H15.3802V11.8315H18.4602Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.22804 11.8317C8.59104 11.8317 8.90504 11.9047 9.17204 12.0477C9.43904 12.1927 9.64404 12.3947 9.78804 12.6567C9.93204 12.9167 10.004 13.2187 10.004 13.5597C10.004 13.8957 9.93204 14.1947 9.78804 14.4557C9.64404 14.7177 9.43904 14.9207 9.17204 15.0687C8.90504 15.2147 8.59104 15.2877 8.22804 15.2877H7.53204V17.1677H6.54004V11.8317H8.22804ZM8.22804 14.3517C8.46804 14.3517 8.65804 14.2807 8.80004 14.1357C8.94204 13.9917 9.01204 13.7997 9.01204 13.5597C9.01204 13.3207 8.94204 13.1277 8.80004 12.9847C8.65804 12.8397 8.46804 12.7677 8.22804 12.7677H7.53204V14.3517H8.22804Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.1242 11.8324C12.6312 11.8324 13.0632 11.9424 13.4202 12.1644C13.7772 12.3854 14.0472 12.6974 14.2282 13.0994C14.4092 13.5024 14.5002 13.9704 14.5002 14.5034C14.5002 15.0374 14.4092 15.5034 14.2282 15.9044C14.0472 16.3034 13.7772 16.6144 13.4202 16.8354C13.0632 17.0574 12.6312 17.1674 12.1242 17.1674H10.8282V11.8324H12.1242ZM12.1242 16.2324C12.5932 16.2324 12.9412 16.0794 13.1682 15.7714C13.3952 15.4654 13.5082 15.0424 13.5082 14.5034C13.5082 13.9654 13.3952 13.5414 13.1682 13.2324C12.9412 12.9224 12.5932 12.7674 12.1242 12.7674H11.8202V16.2324H12.1242Z" fill="white"/></g><defs><clipPath id="fl-pdf-clip"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>`;
  const _MENU_ICON = `<svg width="16" height="16" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true"><g transform="scale(1,-1) translate(0,-1000)"><path d="M416.6666666666667 750A83.3333333333333 83.3333333333333 0 0 1 583.3333333333333 750A83.3333333333333 83.3333333333333 0 0 1 416.6666666666667 750M416.6666666666667 500A83.3333333333333 83.3333333333333 0 0 1 583.3333333333333 500A83.3333333333333 83.3333333333333 0 0 1 416.6666666666667 500M416.6666666666667 250A83.3333333333333 83.3333333333333 0 0 1 583.3333333333333 250A83.3333333333333 83.3333333333333 0 0 1 416.6666666666667 250"/></g></svg>`;

  function _makeFileRow(filename, date) {
    return `<div class="ava-files-row">
      <div class="ava-files-row-content">
        <div class="ava-files-row-filename">
          <span class="ava-files-row-icon">${_PDF_ICON}</span>
          <span class="ava-files-row-name" title="${filename}">${filename}</span>
        </div>
        <span class="ava-files-row-date">${date}</span>
        <button class="ava-tertiary-btn" aria-label="More options">${_MENU_ICON}</button>
      </div>
      <div class="ava-files-row-border"></div>
    </div>`;
  }

  let _filesColHtml = (function() {
    const todayFiles = ['Lob-presentation_240116.pdf','Risk_assessment_Tokyo_Q1.pdf','Underwriting_guidelines_v3.pdf','NatCat_zones_2024.pdf','Deductible_table_EQ.pdf'];
    const lastWeekFiles = ['Policy_draft_LCUW_001.pdf','Exposure_data_Japan.pdf','TSI_calculation_sheet.pdf','Reinsurance_treaty_2024.pdf','Claims_history_Tokyo.pdf'];
    const todayRows = todayFiles.map(f => _makeFileRow(f, '22/05/2026')).join('');
    const lastWeekRows = lastWeekFiles.map(f => _makeFileRow(f, '15/05/2026')).join('');
    return `
      <div class="ava-files-date-group">
        <div class="ava-files-date-label">Today &middot; 5 files attached</div>
        ${todayRows}
      </div>
      <div class="ava-files-date-group">
        <div class="ava-files-date-label">Last week &middot; 5 files attached</div>
        ${lastWeekRows}
      </div>`;
  })();
```

Remove the `let _filesColHtml = '';` line added in Task 4 Step 2 (replace it with this block).

- [ ] **Step 4: Verify end-to-end in browser**

1. Open `AVA demo/feature-mockup/AVA-mockup_update.html`
2. Open AVA panel, click the "Files" toolbar button
3. Expected: Panel expands to 768px; left chat column shows conversation; right files column shows "Files" toolbar + 2 date groups (Today · 5 files, Last week · 5 files) with correct file rows (PDF icon, filename, date, 3-dot button)
4. Click the X button in the files toolbar
5. Expected: Files column closes; panel collapses back to 384px; expand button shows "Expand" tooltip
6. Click Expand to expand to 640px, then click Files button
7. Expected: Panel goes to 768px; on X close, panel returns to 640px (not 384px)
8. Confirm file row padding matches Figma: ~8px top, ~7px bottom, 8px left on filename area, 8px right padding on outer

- [ ] **Step 5: Commit**

```bash
git add "AVA demo/feature-mockup/AVA-mockup_update.html"
git commit -m "feat: wire _enterFilesSplit() call sites — files col HTML with 2 date groups, 10 file rows"
```

---

## Self-Review

### Spec coverage

| Requirement | Task |
|---|---|
| `.ava-files-col` CSS (384px fixed, hidden by default) | Task 1 |
| `.ava-body-row.files-mode { flex-direction: row }` | Task 1 |
| Constrain bubbles to 344px in files-mode | Task 1 |
| Files column toolbar: "Files" label + X close | Task 2 |
| Files content area: `overflow-y: auto`, `p-16px`, `gap-24px` | Task 1 + 2 |
| Date group headers (Day Divider): SemiBold 14px `#767676` | Task 1 + 6 |
| File row padding: pt-8/pb-7/pr-8/filename-pl-8 | Task 1 |
| File row: PDF icon 24×24, filename Regular 16px, date Regular 14px, 3-dot button | Task 1 + 6 |
| Row bottom border `1px solid #d9d9d9` | Task 1 |
| Old file-mode CSS removed | Task 3 |
| `.ava-file-list` HTML removed | Task 3 |
| `_filesPreState` + `_enterFilesSplit()` | Task 4 |
| `_exitFilesSplit()` restores pre-state | Task 4 |
| Force 768px bypass hasRoom() | Task 4 |
| `exitToChat()` calls `_exitFilesSplit()` | Task 5 |
| `enterFileListMode()` / `renderFileList()` removed | Task 5 |
| HTML call sites updated | Task 6 |
| Float mode guard in `_enterFilesSplit()` | Task 4 |
| Two date groups, 5 files each | Task 6 |

### Placeholder scan

No TBDs or incomplete steps. All SVG paths are real values copied from the existing `renderFileList()` function in the file. All CSS values are taken directly from Figma node 953:98054 measurements.

### Type consistency

- `_filesPreState`: `{ wasExpanded: boolean, width: number } | null` — consistent in Tasks 4 and 5
- `_filesColHtml`: `string` built by IIFE — set at module level, read in `_enterFilesSplit()`
- `_enterFilesSplit()`: no parameters — reads `_filesColHtml` from module scope
- `_exitFilesSplit()`: no parameters — reads `_filesPreState` from module scope
- `bodyRow`: `document.getElementById('ava-body-row')` — consistent ID throughout all tasks
- `ava-files-panel`: ID used in Task 2 HTML and Task 4 `getElementById` call — consistent
