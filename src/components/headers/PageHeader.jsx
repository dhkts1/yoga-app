import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { GlassIconButton } from '../design-system';
import { HEADER_STYLES } from './headerStyles';

/**
 * PageHeader - Reusable header component for standard app pages
 *
 * Features:
 * - Back button (optional)
 * - Page title with gradient text
 * - Right-side actions (optional)
 * - Elevated design with subtle shadow
 * - Design system compliant
 *
 * Usage:
 * <PageHeader
 *   title="Sessions"
 *   onBack={() => navigate('/')}
 *   actions={<button>...</button>}
 * />
 */
function PageHeader({
  title,
  subtitle,
  onBack,
  backPath = '/',
  showBack = true,
  actions,
  children,
  className,
  ...props
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    }
  };

  return (
    <header
      className={cn(HEADER_STYLES.container, className)}
      {...props}
    >
      <div className="flex h-14 items-center px-4">
        <div className="relative flex w-full items-center justify-center">
          {/* Back Button - absolute positioned on left */}
          {showBack && (
            <div className="absolute left-0">
              <GlassIconButton
                icon={ArrowLeft}
                onClick={handleBack}
                label="Go back"
                variant="standard"
                className="print:hidden"
              />
            </div>
          )}

          {/* Title - truly centered with slight downward shift */}
          <div className="mt-1 min-w-0 text-center">
            <h1 className={cn(
              'truncate text-base font-semibold tracking-tight',
              // Solid color - cleaner, more minimal
              'text-foreground'
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{subtitle}</p>
            )}
          </div>

          {/* Right Actions - absolute positioned on right */}
          {actions && (
            <div className="absolute right-0 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Optional children (e.g., tabs, filters) */}
      {children}
    </header>
  );
}

export default PageHeader;
