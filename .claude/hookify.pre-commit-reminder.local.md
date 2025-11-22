---
name: remind-pre-commit-checks
enabled: true
event: stop
pattern: .*
---

**Pre-Commit Checklist Reminder**

Before wrapping up, verify these items per CLAUDE.md:

**Required Checks:**
- [ ] Run `npm test -- --run` (unit tests)
- [ ] Run `npm run lint` (ESLint + Tailwind)
- [ ] Run `npm run build` (production build)

**If E2E tests were affected:**
- [ ] Run `npm run test:e2e -- --last-failed` (rerun failed E2E tests)

**Git Hook Note:**
The pre-commit hook will automatically run ESLint + Prettier + Tests on commit.
However, running tests manually first helps catch issues earlier.

**Quick Commands:**
```bash
npm test -- --run          # Unit tests (fast)
npm run lint               # Lint check
npm run test:e2e           # Full E2E suite
npm run test:e2e -- --last-failed  # Only failed tests
```
