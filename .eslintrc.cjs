module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended-legacy', // 6.0.0+ legacy config (includes react-compiler)
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  globals: {
    vi: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
  },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    tailwindcss: {
      callees: ['cn', 'clsx', 'cva'],
      config: 'tailwind.config.js',
      cssFiles: ['src/index.css'],
      whitelist: [
        // Design system semantic tokens
        'state-success', 'state-warning', 'state-error', 'state-info',
        // Design system palette
        'sage-.*', 'cream-.*', 'gold-.*',
        // Semantic tokens
        'primary.*', 'accent.*', 'destructive.*', 'muted.*',
        'foreground', 'background', 'popover.*', 'card.*',
        // UI tokens
        'border', 'input', 'ring',
        // Animation/utility classes
        'animate-.*', 'transition-.*', 'duration-.*',
      ],
    },
  },
  plugins: ['react-refresh', 'tailwindcss'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react/prop-types': 'off', // Temporarily disable for rapid development
    'react/no-unescaped-entities': 'off', // Allow quotes in JSX text
    'react-refresh/only-export-components': 'off', // Allow mixed exports during development
    'react-hooks/exhaustive-deps': 'off', // Disable during rapid prototyping
    // React Compiler rule is auto-enabled via recommended-legacy preset

    // Tailwind CSS rules
    'tailwindcss/classnames-order': 'warn', // Prettier handles this, but keep as fallback
    'tailwindcss/no-custom-classname': 'off', // Off - we have custom design system tokens
    'tailwindcss/no-contradicting-classname': 'error', // Catch conflicts like text-red-500 text-blue-500
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',
    'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
  },
}
