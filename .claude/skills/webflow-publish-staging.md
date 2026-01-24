# Skill: Publish Webflow Site to Staging

Use this skill to publish the current Webflow site to staging only (not production).

## Prerequisites

- **Project must be a Webflow Code Components project** - verify by checking for `webflow.json` in the project root. If not present, this skill does not apply.
- **Playwright MCP must be available** - this skill requires the `mcp__playwright` or `mcp__playwright-extension` tools. If Playwright MCP is not configured, error and inform the user.
- Webflow Designer must be open in the browser via Playwright MCP

## Workflow

### Step 1: Click Publish Button

Take a snapshot to get the current page state, then click the Publish button in the top right toolbar.

```
browser_click: element="Publish button", ref="[ref from snapshot]"
```

### Step 2: Verify Checkbox States

The publish dialog will appear with two sections:
- **Staging**: Contains the webflow.io subdomain checkbox
- **Production**: Contains custom domain checkbox (if configured)

Take a snapshot and verify:
- Staging checkbox IS checked
- Production checkbox is NOT checked

If production is checked, uncheck it:
```
browser_click: element="Custom domain checkbox", ref="[ref from snapshot]"
```

### Step 3: Publish to Selected Domains

Click the "Publish to selected domains" button:

```
browser_click: element="Publish to selected domains button", ref="[ref from snapshot]"
```

### Step 4: Wait for Publishing to Complete

The dialog will show publishing progress:
- "Preparing to publish..."
- "Optimizing HTML, CSS, and JS files"
- "Packaging everything up"
- "Deploying to CDN"

Wait for completion (typically 3-5 seconds):
```
browser_wait_for: time=5
```

### Step 5: Close Dialog

Once published, the staging domain will show "Published a few seconds ago". Close the dialog:

```
browser_click: element="Close button", ref="[ref from snapshot]"
```

## Complete Automation Sequence

```javascript
// 1. Take initial snapshot
browser_snapshot()

// 2. Click Publish button (top right)
browser_click({ element: "Publish button", ref: "<publish-button-ref>" })

// 3. Snapshot to see publish dialog
browser_snapshot()

// 4. Verify staging is checked, production is not
// If production checkbox is checked, click to uncheck it
// browser_click({ element: "Custom domain checkbox", ref: "<checkbox-ref>" })

// 5. Click "Publish to selected domains"
browser_click({ element: "Publish to selected domains button", ref: "<publish-domains-ref>" })

// 6. Wait for publishing to complete
browser_wait_for({ time: 5 })

// 7. Take snapshot to verify success
browser_snapshot()

// 8. Close the dialog
browser_click({ element: "Close button", ref: "<close-button-ref>" })
```

## Notes

- The staging checkbox is typically checked by default
- Production checkbox may be disabled if no custom domain is configured
- The publish button text changes to "Publishing" with a progress bar during publish
- After successful publish, button briefly shows "Published" before reverting to "Publish"
- The staging domain status updates to show "Published a few seconds ago"
