# Changelog Tools

This folder contains scripts and documentation for automatic changelog synchronization.

## Files

### `sync-changelog.js`
Node.js script that synchronizes `changelog.md` (in root) with versions from `_WHATS_NEW_LIST`.

```bash
# Usage
node changelog/sync-changelog.js

# Or via npm
npm run sync-changelog
```

**Path handling:**
- **Source:** `WME-send-to-slack.user.js` (root)
- **Output:** `changelog.md` (root)
- **Documentation:** `changelog/` (tools folder)

## Structure

```
/
├── WME-send-to-slack.user.js    ← Source
├── changelog.md                  ← Generated (in root)
└── changelog/                    ← Tools folder
    ├── sync-changelog.js         ← Script
    └── README.md                 ← Documentation
```

## Workflow

```
WME-send-to-slack.user.js (_WHATS_NEW_LIST)
         ↓
changelog/sync-changelog.js (extraction)
         ↓
changelog.md (generated in root)
```

## Quick Start

### Manual Synchronization
```bash
npm run sync-changelog
```

### Via Git Hook (automatic)
```bash
# Hook runs automatically before each commit
git commit -m "Your modification"
# → changelog/sync-changelog.js runs automatically
```

### Via GitHub Actions (automatic)
- Triggered when you modify `WME-send-to-slack.user.js`
- See `WORKFLOWS-EXPLAINED.md` for details

## Documentation

- **`WORKFLOWS-EXPLAINED.md`** - Complete GitHub Actions workflows
- **`CHANGELOG-SETUP.md`** - Detailed setup guide
- **`CHANGELOG-ORGANIZATION.md`** - Folder structure rationale

---

**Note:** The generated `changelog.md` remains in the project root for better visibility.
