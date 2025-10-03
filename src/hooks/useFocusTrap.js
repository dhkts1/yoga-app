import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a modal/dialog for WCAG 2.1 AA compliance
 *
 * Features:
 * - Automatically focuses first focusable element on open
 * - Traps Tab/Shift+Tab navigation within modal
 * - Returns focus to trigger element on close
 * - Supports Escape key to close
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when Escape is pressed (optional)
 * @returns {React.RefObject} - Ref to attach to the modal container
 *
 * @example
 * ```jsx
 * function MyModal({ isOpen, onClose }) {
 *   const modalRef = useFocusTrap(isOpen, onClose);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={modalRef} role="dialog" aria-modal="true">
 *       {content}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap(isOpen, onClose = null) {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before modal opened
    previousActiveElement.current = document.activeElement;

    // Get all focusable elements in the modal
    const getFocusableElements = () => {
      if (!containerRef.current) return [];

      const selector = [
        'a[href]:not([disabled])',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"]):not([disabled])'
      ].join(',');

      return Array.from(containerRef.current.querySelectorAll(selector));
    };

    // Focus first element after a short delay to ensure modal is rendered
    const focusFirstElement = () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Use setTimeout to wait for modal animations/rendering
        setTimeout(() => {
          focusableElements[0]?.focus();
        }, 100);
      }
    };

    focusFirstElement();

    // Handle Tab key to trap focus
    const handleKeyDown = (e) => {
      // Handle Escape key
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      // Only trap Tab key
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Shift + Tab (backwards navigation)
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward navigation)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Attach keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: Return focus to previous element when modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus when modal closes
      if (previousActiveElement.current instanceof HTMLElement) {
        // Use setTimeout to ensure modal is fully closed before focusing
        setTimeout(() => {
          previousActiveElement.current?.focus();
        }, 50);
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
}

export default useFocusTrap;
