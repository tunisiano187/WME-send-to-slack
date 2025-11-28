# Changelog Organization Guide

## Overview

This document explains the project's changelog organization structure.

### Main Components

**Root Level (Essential Files)**
- `changelog.md` - Generated changelog (always in root)
- `WME-send-to-slack.user.js` - Main UserScript
- `README.md` - Main project documentation
- `package.json` - npm configuration
- Other essential project files

**Organized in Subdirectories**
- `changelog/` - Changelog management tools
- `.github/workflows/` - GitHub Actions automation
- `public/` - Static resources
- `docs/` - Additional documentation (this folder)

### changelog/ Directory

Contains all changelog-related tooling:

```
changelog/
├── sync-changelog.js     - Version extraction and synchronization script
├── GITHUB-ACTIONS.md     - GitHub Actions workflow documentation
└── README.md             - Changelog folder guide
```

## How It Works

### 1. Manual Synchronization

```bash
npm run sync-changelog
# Executes: node changelog/sync-changelog.js
```

### 2. Automatic (Git Hook)

```bash
git commit -m "Your message"
# Pre-commit hook automatically runs sync-changelog.js
```

### 3. Automatic (GitHub Actions)

Triggered when:
- Changes pushed to `WME-send-to-slack.user.js`
- Pull requests created
- Tags are pushed

## Configuration Updates

All configuration files point to the new path:
- `package.json` - npm scripts
- `.git/hooks/pre-commit` - Git hook
- `.github/workflows/*.yml` - GitHub Actions

### Path References
```bash
node changelog/sync-changelog.js
```

## Key Points

✅ `changelog.md` remains in root (visible and important)  
✅ All tools organized in `changelog/`  
✅ Fully automated synchronization  
✅ Works locally and in cloud  

## Additional Documentation

See `docs/` folder for more detailed guides:
- `CHANGELOG-SETUP.md` - Detailed setup guide
- `WORKFLOWS-EXPLAINED.md` - GitHub Actions workflows explained
- Migration guides and best practices

---

**Status**: Complete and functional
**Last Updated**: November 28, 2025
