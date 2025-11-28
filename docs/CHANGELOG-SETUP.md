# Changelog Setup and Usage Guide

## Quick Start

### Installation

The changelog system is pre-configured. No additional setup needed.

### How to Add a New Version

1. **Edit the script file**:
```bash
vim WME-send-to-slack.user.js
```

2. **Update version and changelog**:
```javascript
// @version         2024.11.28.01

const _WHATS_NEW_LIST = Object.freeze({
    '2024.11.28.01': 'New feature added',  // Add your version
    '2024.11.27.01': 'Previous version',
    // ... more versions
});
```

3. **Commit your changes**:
```bash
git add WME-send-to-slack.user.js
git commit -m "Add new feature v2024.11.28.01"
```

The changelog synchronizes automatically!

## Manual Synchronization

```bash
npm run sync-changelog
```

Output:
```
🔄 Synchronizing changelog...
✅ 42 versions found in JS file
✅ 41 versions found in existing changelog
📝 New versions added (1):
   - 2024.11.28.01
✅ Changelog synchronized successfully
```

## Version Format

Format: `YYYY.MM.DD.XX`

Examples:
- `2024.11.28.01` ✅ Correct
- `2024.11.28.1` ❌ Incorrect (missing leading zero)
- `2024/11/28` ❌ Incorrect (wrong separator)

## Changelog File Structure

```markdown
# Changelog - WME Send to Slack

> **Note**: This file is auto-generated from the `_WHATS_NEW_LIST` variable.

---

## [2024.11.28.01] - 2024-11-28

Your feature description

## [2024.11.27.01] - 2024-11-27

Previous version description
```

## Automation Details

### Git Hook (.git/hooks/pre-commit)

Runs before every commit:
1. Checks if `WME-send-to-slack.user.js` was modified
2. Executes `changelog/sync-changelog.js`
3. Auto-adds `changelog.md` to staging if changed
4. Completes the commit

### GitHub Actions Workflows

Three workflows handle cloud automation:

1. **sync-changelog.yml** - Synchronizes on push
2. **validate.yml** - Validates version format
3. **create-release.yml** - Creates GitHub releases

## Troubleshooting

### Changelog not updating after commit

```bash
# Manual trigger
npm run sync-changelog

# Check git hook
ls -la .git/hooks/pre-commit

# Make sure it's executable
chmod +x .git/hooks/pre-commit
```

### Version format invalid

```bash
# Verify current version
grep "@version" WME-send-to-slack.user.js

# Should match: YYYY.MM.DD.XX
# Example: 2024.11.28.01
```

### Changelog.md not generated

```bash
# Check if _WHATS_NEW_LIST exists
grep -n "_WHATS_NEW_LIST" WME-send-to-slack.user.js

# Should show: const _WHATS_NEW_LIST = Object.freeze({
```

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| `sync-changelog.js` | `changelog/` | Extraction script |
| `changelog.md` | Root | Generated changelog |
| `pre-commit` | `.git/hooks/` | Local automation |
| `sync-changelog.yml` | `.github/workflows/` | Cloud automation |

## Advanced Usage

### Skip Git Hook

```bash
git commit --no-verify
# Bypass pre-commit hook
```

### Force Regenerate Changelog

```bash
rm changelog.md
npm run sync-changelog
```

### View Workflow Logs

```bash
# GitHub Actions logs
https://github.com/tunisiano187/WME-send-to-slack/actions
```

---

**Status**: Complete and tested
**Last Updated**: November 28, 2025
