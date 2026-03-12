# Changelog Management

Automatic changelog synchronization system for WME Send to Slack.

## Quick Reference

### File Structure

```
/
├── changelog.md                ← Generated changelog (in root)
├── WME-send-to-slack.user.js  ← Main script
└── changelog/                  ← Changelog tools
    ├── sync-changelog.js       ← Synchronization script
    ├── GITHUB-ACTIONS.md       ← Workflow documentation
    └── README.md               ← Folder guide
```

### Essential Files

- **changelog.md** - Auto-generated (always in root)
- **changelog/sync-changelog.js** - Extraction and sync script
- **package.json** - npm scripts configuration
- **.git/hooks/pre-commit** - Local automation
- **.github/workflows/** - Cloud automation

## How to Use

### Manual Synchronization

```bash
npm run sync-changelog
```

### Automatic (Git Hook)

```bash
git commit -m "Your message"
# → Pre-commit hook runs automatically
```

### Automatic (GitHub Actions)

Push changes to trigger:
- Changelog synchronization
- Validation checks
- Release creation (optional)

## Adding a New Version

### 1. Update the Script

```bash
vim WME-send-to-slack.user.js
```

### 2. Modify Version and Changelog

```javascript
// @version         2024.11.28.01

const _WHATS_NEW_LIST = Object.freeze({
    '2024.11.28.01': 'Your feature description',
    '2024.11.27.01': 'Previous version',
    // ... more versions
});
```

### 3. Commit

```bash
git add WME-send-to-slack.user.js
git commit -m "Add new feature"
# → Changelog syncs automatically!
```

## Version Format

**Required format:** `YYYY.MM.DD.XX`

- ✅ `2024.11.28.01` - Correct
- ❌ `2024.11.28.1` - Incorrect (missing zero)
- ❌ `2024/11/28` - Incorrect (wrong separator)

## Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Setup Guide | `docs/CHANGELOG-SETUP.md` | Detailed setup instructions |
| Workflows | `docs/WORKFLOWS-EXPLAINED.md` | GitHub Actions explained |
| Organization | `docs/CHANGELOG-ORGANIZATION.md` | Folder structure |
| Changelog Guide | `changelog/README.md` | Changelog folder info |
| Workflow Guide | `changelog/GITHUB-ACTIONS.md` | Workflow reference |

## Key Points

✅ **Automatic** - No manual intervention needed  
✅ **Validated** - Format checks on every commit  
✅ **Multi-level** - Local hooks + cloud workflows  
✅ **Clean** - Only generated files in root  
✅ **Organized** - Tools in `changelog/` folder  

## Automation Overview

```
You write code
   ↓
git commit
   ↓
Pre-commit hook
   ↓
changelog/sync-changelog.js
   ↓
changelog.md updated
   ↓
git push
   ↓
GitHub Actions
   ├─ sync-changelog.yml (sync)
   ├─ validate.yml (verify)
   └─ create-release.yml (release)
   ↓
✅ Complete and automated!
```

## Troubleshooting

### Changelog not updating

```bash
# Manual trigger
npm run sync-changelog

# Make pre-commit executable
chmod +x .git/hooks/pre-commit
```

### Invalid version format

```bash
# Current version check
grep "@version" WME-send-to-slack.user.js

# Should be: YYYY.MM.DD.XX
# Example: 2024.11.28.01
```

### Workflow issues

Check logs: https://github.com/tunisiano187/WME-send-to-slack/actions

## Next Steps

1. **Read Setup Guide** → `docs/CHANGELOG-SETUP.md`
2. **Understand Workflows** → `docs/WORKFLOWS-EXPLAINED.md`
3. **Add Your Version** → Follow "Adding a New Version" above
4. **Commit and Push** → Everything syncs automatically!

---

**Status**: Complete and functional
**Last Updated**: November 28, 2025
**Language**: English (for multi-developer team)
