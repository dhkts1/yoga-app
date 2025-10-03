import { cn } from '../../lib/utils';

/**
 * GlassIconButton - Reusable glass-effect icon button
 *
 * A modern glassmorphism button with two variants:
 * - standard: Rectangular glass button with icon (for nav/actions)
 * - circular: Round glass button with icon (for modal exits, floating actions)
 *
 * Features:
 * - Glassmorphism background with backdrop blur
 * - Smooth hover/active scale animations
 * - Accessible focus states
 * - Consistent with design system
 *
 * Usage:
 * <GlassIconButton
 *   icon={ArrowLeft}
 *   onClick={handleBack}
 *   label="Go back"
 *   variant="standard"
 * />
 */
function GlassIconButton({
  onClick,
  icon: Icon,
  label,
  variant = 'standard', // 'standard' | 'circular'
  className,
  ...props
}) {
  const variantStyles = variant === 'circular'
    ? 'h-9 w-9 rounded-full bg-muted/40'
    : 'p-1.5 -ml-1.5 rounded-xl bg-muted/30';

  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        'flex shrink-0 items-center justify-center',
        // Glass effect
        'backdrop-blur-md',
        // Colors
        'text-muted-foreground hover:text-foreground',
        'hover:bg-muted/50',
        // Animations
        'transition-all duration-200 ease-out',
        'hover:scale-105 active:scale-95',
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:ring-offset-1',
        // Variant-specific styles
        variantStyles,
        className
      )}
      aria-label={label}
      {...props}
    >
      <Icon className="size-5" strokeWidth={2} />
    </button>
  );
}

export default GlassIconButton;
