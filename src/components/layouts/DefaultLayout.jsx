import AppLayout from '../AppLayout';

/**
 * DefaultLayout - Standard layout for most app pages
 *
 * Features:
 * - Sticky header at top (pass as children or use header prop)
 * - Scrollable content area
 * - Fixed BottomNav at bottom
 *
 * Usage:
 * <DefaultLayout header={<PageHeader title="Sessions" />}>
 *   {content}
 * </DefaultLayout>
 */
function DefaultLayout({
  children,
  header,
  className,
  contentClassName,
  ...props
}) {
  return (
    <AppLayout
      showHeader={!!header}
      showFooter={false}
      showBottomNav={true}
      fixedHeader={true}
      className={className}
      contentClassName={contentClassName}
      header={header}
      {...props}
    >
      {children}
    </AppLayout>
  );
}

export default DefaultLayout;
