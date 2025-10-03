#!/bin/sh
# Documentation update via Claude CLI
# Runs after linting to update docs based on code changes

# Get staged changes
STAGED_DIFF=$(git diff --cached --diff-filter=ACMR)

# Skip if no changes or only doc changes
if [ -z "$STAGED_DIFF" ] || ! echo "$STAGED_DIFF" | grep -qE '\.(js|jsx)$'; then
  exit 0
fi

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
  echo "⚠️  Claude CLI not found - skipping documentation update"
  echo "   Install: npm install -g @anthropic-ai/claude-cli"
  exit 0
fi

# Run Claude to update documentation
echo "📚 Updating documentation based on code changes..."

claude -p "Review the following code changes and update CLAUDE.md and any relevant documentation files if needed. Only update documentation if there are significant changes that affect usage, APIs, or architecture. Be conservative - don't update for minor changes.

Staged changes:
\`\`\`diff
$STAGED_DIFF
\`\`\`

If you make changes to documentation files, stage them automatically with git add."

# Check if any docs were updated
DOC_CHANGES=$(git diff --name-only CLAUDE.md docs/)

if [ -n "$DOC_CHANGES" ]; then
  echo "✅ Documentation updated: $DOC_CHANGES"
  git add CLAUDE.md docs/
else
  echo "ℹ️  No documentation updates needed"
fi

exit 0
