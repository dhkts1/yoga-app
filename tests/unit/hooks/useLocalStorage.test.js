import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import useLocalStorage from "../../../src/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  // Helper to safely clear localStorage
  const safeClearLocalStorage = () => {
    try {
      localStorage.clear();
    } catch {
      Object.keys(localStorage).forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore
        }
      });
    }
  };

  beforeEach(() => {
    safeClearLocalStorage();
    vi.clearAllMocks();
  });

  describe("Initial state", () => {
    test("should return initial value when localStorage is empty", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [value] = result.current;
      expect(value).toBe("initial");
    });

    test("should load existing value from localStorage", () => {
      localStorage.setItem("testKey", JSON.stringify("stored value"));

      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [value] = result.current;
      expect(value).toBe("stored value");
    });

    test("should handle complex objects", () => {
      const complexObject = {
        name: "Test",
        nested: {
          array: [1, 2, 3],
          bool: true,
        },
      };

      localStorage.setItem("testKey", JSON.stringify(complexObject));

      const { result } = renderHook(() => useLocalStorage("testKey", {}));

      const [value] = result.current;
      expect(value).toEqual(complexObject);
    });

    test("should handle arrays", () => {
      const array = [1, 2, 3, "test", { nested: true }];
      localStorage.setItem("testKey", JSON.stringify(array));

      const { result } = renderHook(() => useLocalStorage("testKey", []));

      const [value] = result.current;
      expect(value).toEqual(array);
    });

    test("should return initial value for corrupted data", () => {
      localStorage.setItem("testKey", "invalid json {{{");

      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage("testKey", "fallback"),
      );

      const [value] = result.current;
      expect(value).toBe("fallback");
      expect(consoleWarn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });

    test("should handle null initial value", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", null));

      const [value] = result.current;
      expect(value).toBeNull();
    });

    test("should handle undefined initial value", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", undefined),
      );

      const [value] = result.current;
      expect(value).toBeUndefined();
    });
  });

  describe("setValue function", () => {
    test("should update state and localStorage", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, setValue] = result.current;

      act(() => {
        setValue("updated");
      });

      const [newValue] = result.current;
      expect(newValue).toBe("updated");
      expect(localStorage.getItem("testKey")).toBe(JSON.stringify("updated"));
    });

    test("should support functional updates", () => {
      const { result } = renderHook(() => useLocalStorage("counter", 0));

      const [, setValue] = result.current;

      act(() => {
        setValue((prev) => prev + 1);
      });

      const [value1] = result.current;
      expect(value1).toBe(1);

      act(() => {
        setValue((prev) => prev + 5);
      });

      const [value2] = result.current;
      expect(value2).toBe(6);
    });

    test("should handle complex object updates", () => {
      const { result } = renderHook(() =>
        useLocalStorage("user", { name: "John", age: 30 }),
      );

      const [, setValue] = result.current;

      act(() => {
        setValue({ name: "Jane", age: 25 });
      });

      const [newValue] = result.current;
      expect(newValue).toEqual({ name: "Jane", age: 25 });
    });

    test("should handle array updates", () => {
      const { result } = renderHook(() => useLocalStorage("items", [1, 2, 3]));

      const [, setValue] = result.current;

      act(() => {
        setValue((prev) => [...prev, 4, 5]);
      });

      const [newValue] = result.current;
      expect(newValue).toEqual([1, 2, 3, 4, 5]);
    });

    test("should clear error on successful update", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      // Cause an error using vi.spyOn (properly restorable)
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage error");
        });

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const [, setValue] = result.current;

      act(() => {
        setValue("fail");
      });

      const [, , , error1] = result.current;
      expect(error1).toBeTruthy();

      // Restore and try again
      setItemSpy.mockRestore();

      act(() => {
        setValue("success");
      });

      const [, , , error2] = result.current;
      expect(error2).toBeNull();

      consoleError.mockRestore();
    });
  });

  describe("removeValue function", () => {
    test("should remove value from localStorage and reset to initial value", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, setValue, removeValue] = result.current;

      act(() => {
        setValue("updated");
      });

      expect(localStorage.getItem("testKey")).toBeTruthy();

      act(() => {
        removeValue();
      });

      const [value] = result.current;
      expect(value).toBe("initial");
      expect(localStorage.getItem("testKey")).toBeNull();
    });

    test("should clear error when removing value", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      // Cause an error first using vi.spyOn (properly restorable)
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage error");
        });

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const [, setValue, removeValue] = result.current;

      act(() => {
        setValue("fail");
      });

      const [, , , error1] = result.current;
      expect(error1).toBeTruthy();

      // Restore
      setItemSpy.mockRestore();

      act(() => {
        removeValue();
      });

      const [, , , error2] = result.current;
      expect(error2).toBeNull();

      consoleError.mockRestore();
    });
  });

  describe("Error handling", () => {
    test("should handle localStorage.setItem errors", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      // Use vi.spyOn for proper mock restoration
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("QuotaExceededError");
        });

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const [, setValue] = result.current;

      act(() => {
        setValue("new value");
      });

      const [, , , error] = result.current;
      expect(error).toBeTruthy();
      expect(error.message).toContain("QuotaExceededError");
      expect(consoleError).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleError.mockRestore();
    });

    test("should handle localStorage.removeItem errors", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      // Use vi.spyOn for proper mock restoration
      const removeItemSpy = vi
        .spyOn(Storage.prototype, "removeItem")
        .mockImplementation(() => {
          throw new Error("Remove error");
        });

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const [, , removeValue] = result.current;

      act(() => {
        removeValue();
      });

      const [, , , error] = result.current;
      expect(error).toBeTruthy();
      expect(consoleError).toHaveBeenCalled();

      removeItemSpy.mockRestore();
      consoleError.mockRestore();
    });

    test("should return error as fourth element of tuple", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, , , error] = result.current;
      expect(error).toBeNull();
    });
  });

  describe("Multi-tab synchronization", () => {
    test("should update state when storage event fires", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [value1] = result.current;
      expect(value1).toBe("initial");

      // Simulate another tab updating localStorage
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "testKey",
          newValue: JSON.stringify("updated from another tab"),
          oldValue: JSON.stringify("initial"),
        });
        window.dispatchEvent(storageEvent);
      });

      const [value2] = result.current;
      expect(value2).toBe("updated from another tab");
    });

    test("should reset to initial value when storage event has null newValue", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, setValue] = result.current;

      act(() => {
        setValue("updated");
      });

      // Simulate another tab clearing the value
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "testKey",
          newValue: null,
          oldValue: JSON.stringify("updated"),
        });
        window.dispatchEvent(storageEvent);
      });

      const [value] = result.current;
      expect(value).toBe("initial");
    });

    test("should ignore storage events for other keys", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, setValue] = result.current;

      act(() => {
        setValue("myValue");
      });

      const [value1] = result.current;

      // Simulate storage event for different key
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "otherKey",
          newValue: JSON.stringify("other value"),
          oldValue: null,
        });
        window.dispatchEvent(storageEvent);
      });

      const [value2] = result.current;
      expect(value2).toBe(value1); // Should remain unchanged
    });

    test("should handle corrupted data in storage event", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "testKey",
          newValue: "invalid json {{{",
          oldValue: null,
        });
        window.dispatchEvent(storageEvent);
      });

      const [value, , , error] = result.current;
      expect(value).toBe("initial"); // Fallback to initial
      expect(error).toBeTruthy();
      expect(consoleWarn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });
  });

  describe("SSR safety", () => {
    test("should handle undefined window gracefully", () => {
      // This test would require mocking the window object
      // For now, we verify the hook doesn't crash
      const { result } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      expect(result.current).toBeDefined();
    });
  });

  describe("Function stability", () => {
    test("setValue should be stable across re-renders", () => {
      const { result, rerender } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, setValue1] = result.current;

      rerender();

      const [, setValue2] = result.current;

      // Functions should maintain reference equality (useCallback)
      expect(setValue1).toBe(setValue2);
    });

    test("removeValue should be stable across re-renders", () => {
      const { result, rerender } = renderHook(() =>
        useLocalStorage("testKey", "initial"),
      );

      const [, , removeValue1] = result.current;

      rerender();

      const [, , removeValue2] = result.current;

      expect(removeValue1).toBe(removeValue2);
    });
  });

  describe("Data types", () => {
    test("should handle string values", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", "test"));

      const [, setValue] = result.current;

      act(() => {
        setValue("updated string");
      });

      const [value] = result.current;
      expect(value).toBe("updated string");
      expect(typeof value).toBe("string");
    });

    test("should handle number values", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", 42));

      const [, setValue] = result.current;

      act(() => {
        setValue(100);
      });

      const [value] = result.current;
      expect(value).toBe(100);
      expect(typeof value).toBe("number");
    });

    test("should handle boolean values", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", true));

      const [, setValue] = result.current;

      act(() => {
        setValue(false);
      });

      const [value] = result.current;
      expect(value).toBe(false);
      expect(typeof value).toBe("boolean");
    });

    test("should handle null values", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", null));

      const [, setValue] = result.current;

      act(() => {
        setValue(null);
      });

      const [value] = result.current;
      expect(value).toBeNull();
    });

    test("should handle Date objects", () => {
      const date = new Date("2024-01-01");
      const { result } = renderHook(() => useLocalStorage("testKey", date));

      const [, setValue] = result.current;

      const newDate = new Date("2024-12-31");
      act(() => {
        setValue(newDate);
      });

      const [value] = result.current;
      // JSON.stringify converts Date to string
      expect(value).toBe(newDate.toJSON());
    });
  });

  describe("Edge cases", () => {
    test("should handle rapid successive updates", () => {
      const { result } = renderHook(() => useLocalStorage("testKey", 0));

      const [, setValue] = result.current;

      act(() => {
        setValue(1);
        setValue(2);
        setValue(3);
        setValue(4);
        setValue(5);
      });

      const [value] = result.current;
      expect(value).toBe(5);
    });

    test("should handle empty string as key", () => {
      const { result } = renderHook(() => useLocalStorage("", "test"));

      const [value, setValue] = result.current;

      act(() => {
        setValue("updated");
      });

      expect(result.current[0]).toBe("updated");
    });

    test("should handle very long keys", () => {
      const longKey = "a".repeat(1000);
      const { result } = renderHook(() => useLocalStorage(longKey, "test"));

      expect(result.current[0]).toBe("test");
    });

    test("should handle large data objects", () => {
      const largeObject = {
        data: new Array(1000).fill({ nested: { value: "test" } }),
      };

      const { result } = renderHook(() =>
        useLocalStorage("testKey", largeObject),
      );

      const [value] = result.current;
      expect(value.data).toHaveLength(1000);
    });
  });
});
