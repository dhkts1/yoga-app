/**
 * Overlay Components
 *
 * Modal, dialog, and overlay components for tips, pause screens, and confirmations.
 * Designed with breath-like animations and gentle interactions.
 */

import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';

// Base overlay/modal component
const Overlay = React.forwardRef(({
  className,
  children,
  open = false,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  backdrop = 'blur',
  animation = 'scale',
  ...props
}, ref) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const backdrops = {
    blur: 'bg-background-overlay backdrop-blur-sm',
    dark: 'bg-black/50',
    light: 'bg-white/80',
    sage: 'bg-sage-500/20 backdrop-blur-sm'
  };

  const animations = {
    fade: 'animate-fade-in',
    scale: 'animate-scale-in',
    'slide-up': 'animate-slide-up'
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'transition-all duration-300',
        // Mobile-safe padding and viewport handling
        'p-4 sm:p-6',
        'overflow-y-auto', // Allow vertical scrolling if content overflows
        'max-h-screen', // Constrain to viewport height
        backdrops[backdrop],
        className
      )}
      onClick={handleBackdropClick}
      ref={ref}
      {...props}
    >
      <div className={cn(
        'w-full max-w-lg',
        'max-h-full', // Prevent overflow beyond viewport
        'overflow-y-auto', // Allow scrolling within overlay content
        'box-border',
        animations[animation]
      )}>
        {children}
      </div>
    </div>
  );
});

Overlay.displayName = 'Overlay';

// Modal component for general dialogs
const Modal = React.forwardRef(({
  className,
  children,
  open = false,
  onClose,
  title,
  description,
  showCloseButton = true,
  size = 'default',
  ...props
}, ref) => {
  const sizes = {
    sm: 'max-w-sm',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
    mobile: 'max-w-safe', // Use safe width for mobile
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      className="p-4"
      {...props}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-xl',
          'border border-border-light',
          'w-full box-border',
          'max-h-full overflow-y-auto',
          sizes[size],
          className
        )}
        ref={ref}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-base text-secondary mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-lg text-muted hover:text-secondary',
                  'hover:bg-sage-50 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500'
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </Overlay>
  );
});

Modal.displayName = 'Modal';

// Drawer component for slide-up overlays
const Drawer = React.forwardRef(({
  className,
  children,
  open = false,
  onClose,
  title,
  position = 'bottom',
  size = 'default',
  ...props
}, ref) => {
  const positions = {
    bottom: {
      container: 'items-end justify-center',
      content: 'rounded-t-2xl',
      animation: 'animate-slide-up'
    },
    top: {
      container: 'items-start justify-center',
      content: 'rounded-b-2xl',
      animation: 'animate-slide-down'
    },
    left: {
      container: 'items-center justify-start',
      content: 'rounded-r-2xl h-full',
      animation: 'animate-slide-right'
    },
    right: {
      container: 'items-center justify-end',
      content: 'rounded-l-2xl h-full',
      animation: 'animate-slide-left'
    }
  };

  const sizes = {
    sm: position === 'bottom' || position === 'top' ? 'max-h-[40vh]' : 'max-w-sm',
    default: position === 'bottom' || position === 'top' ? 'max-h-[60vh]' : 'max-w-md',
    lg: position === 'bottom' || position === 'top' ? 'max-h-[80vh]' : 'max-w-lg',
    full: position === 'bottom' || position === 'top' ? 'max-h-[90vh]' : 'max-w-full',
    mobile: position === 'bottom' || position === 'top' ? 'max-h-[70vh]' : 'max-w-safe',
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      className={cn('p-0', positions[position].container)}
      animation="fade"
      {...props}
    >
      <div
        className={cn(
          'bg-white shadow-xl border border-border-light',
          'w-full box-border',
          positions[position].content,
          positions[position].animation,
          sizes[size],
          className
        )}
        ref={ref}
      >
        {/* Drag handle for bottom drawer */}
        {position === 'bottom' && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border-light">
            <h2 className="text-xl font-semibold text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg text-muted hover:text-secondary',
                'hover:bg-sage-50 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </Overlay>
  );
});

Drawer.displayName = 'Drawer';

// Tips overlay for yoga poses
const TipsOverlay = React.forwardRef(({
  className,
  children,
  open = false,
  onClose,
  pose,
  tips = [],
  ...props
}, ref) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      position="bottom"
      size="mobile"
      className={cn('overflow-y-auto', className)}
      ref={ref}
      {...props}
    >
      <div className="space-y-4">
        {/* Pose name */}
        {pose && (
          <div className="text-center">
            <h3 className="text-lg font-medium text-primary">
              {pose.nameEnglish}
            </h3>
            {pose.nameSanskrit && (
              <p className="text-sm text-secondary italic">
                {pose.nameSanskrit}
              </p>
            )}
          </div>
        )}

        {/* Tips content */}
        {tips.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-primary">Form Tips:</h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sage-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-base text-secondary">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          children
        )}

        {/* Benefits */}
        {pose?.benefits && pose.benefits.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-primary">Benefits:</h4>
            <ul className="space-y-2">
              {pose.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-base text-secondary">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className={cn(
              'w-full py-3 px-4 bg-sage-500 text-white rounded-lg',
              'hover:bg-sage-600 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2'
            )}
          >
            Got it
          </button>
        </div>
      </div>
    </Drawer>
  );
});

TipsOverlay.displayName = 'TipsOverlay';

// Pause overlay for practice sessions
const PauseOverlay = React.forwardRef(({
  className,
  open = false,
  onResume,
  onEnd,
  sessionName,
  currentPose,
  totalPoses,
  ...props
}, ref) => {
  return (
    <Overlay
      open={open}
      onClose={onResume}
      backdrop="blur"
      animation="scale"
      className={className}
      ref={ref}
      {...props}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-border-light p-8 text-center">
        <div className="space-y-6">
          {/* Pause icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Practice Paused
            </h2>
            {sessionName && (
              <p className="text-base text-secondary">
                {sessionName}
              </p>
            )}
            {currentPose && totalPoses && (
              <p className="text-sm text-muted">
                Pose {currentPose} of {totalPoses}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onResume}
              className={cn(
                'w-full py-3 px-4 bg-sage-500 text-white rounded-lg',
                'hover:bg-sage-600 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2'
              )}
            >
              Resume Practice
            </button>
            <button
              onClick={onEnd}
              className={cn(
                'w-full py-3 px-4 bg-transparent text-secondary border border-border-medium rounded-lg',
                'hover:bg-background-secondary transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2'
              )}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
});

PauseOverlay.displayName = 'PauseOverlay';

// Alert dialog for confirmations
const AlertDialog = React.forwardRef(({
  className,
  open = false,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: {
      confirmButton: 'bg-sage-500 hover:bg-sage-600 text-white',
      cancelButton: 'bg-transparent hover:bg-background-secondary text-secondary border border-border-medium'
    },
    destructive: {
      confirmButton: 'bg-state-error hover:bg-red-500 text-white',
      cancelButton: 'bg-transparent hover:bg-background-secondary text-secondary border border-border-medium'
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      className={className}
      ref={ref}
      {...props}
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-primary">
            {title}
          </h2>
          {description && (
            <p className="text-base text-secondary">
              {description}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 py-3 px-4 rounded-lg transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2',
              variants[variant].cancelButton
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex-1 py-3 px-4 rounded-lg transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2',
              variants[variant].confirmButton
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
});

AlertDialog.displayName = 'AlertDialog';

export {
  Overlay,
  Modal,
  Drawer,
  TipsOverlay,
  PauseOverlay,
  AlertDialog
};