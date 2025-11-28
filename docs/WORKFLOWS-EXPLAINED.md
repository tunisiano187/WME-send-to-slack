# GitHub Actions Workflows Explained

## Overview

Three GitHub Actions workflows automate changelog management and releases.

## 1. Sync Changelog (sync-changelog.yml)

### When It Runs

- On push to master when `WME-send-to-slack.user.js` is modified
- Manual trigger via "Run workflow"

### What It Does

```
Push WME-send-to-slack.user.js
        ↓
Workflow detects change
        ↓
Runs: node changelog/sync-changelog.js
        ↓
Detects changelog changes
        ↓
Auto-commits with: "chore: sync changelog [skip ci]"
        ↓
Pushes changes to master
```

### Configuration

```yaml
on:
  push:
    paths:
      - 'WME-send-to-slack.user.js'
    branches:
      - master
  workflow_dispatch:  # Manual trigger
```

### Output

```
✓ Extracted 42 versions
✓ Changelog modified
✓ Commit: "chore: sync changelog for version 2024.11.28.01 [skip ci]"
✓ Pushed to master
```

## 2. Validate (validate.yml)

### When It Runs

- On pull requests modifying `WME-send-to-slack.user.js`
- On push to master
- Manual trigger via "Run workflow"

### What It Checks

```
Pull Request or Push
        ↓
1. _WHATS_NEW_LIST exists?
2. Version format correct? (YYYY.MM.DD.XX)
3. Changelog generates successfully?
4. At least 1 version present?
5. JavaScript syntax valid?
        ↓
All pass → ✅ PR approved
Any fail → ❌ PR blocked
```

### Check Details

| Check | Validates |
|-------|-----------|
| _WHATS_NEW_LIST | Variable exists in script |
| Version Format | YYYY.MM.DD.XX pattern |
| Changelog Generation | Script runs without errors |
| Version Count | At least 1 version found |
| JavaScript Syntax | File is valid JavaScript |

### Example Failure

```
❌ Version format invalid: 2024.11.28
Expected: YYYY.MM.DD.XX (e.g., 2024.11.28.01)
```

## 3. Create Release (create-release.yml)

### When It Runs

- On push when tags matching `v*` are created
- Manual trigger via "Run workflow"

### What It Does

```
git tag -a v2024.11.28.01
git push --tags
        ↓
Workflow detects tag
        ↓
1. Extract version from @version
2. Extract changelog notes
3. Create GitHub release
4. Generate download links
        ↓
Release published on GitHub
```

### Release Content

```markdown
🎉 WME Send to Slack v2024.11.28.01

📝 Changelog
- Add Discord Forum channels support
- Fix missing icons

⬇️ Download
- WME-send-to-slack.user.js (direct link)
```

## Complete Workflow Chain

```
┌──────────────────────────────┐
│ You modify WME-send-to-slack │
│ - Change @version            │
│ - Add to _WHATS_NEW_LIST     │
└────────────┬─────────────────┘
             │
      git add && git commit
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌─────────┐  ┌──────────────┐
  │Local    │  │GitHub Actions│
  ├─────────┤  ├──────────────┤
  │Pre-commit  sync-changelog
  │sync     │  │auto-runs
  └────┬────┘  └────┬─────────┘
       │            │
       └─────┬──────┘
             │
      ┌──────▼─────────┐
      │validate.yml    │
      │- Checks format │
      │- Validates all │
      │✅ Pass → Merge │
      │❌ Fail → Block │
      └────────────────┘
             │
        git push
             │
      ┌──────▼────────────┐
      │Tag v2024.11.28.01 │
      └────────┬──────────┘
               │
      ┌────────▼─────────────┐
      │create-release.yml    │
      │- Create release      │
      │- Auto release notes  │
      │✅ Published on GitHub
      └──────────────────────┘
```

## Running Workflows Manually

### Via GitHub Web UI

1. Go to: https://github.com/tunisiano187/WME-send-to-slack/actions
2. Select workflow
3. Click "Run workflow"
4. Select branch (usually master)
5. Click "Run workflow" button

### Via GitHub CLI

```bash
# List workflows
gh workflow list

# Run specific workflow
gh workflow run sync-changelog.yml

# Run on specific branch
gh workflow run sync-changelog.yml -r master
```

## Workflow Status and Logs

### Check Status

Go to: https://github.com/tunisiano187/WME-send-to-slack/actions

### View Logs

1. Click workflow run
2. Click job name
3. Expand steps to see output

### Example Success Log

```
✅ sync-changelog / Sync changelog (Ubuntu latest)
Run 🚀 Execute synchronization
🔄 Synchronizing changelog...
✅ 42 versions found in JS file
✅ 40 versions found in existing changelog
📝 New versions added (2):
   - 2024.11.28.01
   - 2024.11.27.02
✅ Changelog synchronized successfully

📝 Check changelog changes
✓ Changelog modified - commit required
Detected changes:
 M changelog.md

💾 Commit and push changes
✓ Committed: chore: sync changelog for version 2024.11.28.01 [skip ci]
✓ Pushed to master
```

## Troubleshooting

### Workflow Not Running

**Problem**: Pushed changes but workflow didn't trigger

**Solution**:
1. Check branch (must be master)
2. Verify `WME-send-to-slack.user.js` was included
3. Check workflow file syntax
4. Manually trigger via web UI

### Validation Failed

**Problem**: Validate workflow reports error

**Solution**:
1. Check error message in logs
2. Fix version format (YYYY.MM.DD.XX)
3. Verify _WHATS_NEW_LIST exists
4. Re-push changes

### Release Not Created

**Problem**: Tagged but release not published

**Solution**:
1. Tag must match pattern: `v*` (e.g., v2024.11.28.01)
2. Check create-release.yml logs
3. Verify tag was pushed: `git push --tags`

## Best Practices

✅ **Always use correct version format**: YYYY.MM.DD.XX  
✅ **Include both @version and _WHATS_NEW_LIST entry**  
✅ **Wait for validate workflow to pass before merging**  
✅ **Create tag from master branch for releases**  
✅ **Use semantic commit messages**: "chore:", "feat:", etc.  

## Key Points

- Workflows are **automatically triggered** - no manual action needed
- Changes are **auto-committed** with `[skip ci]` to prevent loops
- Validation **blocks merging** if checks fail
- Releases **auto-populate** from changelog
- All using **GitHub's free tier** - no paid features required

---

**Status**: Complete and tested
**Last Updated**: November 28, 2025
