import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

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
      className={cn(
        // Background with subtle gradient
        'bg-gradient-to-b from-white to-sage-50/30',
        // Shadow for depth
        'shadow-sm',
        // Border
        'border-b border-sage-100',
        className
      )}
      {...props}
    >
      <div className="px-4 h-14 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className={cn(
                  'flex-shrink-0 p-1.5 -ml-1.5',
                  'text-sage-600 hover:text-sage-700',
                  'hover:bg-sage-50 rounded-full',
                  'transition-all duration-200',
                  'print:hidden'
                )}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className={cn(
                'text-base font-semibold truncate',
                'bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent'
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-sage-600 truncate">{subtitle}</p>
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
