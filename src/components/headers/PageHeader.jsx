import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * PageHeader - Reusable header component for standard app pages
 *
 * Features:
 * - Back button (optional)
 * - Page title
 * - Right-side actions (optional)
 * - Consistent styling
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
        'bg-white border-b border-border-light',
        className
      )}
      {...props}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className="flex-shrink-0 p-2 -ml-2 text-sage-600 hover:text-sage-700 transition-colors print:hidden"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-medium text-sage-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-secondary truncate">{subtitle}</p>
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
