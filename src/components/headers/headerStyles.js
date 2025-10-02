/**
 * Shared Header Styles
 *
 * Centralized style definitions for header components.
 * These constants ensure visual consistency across all headers.
 */

export const HEADER_STYLES = {
  // Main header container - airy glass aesthetic
  container: 'bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] transition-all duration-300',

  // Typography
  title: {
    base: 'font-semibold truncate tracking-tight text-sage-800',
    sm: 'text-sm',
    md: 'text-base',
  },

  subtitle: {
    base: 'text-sage-600/80 truncate mt-0.5',
    xs: 'text-xs',
    sm: 'text-sm',
  },

  // Layout
  innerContainer: 'px-4 h-14 flex items-center',
  content: 'flex items-center justify-between w-full',
};
