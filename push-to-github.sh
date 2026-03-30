#!/bin/bash
# ============================================================
# AI Job Assistant — One-Click GitHub Push Script
# ============================================================
# Run this once from your terminal:
#   chmod +x push-to-github.sh && ./push-to-github.sh
# ============================================================

set -e

REPO_URL="https://github.com/oopsankit/ai-job-assistant.git"

echo ""
echo "🚀 AI Job Assistant — Pushing to GitHub"
echo "========================================"
echo ""

# Check git is installed
if ! command -v git &>/dev/null; then
  echo "❌ git is not installed. Install it from https://git-scm.com"
  exit 1
fi

# Add remote if not already set
if git remote get-url origin &>/dev/null; then
  echo "ℹ️  Remote 'origin' already set: $(git remote get-url origin)"
else
  git remote add origin "$REPO_URL"
  echo "✅ Remote added: $REPO_URL"
fi

echo ""
echo "📦 Pushing all branches to GitHub..."
echo ""

# Push main branch
git push -u origin main
echo "✅ main branch pushed"

# Push dev branch
git push -u origin dev
echo "✅ dev branch pushed"

# Push all feature branches
for branch in feature/authentication feature/ai-resume-generator feature/job-dashboard feature/application-tracker feature/stripe-whatsapp feature/admin-dashboard; do
  if git show-ref --verify --quiet refs/heads/$branch; then
    git push -u origin "$branch"
    echo "✅ $branch pushed"
  fi
done

echo ""
echo "========================================"
echo "🎉 All done! Your repo is live at:"
echo "   $REPO_URL"
echo ""
echo "Next steps:"
echo "  1. Go to https://vercel.com/new"
echo "  2. Import the 'ai-job-assistant' repo"
echo "  3. Add your environment variables"
echo "  4. Click Deploy!"
echo "========================================"
