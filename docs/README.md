# Documentation Archive

This directory contains historical documentation from the development and refactoring process of the Mindful Yoga App.

## Directory Structure

### `/features/`
Feature-specific guides and documentation:
- `PROGRAMS_GUIDE.md` - Multi-week programs complete guide (data flow, components, testing)

### `/deployment/`
Deployment and build documentation:
- `ANDROID_BUILD.md` - Android APK build instructions (Capacitor setup, signing, troubleshooting)

### `/refactoring/`
Major refactoring efforts and completion reports:
- `BADGE_REFACTORING_REPORT.md` - Badge component refactoring
- `LOCALSTORAGE_HOOKS_REFACTOR.md` - localStorage hooks abstraction
- `REFACTORING_PLAN.md` - Overall refactoring strategy
- `TOKEN_MIGRATION.md` - Design system token migration
- `DESIGN_SYSTEM_REFACTORING.md` - Design system component refactoring summary
- `REFACTORING_COMPLETE.md` - Complete refactoring initiative report

### `/implementation/`
Implementation summaries for features and fixes:
- `ANIMATIONS_IMPLEMENTATION_SUMMARY.md` - Animation system implementation
- `BOTTOM_NAV_RENAME_SUMMARY.md` - Bottom navigation renaming
- `INTERACTIVE_CALENDAR_IMPLEMENTATION.md` - Calendar feature implementation
- `ONBOARDING_IMPLEMENTATION.md` - User onboarding flow
- `PREFERENCES_STORE_SUMMARY.md` - Preferences store implementation
- `RECOMMENDATION_IMPLEMENTATION_SUMMARY.md` - Recommendation engine
- `TOOLTIP_IMPLEMENTATION_SUMMARY.md` - Tooltip/feature hint system
- `CLAUDE_MD_UPDATE_SUMMARY.md` - CLAUDE.md updates
- `MOBILE_FIXES_SUMMARY.md` - Mobile responsiveness fixes
- `DUPLICATE_SESSION_FIX.md` - Session duplication bug fix
- `CONFIRM_DIALOG_IMPLEMENTATION.md` - ConfirmDialog component implementation
- `MOOD_CALCULATOR_EXTRACTION.md` - Mood calculator utility extraction
- `PROGRESS_STORE_CHANGES.md` - Program progress store integration
- `USE_COLLAPSIBLE_SECTIONS_SUMMARY.md` - useCollapsibleSections hook implementation

### `/design-system/`
Design system documentation:
- `DESIGN_SYSTEM_COMPONENTS.md` - Component inventory
- `DESIGN_SYSTEM_SUMMARY.md` - Design system overview
- `DESIGN_SYSTEM_VALIDATION.md` - Validation and testing
- `DESIGN_SYSTEM.md` - Complete design system guide

### `/testing/`
Testing reports and verification:
- `NAVIGATION_TESTING_REPORT.md` - Navigation testing results
- `RECOMMENDATION_TESTING.md` - Recommendation engine testing
- `VERIFICATION_CHECKLIST.md` - Feature verification checklist
- `VERIFICATION_REPORT.md` - Refactoring verification report

### `/hooks/`
Custom React hooks documentation:
- `README.md` - Hooks overview
- `MIGRATION_GUIDE.md` - Migration guide for hooks refactoring
- `useLocalStorage.md` - useLocalStorage hook documentation
- `useCollapsibleSections.md` - useCollapsibleSections hook documentation

### `/types/`
TypeScript/PropTypes documentation:
- `README.md` - Types overview
- `EXAMPLES.md` - Usage examples
- `VALIDATION.md` - Validation patterns

### Root-Level Documentation Files

- `NEW_APIS.md` - Quick reference for new components, hooks, and utilities

## Active Documentation

### Root Directory Files
- **`/CLAUDE.md`** - Project guide for Claude Code (architecture, workflow, testing)
- **`/PRD.md`** - Product Requirements Document
- **`/README.md`** - Project overview for general audience
- **`/REFACTORING_SUMMARY.md`** - Complete refactoring guide (hooks, components, utilities)

### Essential Quick Links
- **`/docs/NEW_APIS.md`** - Quick reference for components, hooks, and utilities
- **`/docs/features/PROGRAMS_GUIDE.md`** - Multi-week programs guide
- **`/docs/deployment/ANDROID_BUILD.md`** - Android APK build guide

## Purpose

This archive preserves implementation history and decision-making context. While not required for active development, it provides valuable context for understanding:
- Why certain architectural decisions were made
- How features evolved over time
- Testing strategies and validation approaches
- Migration paths from old to new patterns

## Maintenance

These files are historical artifacts. Updates should be rare, focusing only on corrections or clarifications. New documentation should be added to the appropriate subdirectory following the established naming conventions.

## Quick Links

### For New Developers
1. **Start**: `/README.md` - Project overview
2. **Architecture**: `/CLAUDE.md` - Complete project guide
3. **Quick Reference**: `/docs/NEW_APIS.md` - Components, hooks, utilities
4. **Patterns**: `/REFACTORING_SUMMARY.md` - Architectural patterns

### For Feature Development
1. **Design System**: `/docs/design-system/` - Components and tokens
2. **Custom Hooks**: `/docs/hooks/` - Hook documentation and examples
3. **Programs**: `/docs/features/PROGRAMS_GUIDE.md` - Multi-week programs guide
4. **Past Implementations**: `/docs/implementation/` - Implementation examples
5. **Quick APIs**: `/docs/NEW_APIS.md` - Copy-paste ready examples

### For Deployment
1. **Android**: `/docs/deployment/ANDROID_BUILD.md` - APK build guide
2. **PWA**: See `/CLAUDE.md` - Service worker and offline support

### For Testing
1. **Test Strategies**: `/docs/testing/` - Testing reports and verification
2. **E2E Tests**: `/tests/e2e/` - Playwright tests (root directory)
3. **Configuration**: `playwright.config.js` - Test setup
