import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../../../src/components/dialogs/ConfirmDialog';

// Mock design system components
vi.mock('../../../src/components/design-system/Typography', () => ({
  Heading: ({ children, id, className, level }) => (
    <h2 id={id} className={className} data-level={level}>{children}</h2>
  ),
  Text: ({ children, id, className }) => (
    <p id={id} className={className}>{children}</p>
  ),
}));

vi.mock('../../../src/components/design-system/Button', () => ({
  Button: ({ children, onClick, className, variant }) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock focus trap hook
vi.mock('../../../src/hooks/useFocusTrap', () => ({
  useFocusTrap: () => ({ current: null }),
}));

describe('ConfirmDialog', () => {
  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup after each test
    document.body.style.overflow = '';
  });

  it('renders dialog with title and message', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete Session?"
        message="This action cannot be undone."
      />
    );

    expect(screen.getByText('Delete Session?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Test message"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
        confirmText="Delete"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Delete/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
        cancelText="Cancel"
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close (X) button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    // Click the backdrop (outer div with role="dialog")
    const backdrop = container.querySelector('[role="dialog"]');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside dialog content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    // Click inside the dialog content (inner div)
    const dialogContent = container.querySelector('.bg-card.rounded-2xl');
    await user.click(dialogContent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onConfirm when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    await user.keyboard('{Enter}');

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('supports custom confirm and cancel button text', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
        confirmText="Yes, Delete"
        cancelText="No, Keep It"
      />
    );

    expect(screen.getByRole('button', { name: /Yes, Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No, Keep It/i })).toBeInTheDocument();
  });

  it('shows warning icon by default', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    // Warning icon should be rendered - check for the icon container with warning colors
    const iconContainer = container.querySelector('.bg-state-warning\\/20');
    expect(iconContainer).toBeInTheDocument();

    // Also check that an SVG icon exists
    const svgIcon = iconContainer?.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('shows info icon when icon prop is "info"', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Information message"
        icon="info"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('prevents body scroll when open', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ConfirmDialog
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('has appropriate ARIA attributes', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Confirm Action"
        message="This is important"
      />
    );

    const backdrop = container.querySelector('[role="dialog"]');
    expect(backdrop).toHaveAttribute('role', 'dialog');
    expect(backdrop).toHaveAttribute('aria-modal', 'true');
    expect(backdrop).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    expect(backdrop).toHaveAttribute('aria-describedby', 'confirm-dialog-description');
  });

  it('uses default title when not provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('supports danger variant for destructive actions', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Delete everything?"
        confirmVariant="danger"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    expect(confirmButton.className).toContain('bg-state-error');
  });

  it('supports primary variant for confirm button', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Continue?"
        confirmVariant="primary"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    expect(confirmButton.className).toContain('bg-secondary');
  });

  it('cleans up event listeners on unmount', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { unmount } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />
    );

    // Add spy on removeEventListener
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
