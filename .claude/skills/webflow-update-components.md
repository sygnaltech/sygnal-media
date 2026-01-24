# Skill: Update Webflow Code Components

Use this skill after deploying the code component library (`npm run deploy`) to update the components in Webflow Designer.

## Prerequisites

- **Project must be a Webflow Code Components project** - verify by checking for `webflow.json` in the project root. If not present, this skill does not apply.
- **Playwright MCP must be available** - this skill requires the `mcp__playwright` or `mcp__playwright-extension` tools. If Playwright MCP is not configured, error and inform the user.
- Webflow Designer must be open in the browser via Playwright MCP
- Code components must have been deployed via `npm run deploy`

## Workflow

### Step 1: Open Libraries Panel

Use `browser_snapshot` to get the current page state, then click the Libraries button (L) in the left toolbar.

```
browser_click: element="Libraries button", ref="[ref from snapshot]"
```

### Step 2: Find Library with Updates

Take a snapshot and locate the code component library (e.g., "Sygnal Media Test"). Look for a "Review changes" button next to it - this indicates updates are available.

### Step 3: Click Review Changes

```
browser_click: element="Review changes button", ref="[ref from snapshot]"
```

This opens a dialog showing which components have changes.

### Step 4: Accept All Updates

In the Review Changes dialog, click "Accept all updates" to apply all component updates.

```
browser_click: element="Accept all updates button", ref="[ref from snapshot]"
```

Wait for the loading indicator to complete.

### Step 5: Verify Update

Take a final snapshot to confirm the updates were applied successfully. The "Review changes" button should no longer appear next to the library.

## Complete Automation Sequence

```javascript
// 1. Take initial snapshot
browser_snapshot()

// 2. Click Libraries (L) button in left toolbar
browser_click({ element: "Libraries button", ref: "<L-button-ref>" })

// 3. Snapshot to find the library
browser_snapshot()

// 4. Click "Review changes" next to the library
browser_click({ element: "Review changes button", ref: "<review-button-ref>" })

// 5. Snapshot to see the dialog
browser_snapshot()

// 6. Click "Accept all updates"
browser_click({ element: "Accept all updates button", ref: "<accept-button-ref>" })

// 7. Wait for update to complete
browser_wait_for({ time: 2 })

// 8. Final snapshot to verify
browser_snapshot()
```

## Notes

- If no "Review changes" button appears, the components are already up to date
- The dialog shows which specific components have changes before accepting
- After accepting, the page canvas may reload to reflect the updated components
