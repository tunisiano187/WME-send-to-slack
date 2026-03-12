#!/bin/bash

# Delete redundant markdown files from changelog folder
# Since all documentation is now in docs/, remove duplicates

echo "🗑️ Removing redundant markdown files from changelog/"
echo "=================================================="

cd /workspaces/WME-send-to-slack

# Remove files using git to properly track deletion
if [[ -f "changelog/README.md" ]]; then
  git rm changelog/README.md
  echo "✓ Deleted: changelog/README.md"
fi

if [[ -f "changelog/GITHUB-ACTIONS.md" ]]; then
  git rm changelog/GITHUB-ACTIONS.md
  echo "✓ Deleted: changelog/GITHUB-ACTIONS.md"
fi

echo ""
echo "✅ Cleanup complete!"
echo "Remaining files in changelog/:"
ls -la changelog/

echo ""
echo "📁 docs/ now contains all documentation:"
ls -la docs/ | grep -E "\.md$"

echo ""
echo "📋 Next step: git add -A && git commit -m 'chore: remove redundant docs from changelog folder'"
