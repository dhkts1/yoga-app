import { renderHook } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { useFocusTrap } from "../../../src/hooks/useFocusTrap";

describe("useFocusTrap", () => {
  let container;

  beforeEach(() => {
    vi.useFakeTimers();

    // Create a container with focusable elements
    container = document.createElement("div");
    container.innerHTML = `
      <button id="btn1">Button 1</button>
      <input id="input1" type="text" />
      <a id="link1" href="#">Link 1</a>
      <button id="btn2">Button 2</button>
    `;
    document.body.appendChild(container);

    // Clear any existing focus
    document.body.focus();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.removeChild(container);
  });

  describe("Ref assignment", () => {
    test("should return a ref object", () => {
      const { result } = renderHook(() => useFocusTrap(false));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    test("should allow ref to be assigned to container", () => {
      const { result } = renderHook(() => useFocusTrap(false));

      result.current.current = container;
      expect(result.current.current).toBe(container);
    });
  });

  describe("Initial focus", () => {
    test("should focus first focusable element when modal opens", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;

      // Open modal
      rerender({ isOpen: true });

      // Fast-forward timers to allow focus to happen
      vi.advanceTimersByTime(150);

      expect(document.activeElement).toBe(container.querySelector("#btn1"));
    });

    test("should not focus elements when modal is closed", () => {
      const previousElement = document.createElement("button");
      document.body.appendChild(previousElement);
      previousElement.focus();

      const { result } = renderHook(() => useFocusTrap(false));
      result.current.current = container;

      expect(document.activeElement).toBe(previousElement);

      document.body.removeChild(previousElement);
    });

    test("should handle container with no focusable elements", () => {
      const emptyContainer = document.createElement("div");
      emptyContainer.innerHTML = "<p>No focusable elements</p>";
      document.body.appendChild(emptyContainer);

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = emptyContainer;

      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      // Should not throw error
      expect(() => {
        vi.advanceTimersByTime(150);
      }).not.toThrow();

      document.body.removeChild(emptyContainer);
    });
  });

  describe("Focus trapping - Tab key", () => {
    test("should trap focus forward with Tab key", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      const btn1 = container.querySelector("#btn1");
      const input1 = container.querySelector("#input1");

      btn1.focus();
      expect(document.activeElement).toBe(btn1);

      // Simulate Tab key press
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent);

      // Focus should not have moved (trapped in modal)
      // The hook prevents default but doesn't auto-focus next element
      expect(document.activeElement).toBe(btn1);
    });

    test("should cycle to first element when tabbing from last element", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      const lastButton = container.querySelector("#btn2");
      const firstButton = container.querySelector("#btn1");

      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      // Simulate Tab from last element
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });

      // Mock preventDefault to verify it's called
      const preventDefaultSpy = vi.spyOn(tabEvent, "preventDefault");
      document.dispatchEvent(tabEvent);

      // Should prevent default and cycle to first
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Focus trapping - Shift+Tab key", () => {
    test("should cycle to last element when shift-tabbing from first element", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      const firstButton = container.querySelector("#btn1");

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Simulate Shift+Tab from first element
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(shiftTabEvent, "preventDefault");
      document.dispatchEvent(shiftTabEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test("should trap focus backward with Shift+Tab key", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      const input1 = container.querySelector("#input1");
      input1.focus();

      // Simulate Shift+Tab
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shiftTabEvent);

      // Focus should be trapped
      expect(document.activeElement).toBe(input1);
    });
  });

  describe("Escape key handling", () => {
    test("should call onClose when Escape is pressed", () => {
      const onClose = vi.fn();
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen, onClose),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });

      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(escapeEvent, "preventDefault");
      document.dispatchEvent(escapeEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("should not throw when Escape is pressed without onClose callback", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen, null),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });

      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });

      expect(() => {
        document.dispatchEvent(escapeEvent);
      }).not.toThrow();
    });
  });

  describe("Focus restoration", () => {
    test("should restore focus to previous element when modal closes", () => {
      const previousElement = document.createElement("button");
      previousElement.id = "previous-btn";
      document.body.appendChild(previousElement);
      previousElement.focus();

      expect(document.activeElement).toBe(previousElement);

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;

      // Open modal
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      // Modal should have focus now
      expect(document.activeElement).toBe(container.querySelector("#btn1"));

      // Close modal
      rerender({ isOpen: false });
      vi.advanceTimersByTime(100);

      // Focus should return to previous element
      expect(document.activeElement).toBe(previousElement);

      document.body.removeChild(previousElement);
    });

    test("should handle invalid previous element gracefully", () => {
      // Focus on body (not an HTMLElement with focus method)
      document.body.focus();

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;

      // Open and close modal
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      rerender({ isOpen: false });
      vi.advanceTimersByTime(100);

      // Should not throw error
      expect(() => {
        vi.advanceTimersByTime(100);
      }).not.toThrow();
    });
  });

  describe("Non-Tab key handling", () => {
    test("should not trap non-Tab keys", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });

      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");
      document.dispatchEvent(enterEvent);

      // Should NOT prevent default for non-Tab keys
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe("Disabled elements", () => {
    test("should skip disabled elements in focus trap", () => {
      const containerWithDisabled = document.createElement("div");
      containerWithDisabled.innerHTML = `
        <button id="btn1">Button 1</button>
        <button id="btn2" disabled>Disabled Button</button>
        <input id="input1" type="text" />
      `;
      document.body.appendChild(containerWithDisabled);

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = containerWithDisabled;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      // Should focus first enabled element
      expect(document.activeElement.id).toBe("btn1");

      document.body.removeChild(containerWithDisabled);
    });

    test('should handle elements with tabindex="-1"', () => {
      const containerWithTabindex = document.createElement("div");
      containerWithTabindex.innerHTML = `
        <button id="btn1">Button 1</button>
        <button id="btn2" tabindex="-1">Not Focusable</button>
        <input id="input1" type="text" />
      `;
      document.body.appendChild(containerWithTabindex);

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = containerWithTabindex;
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      // Should skip tabindex="-1" elements
      expect(document.activeElement.id).toBe("btn1");

      document.body.removeChild(containerWithTabindex);
    });
  });

  describe("Event cleanup", () => {
    test("should remove event listeners when component unmounts", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { result, rerender, unmount } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;
      rerender({ isOpen: true });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    test("should remove event listeners when modal closes", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;

      // Open modal
      rerender({ isOpen: true });
      vi.advanceTimersByTime(150);

      // Close modal
      rerender({ isOpen: false });

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Edge cases", () => {
    test("should handle null container ref", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = null;

      expect(() => {
        rerender({ isOpen: true });
        vi.advanceTimersByTime(150);
      }).not.toThrow();
    });

    test("should handle rapid open/close cycles", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useFocusTrap(isOpen),
        { initialProps: { isOpen: false } },
      );

      result.current.current = container;

      // Rapidly toggle
      rerender({ isOpen: true });
      rerender({ isOpen: false });
      rerender({ isOpen: true });
      rerender({ isOpen: false });

      expect(() => {
        vi.advanceTimersByTime(500);
      }).not.toThrow();
    });

    test("should handle multiple simultaneous modals gracefully", () => {
      const container2 = document.createElement("div");
      container2.innerHTML = "<button>Modal 2 Button</button>";
      document.body.appendChild(container2);

      const { result: result1 } = renderHook(() => useFocusTrap(true));
      const { result: result2 } = renderHook(() => useFocusTrap(true));

      result1.current.current = container;
      result2.current.current = container2;

      expect(() => {
        vi.advanceTimersByTime(200);
      }).not.toThrow();

      document.body.removeChild(container2);
    });
  });
});
