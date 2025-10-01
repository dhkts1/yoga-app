import { cn } from '../lib/utils';
import BottomNav from './BottomNav';

/**
 * AppLayout - Optimized layout with sticky header/footer and proper scrolling
 *
 * Architecture:
 * - Root: Full viewport height container (h-screen)
 * - Header: Sticky at top (optional)
 * - Content: Flex-1 with overflow-auto for scrolling
 * - Footer: Sticky at bottom (optional)
 * - BottomNav: Fixed bottom navigation (optional)
 *
 * The content area automatically calculates available space and scrolls independently
 */
function AppLayout({
  header,
  footer,
  children,
  className,
  contentClassName,
  // Layout options
  showHeader = true,
  showFooter = true,
  showBottomNav = false,
  fixedHeader = false,
  fixedFooter = false,
  // Scroll behavior
  scrollable = true,
  // Safe area handling
  handleSafeArea = true,
  ...props
}) {
  return (
    <div
      className={cn(
        // Full viewport height, flex column layout
        'h-screen flex flex-col',
        // Background
        'bg-background',
        // Safe area padding (top only - bottom handled by individual elements)
        handleSafeArea && 'pt-safe-top',
        className
      )}
      {...props}
    >
      {/* Header - Sticky at top when fixedHeader=true */}
      {showHeader && header && (
        <div
          className={cn(
            'flex-shrink-0 z-50 bg-background',
            fixedHeader && 'sticky top-0'
          )}
        >
          {header}
        </div>
      )}

      {/* Main Content Area - Scrollable with flex-1 to fill available space */}
      <div
        className={cn(
          'flex-1',
          // Enable scrolling when scrollable=true
          scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden',
          // Add bottom padding for BottomNav (60px + safe area)
          showBottomNav && 'pb-[calc(60px+env(safe-area-inset-bottom))]',
          // Add bottom padding for fixed footer if present
          showFooter && fixedFooter && !showBottomNav && 'pb-[env(safe-area-inset-bottom)]',
          contentClassName
        )}
      >
        {children}
      </div>

      {/* Footer - Sticky at bottom when fixedFooter=true */}
      {showFooter && footer && (
        <div
          className={cn(
            'flex-shrink-0 z-40 bg-background',
            fixedFooter && 'sticky bottom-0',
            // Add safe area padding to footer
            handleSafeArea && !showBottomNav && 'pb-safe-bottom'
          )}
        >
          {footer}
        </div>
      )}

      {/* Bottom Navigation - Always fixed at bottom */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default AppLayout;