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


## 🎯 Vue d'ensemble

Trois workflows automatisés gèrent complètement le projet:

| Workflow | Déclenchement | Fonction |
|----------|---------------|----------|
| **sync-changelog.yml** | Push sur `WME-send-to-slack.user.js` | Synchronise le changelog |
| **validate.yml** | PR ou Push | Vérifie la version et le format |
| **create-release.yml** | Push sur master ou tag `v*` | Crée une release GitHub |

## 📋 Workflows détaillés

### 1. Sync Changelog (sync-changelog.yml)

**Quand?** Automatiquement quand vous modifiez `WME-send-to-slack.user.js`

**Qu'est-ce qu'il fait?**
- ✅ Exécute `node changelog/sync-changelog.js`
- ✅ Détecte si le changelog a changé
- ✅ Crée automatiquement un commit si nécessaire
- ✅ Pousse les changements sur GitHub

**Exemple:**
```bash
# Vous faites:
git push origin feature/ma-feature

# GitHub Actions fait automatiquement:
1. Détecte la modification de WME-send-to-slack.user.js
2. Exécute changelog/sync-changelog.js
3. Crée un commit: "chore: sync changelog for version 2024.11.28.01 [skip ci]"
4. Pousse le commit
```

**Configuration:**
```yaml
on:
  push:
    paths:
      - 'WME-send-to-slack.user.js'  # Déclenche sur ce fichier
    branches:
      - master
```

### 2. Validate (validate.yml)

**Quand?** 
- À chaque PR qui modifie `WME-send-to-slack.user.js`
- À chaque push sur master
- Manuellement via "Run workflow"

**Qu'est-ce qu'il fait?**
- ✅ Vérifie la présence de `_WHATS_NEW_LIST`
- ✅ Valide le format de la version (YYYY.MM.DD.XX)
- ✅ Exécute la synchronisation du changelog
- ✅ Vérifie qu'au moins 1 version existe
- ✅ Vérifie la syntaxe JavaScript

**Exemple:**
```bash
# Vous créez une PR
git push origin feature/ma-feature

# GitHub Actions teste:
✓ _WHATS_NEW_LIST existe
✓ Version: 2024.11.28.01 (format valide)
✓ Changelog généré avec succès
✓ 42 versions trouvées
✓ Syntaxe JavaScript valide
```

**Si une vérification échoue:**
```
❌ Format de version invalide: 2024.11.28
Format attendu: YYYY.MM.DD.XX (ex: 2024.11.28.01)
```

### 3. Create Release (create-release.yml)

**Quand?** 
- Automatiquement quand vous créez un tag `v*`
- Ou manuellement via "Run workflow"

**Qu'est-ce qu'il fait?**
- ✅ Extrait la version depuis le fichier JS
- ✅ Crée un tag GitHub
- ✅ Crée une release GitHub
- ✅ Remplissage automatique des notes de release depuis changelog.md
- ✅ Génère des liens de téléchargement

**Exemple:**
```bash
# Vous créez un tag
git tag -a v2024.11.28.01 -m "Release 2024.11.28.01"
git push origin v2024.11.28.01

# GitHub Actions crée automatiquement:
1. Release GitHub avec titre "Release 2024.11.28.01"
2. Notes de release extraites du changelog
3. Lien de téléchargement
4. Page de release visible sur GitHub
```

**Sortie esperée:**
```markdown
🎉 WME Send to Slack v2024.11.28.01

📝 Changelog
- Add Discord Forum channels support

Téléchargement directe:
- WME-send-to-slack.user.js
```

## 🔄 Flux complet automatisé

```
┌─────────────────────────────────────────────────────┐
│              Vous modifiez le script                 │
│   1. Changez @version dans le header                │
│   2. Ajoutez dans _WHATS_NEW_LIST                   │
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
│ Déclenché: Push sur fichier  │      │ Déclenché: PR ou Push        │
│                              │      │                              │
│ 1. Exécute sync-changelog.js │      │ 1. Vérifie _WHATS_NEW_LIST  │
│ 2. Détecte si changement     │      │ 2. Valide la version        │
│ 3. Crée commit si nécessaire │      │ 3. Exécute sync-changelog   │
│ 4. Pousse le commit          │      │ 4. Vérifie au moins 1 version
│ 5. ✅ Changelog à jour       │      │ 5. ✓ Validations réussies   │
└──────────────────────────────┘      └──────────────────────────────┘
        │                                           
        │ (Si tout est à jour)                      
        │                                           
        ▼                                           
┌──────────────────────────────┐                    
│  Prêt pour la release        │                    
│  (Optionnel)                 │                    
└─────────────┬────────────────┘                    
              │                                     
        Vous créez un tag:                          
        git tag -a v2024.11.28.01                   
        git push origin v2024.11.28.01              
              │                                     
              ▼                                     
      ┌──────────────────────────┐                  
      │ create-release.yml       │                  
      ├──────────────────────────┤                  
      │ 1. Extrait la version    │                  
      │ 2. Crée le tag           │                  
      │ 3. Crée la release       │                  
      │ 4. Notes du changelog    │                  
      │ 5. ✓ Release créée       │                  
      └──────────────────────────┘                  
              │                                     
              ▼                                     
      ✅ Release visible sur GitHub                 
         + notes de release                        
         + lien de téléchargement                  
```

## ⚡ Utilisation rapide

### Pour ajouter une version

```bash
# 1. Modifier le script
vim WME-send-to-slack.user.js
# Changez @version et _WHATS_NEW_LIST

# 2. Committer et pusher
git add WME-send-to-slack.user.js
git commit -m "Nouvelle fonctionnalité v2024.11.28.01"
git push

# 3. GitHub Actions fait automatiquement:
#    - Synchronise le changelog
#    - Crée un commit automatique
#    - Pousse le changelog
# ✅ C'est fait!
```

### Pour créer une release

```bash
# Option 1: Avec tag
git tag -a v2024.11.28.01 -m "Release 2024.11.28.01"
git push origin v2024.11.28.01
# GitHub Actions crée automatiquement la release

# Option 2: Via GitHub (Web UI)
# 1. Allez à: github.com/tunisiano187/WME-send-to-slack/releases
# 2. Cliquez "Create a new release"
# 3. Tag: v2024.11.28.01
# 4. Titre: Release 2024.11.28.01
# 5. Description: (auto-remplie depuis le changelog)
# 6. Publish
```

## 🔔 Notifications et statuts

### En cas de succès
```
✅ All checks passed
   ✓ validate / validate (Ubuntu latest)
   ✓ sync-changelog / sync-changelog (Ubuntu latest)
```

### En cas d'erreur
```
❌ Failure
   ❌ validate / validate
      Version invalide: 2024.11.28
      Format attendu: YYYY.MM.DD.XX
```

## 📊 Bénéfices

✅ **Complètement automatique** - Rien à faire manuellement  
✅ **Validation** - Vérifie que tout est correct  
✅ **Changelog** - Toujours à jour  
✅ **Releases** - Créées automatiquement  
✅ **Sans intervention** - GitHub fait le travail  

## 🎯 Workflow idéal

```
Jour 1:
  └─ Vous modifiez le code

Jour 2:
  ├─ git push
  └─ GitHub Actions synchronise tout automatiquement

Jour 3:
  ├─ git tag v2024.11.28.01
  ├─ git push --tags
  └─ GitHub Actions crée la release

Résultat:
  ✅ Changelog à jour
  ✅ Release créée
  ✅ Notes de release
  ✅ Lien de téléchargement
```

## ⚙️ Configuration

### Voir les workflows
```bash
# Workflows activés
ls -la .github/workflows/

# Résultats des workflows
Allez à: https://github.com/tunisiano187/WME-send-to-slack/actions
```

### Modifier les workflows

Les fichiers sont dans: `.github/workflows/`

```
.github/workflows/
├── sync-changelog.yml     (Synchronisation)
├── validate.yml           (Vérifications)
└── create-release.yml     (Releases)
```

## 🔐 Permissions

Les workflows ont besoin:
- ✅ `contents: write` pour créer des commits et releases
- ✅ `GITHUB_TOKEN` (automatiquement fourni par GitHub)

## 📞 Dépannage

### Le workflow ne s'exécute pas

**Problème:** Push sur `WME-send-to-slack.user.js` mais pas d'action

**Solution:**
1. Vérifiez que vous avez pushé sur `master` (pas une branche)
2. Vérifiez les actions: https://github.com/tunisiano187/WME-send-to-slack/actions
3. Cliquez sur le workflow pour voir les logs

### Validation échoue

**Erreur:** Version invalide

**Solution:**
```bash
# Vérifiez le format: YYYY.MM.DD.XX
grep "@version" WME-send-to-slack.user.js

# Correct:   // @version         2024.11.28.01
# Incorrect: // @version         2024.11.28
```

### Changelog non synchronisé

**Problème:** Changelog.md n'a pas changé après le push

**Solution:**
1. Vérifiez que le fichier `changelog/sync-changelog.js` existe
2. Vérifiez les logs du workflow
3. Exécutez manuellement: `npm run sync-changelog`

## 🎉 Résultat final

**Vous faites:**
1. ✏️ Modifier le code
2. 📝 Ajouter une version
3. 💾 Commit et push

**GitHub fait:**
1. ✅ Synchronise le changelog
2. ✅ Valide tout
3. ✅ Crée le commit
4. ✅ (Optionnel) Crée la release

**Résultat:**
- ✨ Changelog toujours à jour
- 🏷️ Releases automatiques
- 📊 Notes de release
- 🚀 Déploiement simplifié

---

**Version**: 1.0  
**Date**: 28 novembre 2025  
**Statut**: ✅ Complet et automatisé
