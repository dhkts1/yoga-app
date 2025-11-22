# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/` with `components/`, `design-system/`, `screens/`, `hooks/`, and `stores/` as the primary layers; shared styles in `styles/` and data in `data/`.
- Entry points: `main.jsx` (bootstrap) and `App.jsx` (routes/layout). Global styles in `index.css`.
- Assets are in `public/` and `src/assets/`. Capacitor config sits in `capacitor.config.json` and the Android build under `android/`.
- Tests are split by type in `tests/` (`unit/`, `integration/`, `e2e/`, `a11y/`); Playwright reports land in `playwright-report/` and screenshots under `tests/screenshots/`.
- Reference docs live in `docs/` plus `CLAUDE.md`, `PRD.md`, and `REFACTORING_SUMMARY.md` for architecture and decision context.

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server at `http://localhost:5173`.
- `npm run build` — production bundle; `npm run preview` to serve the built app.
- `npm run lint` — ESLint with React, hooks, and Tailwind plugins.
- `npm run format` — Prettier with Tailwind sorting.
- `npm test` — Vitest unit/integration suite (jsdom). `npm run test:coverage` for coverage, `npm run test:ui` for the Vitest UI.
- `npm run test:e2e` — Playwright E2E; `test:a11y` for the accessibility subset; `test:e2e:report` to open the HTML report.

## Coding Style & Naming Conventions
- JavaScript/JSX with ES modules; prefer functional components and hooks.
- Prettier enforces formatting (2-space indent, single quotes where possible, trailing commas). Run `npm run format` before committing.
- ESLint is zero-warning; fix or justify lint errors. Tailwind classes should be ordered by the plugin.
- Components/hooks: `PascalCase` files in `components/` and `hooks/` (`useSomething`). Utility modules: `camelCase`. Tests mirror source names with `.test.js|.test.jsx`.

## Testing Guidelines
- Default to Vitest for unit/integration (jsdom). Co-locate mocks in `tests/helpers/`.
- Name tests after the unit under test (`ComponentName.test.jsx`, `useHook.test.js`) and keep them deterministic (avoid timers without fake clocks).
- E2E: keep stable selectors via `data-testid`; screenshots stored in `tests/screenshots/`.
- Coverage: use `npm run test:coverage` before merging features that touch core flows (auth, sessions, timers).

## Commit & Pull Request Guidelines
- Commit messages follow the existing short, imperative style (`Fix …`, `Redesign …`, `Skip flaky …`); keep them scoped to one change.
- PRs should include: concise summary, linked issue (if any), screenshots for UI changes (mobile + desktop), and test evidence (`npm test`, `npm run test:e2e` or rationale for skipping).
- Avoid noisy diffs: run `lint` and `format`, and remove stray console logs. Update relevant docs when altering architecture or APIs.

## Security & Configuration Tips
- Keep environment secrets out of the repo; use local `.env` files and never commit them.
- When touching PWA/Capacitor config, confirm `npm run build` + `npm run test:e2e` pass and assets remain offline-ready.
