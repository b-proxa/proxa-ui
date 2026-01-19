#!/bin/bash

# Simple deploy script to merge Claude's branch to main
# Usage: ./deploy.sh

set -e  # Exit on any error

CLAUDE_BRANCH="claude/clarify-product-nXr7g"

echo "🚀 Deploying to main..."
echo ""

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Switch to main and update
echo "🔄 Switching to main..."
git checkout main
git pull origin main

# Merge Claude's branch
echo "🔀 Merging $CLAUDE_BRANCH..."
git merge origin/$CLAUDE_BRANCH --no-edit

# Push to main
echo "📤 Pushing to main..."
git push origin main

echo ""
echo "✅ Deployed to main! Vercel will deploy in ~60 seconds."
echo "   View at: https://proxa-ui.vercel.app"
