---
name: warn-hardcoded-tailwind-colors
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.jsx$
  - field: new_text
    operator: regex_match
    pattern: (green|red|blue|amber|gray|purple|pink|orange|yellow|indigo|violet|teal|cyan|emerald|lime|rose|fuchsia|sky|slate|zinc|neutral|stone)-\d{2,3}
---

**Design System Violation Detected**

You're using a hardcoded Tailwind color class. Per CLAUDE.md, you should use semantic design system tokens instead:

**Instead of hardcoded colors:**
- `green-*` → Use `state-success` or `sage-*`
- `red-*` → Use `state-error` or `destructive`
- `blue-*` → Use `state-info` or `primary`
- `amber-*`, `yellow-*` → Use `state-warning` or `gold-*`
- `gray-*` → Use `muted`, `cream-*`, or semantic tokens

**Available semantic tokens:**
- State: `state-success`, `state-warning`, `state-error`, `state-info`
- Theme: `primary`, `accent`, `destructive`, `muted`, `foreground`, `background`
- Palette: `sage-*`, `cream-*`, `gold-*`

Check `/src/index.css` for full color token definitions.
