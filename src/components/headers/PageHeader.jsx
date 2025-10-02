import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import GlassIconButton from '../ui/GlassIconButton';
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
      <div className="px-4 h-14 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBack && (
              <GlassIconButton
                icon={ArrowLeft}
                onClick={handleBack}
                label="Go back"
                variant="standard"
                className="print:hidden"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className={cn(
                'text-base font-semibold truncate tracking-tight',
                // Solid color - cleaner, more minimal
                'text-sage-800'
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-sage-600/80 truncate mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Actions */}
          {actions && (
            <div className="flex-shrink-0 ml-3">
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
