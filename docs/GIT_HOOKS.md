# Git Hooks Setup

This document explains the automated code quality enforcement system using Git hooks.

## Overview

The project uses **Husky** and **lint-staged** to automatically enforce code quality standards before commits are allowed.

## What Happens on Commit

Every time you run `git commit`, the following happens automatically:

1. **Pre-commit hook triggers** (`.husky/pre-commit`)
2. **lint-staged runs** on staged files only
   - **ESLint --fix** runs on `*.{js,jsx}` files (auto-fixes issues when possible)
   - **Prettier --write** formats the files
   - **Changes are applied** to staged files
3. **Tests run** - All unit/integration tests execute (`npm test`)
4. **Commit proceeds** if all checks pass
5. **Commit is blocked** if:
   - ESLint errors cannot be auto-fixed
   - Tests fail

## Benefits

✅ **Zero ESLint errors** - Codebase stays clean at all times
✅ **Consistent formatting** - Prettier runs automatically
✅ **All tests pass** - No broken code reaches the repo
✅ **Catch issues early** - Problems found before code review
✅ **Fast** - Only lints/formats files you're committing
✅ **No manual steps** - Everything runs automatically

## Configuration

### Husky Hook
**File**: `.husky/pre-commit`
```bash
#!/bin/sh

# 1. Lint and format staged files
echo "🔍 Running ESLint and Prettier..."
npx lint-staged

# 2. Run tests (only show failures)
echo "🧪 Running tests..."
npm test -- --run --reporter=dot --silent
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
# 🔍 Running ESLint and Prettier...
# [STARTED] Running tasks for staged files...
# [STARTED] *.{js,jsx} — 1 file
# [STARTED] eslint --fix
# [COMPLETED] eslint --fix
# [STARTED] prettier --write
# [COMPLETED] prettier --write
# [COMPLETED] *.{js,jsx} — 1 file
# [COMPLETED] Running tasks for staged files...
#
# 🧪 Running tests...
# .................
# Test Files  16 passed (16)
#      Tests  374 passed (374)
#
# [main abc1234] Add new component
# 1 file changed, 25 insertions(+)
```

## Common Issues

### If ESLint Errors Occur

If ESLint finds errors that can't be auto-fixed:

```bash
git commit -m "My changes"

# Output:
# 🔍 Running ESLint and Prettier...
# [FAILED] eslint --fix
#
# Error: /path/to/file.jsx
#   10:5  error  'foo' is not defined  no-undef
#
# ✖ 1 problem (1 error, 0 warnings)
```

**What to do:**
1. Fix the error in your code
2. Re-stage the file: `git add path/to/file.jsx`
3. Try committing again

### If Tests Fail

If tests fail during the pre-commit hook:

```bash
git commit -m "My changes"

# Output:
# 🔍 Running ESLint and Prettier...
# ✓ Linting passed
#
# 🧪 Running tests...
# ✗ Test failed: should render correctly
#   Expected: true
#   Received: false
#
# ✖ Commit blocked - fix failing tests
```

**What to do:**
1. Fix the failing test(s)
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

### Tests failing in hook but passing normally
```bash
# The hook runs tests with --run flag to prevent watch mode
# Make sure your tests work in CI mode:
npm test -- --run
```

### Hooks failing in CI/CD
Husky hooks only run locally. CI/CD should run these commands separately:
```bash
npm run lint
npm test
```

---

**Setup Date**: October 2025
**Dependencies**:
- husky@^9.1.7
- lint-staged@^16.2.3
