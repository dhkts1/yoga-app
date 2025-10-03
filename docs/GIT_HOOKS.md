# Git Hooks Setup

This document explains the automated code quality enforcement system using Git hooks.

## Overview

The project uses **Husky** and **lint-staged** to automatically enforce code quality standards before commits are allowed.

## What Happens on Commit

Every time you run `git commit`, the following happens automatically:

1. **Pre-commit hook triggers** (`.husky/pre-commit`)
2. **lint-staged runs** on staged files only
3. **ESLint --fix** runs on `*.{js,jsx}` files (auto-fixes issues when possible)
4. **Prettier --write** formats the files
5. **Changes are applied** to staged files
6. **Commit proceeds** if no unfixable errors remain
7. **Commit is blocked** if ESLint errors cannot be auto-fixed

## Benefits

✅ **Zero ESLint errors** - Codebase stays clean at all times
✅ **Consistent formatting** - Prettier runs automatically
✅ **Catch issues early** - Problems found before code review
✅ **Fast** - Only lints/formats files you're committing
✅ **No manual steps** - No need to run `npm run lint` manually

## Configuration

### Husky Hook
**File**: `.husky/pre-commit`
```bash
npx lint-staged
```

### lint-staged Config
**File**: `package.json`
```json
{
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Example Workflow

```bash
# Make changes to files
vim src/components/MyComponent.jsx

# Stage your changes
git add src/components/MyComponent.jsx

# Attempt commit
git commit -m "Add new component"

# Output:
# [STARTED] Running tasks for staged files...
# [STARTED] *.{js,jsx} — 1 file
# [STARTED] eslint --fix
# [COMPLETED] eslint --fix
# [STARTED] prettier --write
# [COMPLETED] prettier --write
# [COMPLETED] *.{js,jsx} — 1 file
# [COMPLETED] Running tasks for staged files...
#
# [main abc1234] Add new component
# 1 file changed, 10 insertions(+)
```

## If ESLint Errors Occur

If ESLint finds errors that can't be auto-fixed:

```bash
git commit -m "My changes"

# Output:
# [STARTED] Running tasks for staged files...
# [FAILED] eslint --fix
#
# Error: /path/to/file.jsx
#   10:5  error  'foo' is not defined  no-undef
#
# ✖ 1 problem (1 error, 0 warnings)
#
# ✖ lint-staged failed due to a git error
```

**What to do:**
1. Fix the error in your code
2. Re-stage the file: `git add path/to/file.jsx`
3. Try committing again

## Bypassing the Hook (NOT RECOMMENDED)

If you absolutely must commit without running the hooks:

```bash
git commit --no-verify -m "Emergency fix"
```

⚠️ **Warning**: Only use `--no-verify` in emergencies. All commits should pass linting.

## Installation

Already installed! But if you need to reinstall:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Then configure `.husky/pre-commit` and `package.json` as shown above.

## Troubleshooting

### Hook not running
```bash
# Ensure hooks are executable
chmod +x .husky/pre-commit

# Verify Git config
git config core.hooksPath
# Should output: .husky
```

### lint-staged not found
```bash
# Reinstall dependencies
npm install
```

### Hooks failing in CI/CD
Husky hooks only run locally. CI/CD should run `npm run lint` separately in the pipeline.

---

**Setup Date**: October 2025
**Dependencies**: husky@^9.1.7, lint-staged@^16.2.3
