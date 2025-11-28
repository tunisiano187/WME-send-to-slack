#!/bin/bash
# Cleanup script - removes all temporary files that are no longer needed

echo "🗑️  Nettoyage final des scripts temporaires"
echo "==========================================="
echo ""

cd /workspaces/WME-send-to-slack

# Remove the cleanup script itself at the end
echo "Fichiers à supprimer:"
echo "- final-cleanup.sh"
echo "- changelog/README.md"
echo "- changelog/GITHUB-ACTIONS.md"
echo ""

# List current files
echo "Fichiers actuels dans changelog/:"
ls -1 changelog/

echo ""
echo "Exécute les commandes suivantes:"
echo "git rm -f final-cleanup.sh"
echo "git rm -f changelog/README.md"
echo "git rm -f changelog/GITHUB-ACTIONS.md"
echo "git rm -f cleanup.sh"
echo ""
echo "Puis commit:"
echo "git add -A"
echo "git commit -m 'chore: remove temporary cleanup scripts and redundant documentation'"
