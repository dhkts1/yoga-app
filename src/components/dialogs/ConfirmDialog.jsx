import PropTypes from 'prop-types';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import { Heading, Text } from '../design-system/Typography';
import { Button } from '../design-system/Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * ConfirmDialog Component
 *
 * Reusable confirmation dialog for destructive or important actions.
 * Provides better UX than browser confirm() with:
 * - Backdrop blur effect
 * - Smooth animations (respects prefers-reduced-motion)
 * - Icon support for visual context
 * - Customizable button variants
 * - Keyboard support (Escape to close, Enter to confirm)
 *
 * @example
 * ```jsx
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Session?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger"
 *   icon="warning"
 * />
 * ```
 */
function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  icon = 'warning',
}) {
  // Focus trap for accessibility
  const dialogRef = useFocusTrap(isOpen, onClose);

  // Additional keyboard event handler for Enter key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon mapping
  const iconComponents = {
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const IconComponent = iconComponents[icon] || AlertTriangle;

  // Icon background color mapping
  const iconBgColors = {
    warning: 'bg-state-warning/20',
    error: 'bg-state-error/20',
    info: 'bg-muted',
  };

  // Icon color mapping
  const iconColors = {
    warning: 'text-state-warning',
    error: 'text-state-error',
    info: 'text-muted-foreground',
  };

  // Confirm button styling
  const confirmButtonClass = confirmVariant === 'danger'
    ? 'bg-state-error hover:bg-state-error/90 shadow-lg'
    : 'bg-secondary hover:bg-primary shadow-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50 p-4 backdrop-blur-sm duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon and Title */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-3 ${iconBgColors[icon]}`}>
              <IconComponent className={`size-6 ${iconColors[icon]}`} />
            </div>
            <Heading level={2} id="confirm-dialog-title" className="text-foreground">
              {title}
            </Heading>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-muted"
            aria-label="Close dialog"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Message */}
        <Text
          id="confirm-dialog-description"
          className="mb-6 leading-relaxed text-muted-foreground"
        >
          {message}
        </Text>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 border-primary hover:bg-muted"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className={`flex-1 ${confirmButtonClass}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  /** Whether the dialog is open */
  isOpen: PropTypes.bool,
  /** Callback when dialog is closed */
  onClose: PropTypes.func.isRequired,
  /** Callback when confirm button is clicked */
  onConfirm: PropTypes.func.isRequired,
  /** Dialog title */
  title: PropTypes.string,
  /** Dialog message/description */
  message: PropTypes.string.isRequired,
  /** Confirm button text */
  confirmText: PropTypes.string,
  /** Cancel button text */
  cancelText: PropTypes.string,
  /** Confirm button variant (danger for destructive actions) */
  confirmVariant: PropTypes.oneOf(['danger', 'primary']),
  /** Icon type to display */
  icon: PropTypes.oneOf(['warning', 'error', 'info']),
};

export default ConfirmDialog;
