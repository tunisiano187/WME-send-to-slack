#!/usr/bin/env node

/**
 * Sync Changelog Script
 * Cette script synchronise automatiquement le changelog.md avec les versions
 * provenant de la variable _WHATS_NEW_LIST dans le fichier WME-send-to-slack.user.js
 * 
 * Utilisation :
 * - Première exécution : initialise le changelog avec toutes les versions de _WHATS_NEW_LIST
 * - Exécutions suivantes : ajoute les nouvelles versions détectées
 */

const fs = require('node:fs');
const path = require('node:path');

// Chemin des fichiers (changelog.md reste à la racine)
const jsFilePath = path.join(__dirname, '..', 'WME-send-to-slack.user.js');
const changelogPath = path.join(__dirname, '..', 'changelog.md');

/**
 * Fonction de comparaison pour trier les versions alphabétiquement
 * Utilise String.localeCompare pour un tri fiable et multi-locale
 * @param {string} a - Première version
 * @param {string} b - Deuxième version
 * @returns {number} Résultat de la comparaison
 */
function compareVersions(a, b) {
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'variant' });
}

/**
 * Extrait les versions et descriptions de _WHATS_NEW_LIST
 * @returns {Object} Objet avec les versions comme clés et descriptions comme valeurs
 */
function extractVersionsFromJS() {
  try {
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
    
    // Regex pour extraire le contenu de _WHATS_NEW_LIST
    // Cherche _WHATS_NEW_LIST = Object.freeze({ ... })
    const whatsNewRegex = /const\s+_WHATS_NEW_LIST\s*=\s*Object\.freeze\(\s*\{([\s\S]*?)\}\s*\);/;
    const whatsNewMatch = whatsNewRegex.exec(jsContent);
    
    if (!whatsNewMatch) {
      console.error('❌ Impossible de trouver _WHATS_NEW_LIST dans le fichier JS');
      return {};
    }
    
    const whatsNewContent = whatsNewMatch[1];
    
    // Regex pour extraire chaque entrée version: 'description'
    // Format: '2024.11.27.01': 'Fixed missing update request icons...'
    const versionRegex = /'([^']+)':\s*'([^']*(?:\\[\s\S][^']*)*)'(?=\s*[,}])/g;
    
    const versions = {};
    let versionMatch;
    
    while ((versionMatch = versionRegex.exec(whatsNewContent)) !== null) {
      const version = versionMatch[1];
      let description = versionMatch[2];
      
      // Decode escaped characters
      description = description
        .replaceAll(String.raw`\n`, '\n')
        .replaceAll(String.raw`\r`, '\r')
        .replaceAll(String.raw`\/`, '/')
        .replaceAll(String.raw`\'`, "'")
        .replaceAll(String.raw`\\`, '\\');
      
      versions[version] = description;
    }
    
    return versions;
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du fichier JS:', error.message);
    return {};
  }
}

/**
 * Parse le changelog.md pour récupérer les versions existantes
 * @returns {Object} Objet avec les versions existantes
 */
function parseExistingChangelog() {
  try {
    if (!fs.existsSync(changelogPath)) {
      return {};
    }
    
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    // Regex pour extraire les entrées du changelog
    // Format : ## [Version] - Description
    const versionRegex = /^##\s+\[([^\]]+)\]\s*-\s*(.*)$/gm;
    
    const versions = {};
    let match;
    
    while ((match = versionRegex.exec(changelogContent)) !== null) {
      versions[match[1]] = match[2].trim();
    }
    
    return versions;
  } catch (error) {
    console.error('⚠️  Erreur lors de la lecture du changelog:', error.message);
    return {};
  }
}

/**
 * Génère le contenu du changelog avec le header et toutes les versions
 * @param {Object} versions Objet avec les versions à ajouter au changelog
 * @returns {string} Contenu du changelog formaté
 */
function generateChangelogContent(versions) {
  // Header du changelog
  let content = `# Changelog - WME Send to Slack

Toutes les versions et modifications du script WME Send to Slack.

> **Note** : Ce fichier est généré automatiquement à partir de la variable \`_WHATS_NEW_LIST\` du script.

---

`;

  // Ajouter les versions triées par date (plus récente en premier)
  const sortedVersions = Object.keys(versions)
    .sort(compareVersions);
  
  for (const version of sortedVersions) {
    const description = versions[version];
    
    // Formater la date de la version (YYYY.MM.DD.XX -> YYYY-MM-DD)
    const dateMatch = /^(\d{4})\.(\d{2})\.(\d{2})/.exec(version);
    let dateStr = version;
    if (dateMatch) {
      dateStr = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    }
    
    // Ajouter l'entrée du changelog
    content += `## [${version}] - ${dateStr}\n`;
    content += `\n${description}\n\n`;
  }

  return content;
}

/**
 * Synchronise le changelog avec les versions du fichier JS
 */
function syncChangelog() {
  console.log('🔄 Synchronisation du changelog en cours...\n');
  
  // Extraire les versions du fichier JS
  const jsVersions = extractVersionsFromJS();
  
  if (Object.keys(jsVersions).length === 0) {
    console.error('❌ Aucune version trouvée dans _WHATS_NEW_LIST');
    process.exit(1);
  }
  
  console.log(`✅ ${Object.keys(jsVersions).length} versions trouvées dans le fichier JS`);
  
  // Parser le changelog existant
  const existingVersions = parseExistingChangelog();
  console.log(`✅ ${Object.keys(existingVersions).length} versions trouvées dans le changelog existant`);
  
  // Fusionner les versions (JS prime)
  const allVersions = { ...existingVersions, ...jsVersions };
  
  // Générer le nouveau contenu du changelog
  const newContent = generateChangelogContent(allVersions);
  
  // Écrire le nouveau changelog
  try {
    fs.writeFileSync(changelogPath, newContent, 'utf8');
    console.log(`✅ Changelog synchronisé avec succès: ${changelogPath}`);
    
    // Afficher les versions ajoutées
    const addedVersions = Object.keys(jsVersions).filter(
      v => !existingVersions.hasOwnProperty(v)
    );
    
    if (addedVersions.length > 0) {
      console.log(`\n📝 Nouvelles versions ajoutées (${addedVersions.length}):`);
      addedVersions.forEach(v => {
        console.log(`   - ${v}`);
      });
    } else {
      console.log('\nℹ️  Aucune nouvelle version détectée');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'écriture du changelog:', error.message);
    process.exit(1);
  }
}

// Lancer la synchronisation
syncChangelog();
