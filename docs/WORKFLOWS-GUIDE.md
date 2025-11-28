# GitHub Actions Workflows

Complete automation of the project via GitHub Actions.

## Overview

Three automated workflows manage the project completely:

| Workflow | Trigger | Function |
|----------|---------|----------|
| **sync-changelog.yml** | Push to `WME-send-to-slack.user.js` | Synchronizes changelog |
| **validate.yml** | PR or Push | Verifies version and format |
| **create-release.yml** | Push to master or tag `v*` | Creates GitHub release |

## Detailed Workflows

### 1. Sync Changelog (sync-changelog.yml)

**When?** Automatically when you modify `WME-send-to-slack.user.js`

**What does it do?**
- ✅ Executes `node changelog/sync-changelog.js`
- ✅ Detects if changelog has changed
- ✅ Automatically creates a commit if needed
- ✅ Pushes changes to GitHub

**Example:**
```bash
# You do:
git push origin feature/my-feature

# GitHub Actions automatically does:
1. Detects modification of WME-send-to-slack.user.js
2. Executes changelog/sync-changelog.js
3. Creates commit: "chore: sync changelog for version 2024.11.28.01 [skip ci]"
4. Pushes the commit
```

**Configuration:**
```yaml
on:
  push:
    paths:
      - 'WME-send-to-slack.user.js'  # Triggers on this file
    branches:
      - master
```

### 2. Validate (validate.yml)

**When?** 
- On every PR modifying `WME-send-to-slack.user.js`
- On every push to master
- Manually via "Run workflow"

**What does it do?**
- ✅ Verifies `_WHATS_NEW_LIST` presence
- ✅ Validates version format (YYYY.MM.DD.XX)
- ✅ Executes changelog synchronization
- ✅ Verifies at least 1 version exists
- ✅ Verifies JavaScript syntax

**Example:**
```bash
# You create a PR
git push origin feature/my-feature

# GitHub Actions tests:
✓ _WHATS_NEW_LIST exists
✓ Version: 2024.11.28.01 (valid format)
✓ Changelog generated successfully
✓ 42 versions found
✓ JavaScript syntax valid
```

**If a check fails:**
```
❌ Invalid version format: 2024.11.28
Expected format: YYYY.MM.DD.XX (e.g., 2024.11.28.01)
```

### 3. Create Release (create-release.yml)

**When?** 
- Automatically when you create a tag `v*`
- Or manually via "Run workflow"

**What does it do?**
- ✅ Extracts version from the JS file
- ✅ Creates a GitHub tag
- ✅ Creates a GitHub release
- ✅ Auto-populates release notes from changelog.md
- ✅ Generates download links

**Example:**
```bash
# You create a tag
git tag -a v2024.11.28.01 -m "Release 2024.11.28.01"
git push origin v2024.11.28.01

# GitHub Actions automatically creates:
1. GitHub release with title "Release 2024.11.28.01"
2. Release notes extracted from changelog
3. Download link
4. Release page visible on GitHub
```

**Expected output:**
```markdown
🎉 WME Send to Slack v2024.11.28.01

📝 Changelog
- Add Discord Forum channels support

Direct Download:
- WME-send-to-slack.user.js
```

## Complete Automated Workflow

```
┌─────────────────────────────────────────────────────┐
│              You modify the script                   │
│   1. Change @version in header                      │
│   2. Add to _WHATS_NEW_LIST                         │
│   3. git add WME-send-to-slack.user.js              │
│   4. git commit -m "Description"                    │
│   5. git push                                       │
└─────────────────────────────┬───────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────────────────┐      ┌──────────────────────────────┐
│  sync-changelog.yml          │      │  validate.yml (PR/Push)      │
├──────────────────────────────┤      ├──────────────────────────────┤
│ Triggered: Push on file      │      │ Triggered: PR or Push        │
│                              │      │                              │
│ 1. Execute sync-changelog.js │      │ 1. Check _WHATS_NEW_LIST    │
│ 2. Detect if changed         │      │ 2. Validate version         │
│ 3. Create commit if needed   │      │ 3. Execute sync-changelog   │
│ 4. Push the commit           │      │ 4. Check at least 1 version │
│ 5. ✅ Changelog updated      │      │ 5. ✓ Validations passed     │
└──────────────────────────────┘      └──────────────────────────────┘
        │                                           
        │ (If everything is up to date)            
        │                                           
        ▼                                           
┌──────────────────────────────┐                    
│  Ready for release           │                    
│  (Optional)                  │                    
└─────────────┬────────────────┘                    
              │                                     
        You create a tag:                           
        git tag -a v2024.11.28.01                   
        git push origin v2024.11.28.01              
              │                                     
              ▼                                     
      ┌──────────────────────────┐                  
      │ create-release.yml       │                  
      ├──────────────────────────┤                  
      │ 1. Extract version       │                  
      │ 2. Create tag            │                  
      │ 3. Create release        │                  
      │ 4. Changelog notes       │                  
      │ 5. ✓ Release created     │                  
      └──────────────────────────┘                  
              │                                     
              ▼                                     
      ✅ Release visible on GitHub                 
         + release notes                           
         + download link                          
```

## Quick Usage

### To add a version

```bash
# 1. Modify the script
vim WME-send-to-slack.user.js
# Change @version and _WHATS_NEW_LIST

# 2. Commit and push
git add WME-send-to-slack.user.js
git commit -m "New feature v2024.11.28.01"
git push

# 3. GitHub Actions automatically:
#    - Synchronizes changelog
#    - Creates auto commit
#    - Pushes changelog
# ✅ Done!
```

### To create a release

```bash
# Option 1: With tag
git tag -a v2024.11.28.01 -m "Release 2024.11.28.01"
git push origin v2024.11.28.01
# GitHub Actions automatically creates the release

# Option 2: Via GitHub (Web UI)
# 1. Go to: github.com/tunisiano187/WME-send-to-slack/releases
# 2. Click "Create a new release"
# 3. Tag: v2024.11.28.01
# 4. Title: Release 2024.11.28.01
# 5. Description: (auto-populated from changelog)
# 6. Publish
```

## Notifications and Status

### On Success
```
✅ All checks passed
   ✓ validate / validate (Ubuntu latest)
   ✓ sync-changelog / sync-changelog (Ubuntu latest)
```

### On Failure
```
❌ Failure
   ❌ validate / validate
      Invalid version: 2024.11.28
      Expected format: YYYY.MM.DD.XX
```

## Benefits

✅ **Completely automatic** - Nothing to do manually  
✅ **Validation** - Verifies everything is correct  
✅ **Changelog** - Always up to date  
✅ **Releases** - Created automatically  
✅ **No intervention** - GitHub does the work  

## Ideal Workflow

```
Day 1:
  └─ You modify the code

Day 2:
  ├─ git push
  └─ GitHub Actions syncs everything automatically

Day 3:
  ├─ git tag v2024.11.28.01
  ├─ git push --tags
  └─ GitHub Actions creates the release

Result:
  ✅ Changelog up to date
  ✅ Release created
  ✅ Release notes
  ✅ Download link
```

## Configuration

### View Workflows
```bash
# Enabled workflows
ls -la .github/workflows/

# Workflow results
Go to: https://github.com/tunisiano187/WME-send-to-slack/actions
```

### Modify Workflows

Files are in: `.github/workflows/`

```
.github/workflows/
├── sync-changelog.yml     (Synchronization)
├── validate.yml           (Verifications)
└── create-release.yml     (Releases)
```

## Permissions

Workflows require:
- ✅ `contents: write` to create commits and releases
- ✅ `GITHUB_TOKEN` (automatically provided by GitHub)

## Troubleshooting

### Workflow not running

**Problem:** Push to `WME-send-to-slack.user.js` but no action

**Solution:**
1. Verify you pushed to `master` (not a branch)
2. Check actions: https://github.com/tunisiano187/WME-send-to-slack/actions
3. Click workflow to see logs

### Validation fails

**Error:** Invalid version

**Solution:**
```bash
# Verify format: YYYY.MM.DD.XX
grep "@version" WME-send-to-slack.user.js

# Correct:   // @version         2024.11.28.01
# Incorrect: // @version         2024.11.28
```

### Changelog not synchronized

**Problem:** Changelog.md didn't change after push

**Solution:**
1. Verify `changelog/sync-changelog.js` exists
2. Check workflow logs
3. Run manually: `npm run sync-changelog`

## Final Result

**You do:**
1. ✏️ Modify code
2. 📝 Add version
3. 💾 Commit and push

**GitHub does:**
1. ✅ Syncs changelog
2. ✅ Validates everything
3. ✅ Creates commit
4. ✅ (Optional) Creates release

**Result:**
- ✨ Changelog always up to date
- 🏷️ Automatic releases
- 📊 Release notes
- 🚀 Simplified deployment

---

**Version**: 1.0  
**Date**: November 28, 2025  
**Status**: ✅ Complete and automated
