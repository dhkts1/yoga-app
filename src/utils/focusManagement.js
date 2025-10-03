/**
 * Focus management utilities for accessibility (WCAG 2.1 AA)
 *
 * Provides helper functions for managing focus in complex UIs,
 * particularly for modals, dialogs, and navigation.
 */

/**
 * Focus the first focusable element in a container
 *
 * @param {HTMLElement} container - The container to search within
 * @returns {boolean} - True if an element was focused
 */
export const focusFirst = (container) => {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[0].focus();
    return true;
  }
  return false;
};

/**
 * Focus the last focusable element in a container
 *
 * @param {HTMLElement} container - The container to search within
 * @returns {boolean} - True if an element was focused
 */
export const focusLast = (container) => {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[focusable.length - 1].focus();
    return true;
  }
  return false;
};

/**
 * Get all focusable elements in a container
 *
 * Includes: links, buttons, inputs, textareas, selects, and elements with tabindex >= 0
 *
 * @param {HTMLElement} container - The container to search within
 * @returns {HTMLElement[]} - Array of focusable elements
 */
export const getFocusableElements = (container) => {
  if (!container) return [];

  const selector = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])'
  ].join(',');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Check if an element is focusable
 *
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is focusable
 */
export const isFocusable = (element) => {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

  // Check if it's a naturally focusable element
  if (focusableTags.includes(tagName) && !element.disabled) {
    // Links need href to be focusable
    if (tagName === 'a') {
      return element.hasAttribute('href');
    }
    return true;
  }

  // Check if it has tabindex and is not explicitly removed from tab order
  const tabindex = element.getAttribute('tabindex');
  return tabindex !== null && tabindex !== '-1';
};

/**
 * Restore focus to a previously focused element
 *
 * Safely restores focus to an element, checking that it still exists in the DOM
 *
 * @param {HTMLElement} element - The element to restore focus to
 * @returns {boolean} - True if focus was restored
 */
export const restoreFocus = (element) => {
  if (element instanceof HTMLElement && document.body.contains(element)) {
    element.focus();
    return true;
  }
  return false;
};

/**
 * Make an element temporarily focusable and focus it
 *
 * Useful for focusing headings or other non-interactive elements
 * Removes tabindex after focus to keep it out of tab order
 *
 * @param {HTMLElement} element - The element to focus
 * @param {number} removeDelay - Delay before removing tabindex (ms)
 */
export const focusTemporarily = (element, removeDelay = 100) => {
  if (!element) return;

  element.setAttribute('tabindex', '-1');
  element.focus();

  // Remove tabindex after focus so it's not in tab order
  setTimeout(() => {
    element.removeAttribute('tabindex');
  }, removeDelay);
};

/**
 * Focus the main heading on the page
 *
 * Useful for announcing page changes to screen readers
 *
 * @returns {boolean} - True if a heading was found and focused
 */
export const focusMainHeading = () => {
  const mainHeading = document.querySelector('h1');
  if (mainHeading) {
    focusTemporarily(mainHeading);
    return true;
  }
  return false;
};

/**
 * Create a focus trap within an element
 *
 * Returns a cleanup function to remove the trap
 *
 * @param {HTMLElement} element - The element to trap focus within
 * @param {Function} onEscape - Optional callback when Escape is pressed
 * @returns {Function} - Cleanup function
 */
export const createFocusTrap = (element, onEscape = null) => {
  if (!element) return () => {};

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(element);
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};
