# Skill: Deploy Code Components to Test

Use this skill to deploy code components to the Webflow test library. This is a local operation that must be run from a non-main branch.

## Prerequisites

- **Project must be a Webflow Code Components project** - verify by checking for `webflow.json` in the project root. If not present, this skill does not apply.
- Must NOT be on the `main` branch (test deployments only)
- Code changes should be committed or staged

## Workflow

### Step 1: Verify Branch

Check that the current branch is NOT `main`:

```bash
git branch --show-current
```

**If the branch is `main`, STOP and error.** Test deployments should only be made from feature/development branches.

### Step 2: Deploy to Test

Run the deploy command:

```bash
npm run deploy
```

This executes `npx webflow library share --no-input` which deploys the code component library to Webflow.

### Step 3: Follow-up Skills

After deployment completes successfully, you can optionally run:

1. **Update Code Components** - Open Webflow Designer and accept the component updates
2. **Publish to Staging** - Publish the site to staging to test the changes

## Complete Automation Sequence

```bash
# 1. Check current branch
BRANCH=$(git branch --show-current)

# 2. Verify not on main
if [ "$BRANCH" = "main" ]; then
  echo "ERROR: Cannot deploy to test from main branch"
  exit 1
fi

# 3. Deploy to test
npm run deploy
```

## Notes

- The `main` branch should only be used for production deployments
- Test deployments allow you to verify changes in Webflow Designer before merging
- After `npm run deploy`, the Webflow Designer will show "Review changes" for the updated library
- Version number in the library name (e.g., "Sygnal Media Test v0.1.8") is defined in `webflow.json`
