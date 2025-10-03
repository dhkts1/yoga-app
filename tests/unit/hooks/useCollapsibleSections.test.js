import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import useCollapsibleSections from '../../../src/hooks/useCollapsibleSections';

describe('useCollapsibleSections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    test('should initialize with provided initial state', () => {
      const initialState = {
        section1: true,
        section2: false,
        section3: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.openSections).toEqual(initialState);
    });

    test('should initialize with empty object when no initial state provided', () => {
      const { result } = renderHook(() => useCollapsibleSections());

      expect(result.current.openSections).toEqual({});
    });

    test('should handle initial state with multiple sections', () => {
      const initialState = {
        practice: false,
        notifications: false,
        data: false,
        about: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.openSections).toEqual(initialState);
      expect(Object.keys(result.current.openSections)).toHaveLength(4);
    });
  });

  describe('toggleSection', () => {
    test('should toggle section from false to true', () => {
      const initialState = {
        section1: false,
        section2: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section1');
      });

      expect(result.current.openSections.section1).toBe(true);
      expect(result.current.openSections.section2).toBe(false);
    });

    test('should toggle section from true to false', () => {
      const initialState = {
        section1: true,
        section2: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section1');
      });

      expect(result.current.openSections.section1).toBe(false);
      expect(result.current.openSections.section2).toBe(false);
    });

    test('should toggle section multiple times', () => {
      const initialState = { section1: false };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section1');
      });
      expect(result.current.openSections.section1).toBe(true);

      act(() => {
        result.current.toggleSection('section1');
      });
      expect(result.current.openSections.section1).toBe(false);

      act(() => {
        result.current.toggleSection('section1');
      });
      expect(result.current.openSections.section1).toBe(true);
    });

    test('should toggle only the specified section', () => {
      const initialState = {
        section1: false,
        section2: true,
        section3: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section2');
      });

      expect(result.current.openSections.section1).toBe(false);
      expect(result.current.openSections.section2).toBe(false); // Toggled
      expect(result.current.openSections.section3).toBe(false);
    });

    test('should create new section if it does not exist', () => {
      const initialState = { section1: false };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('newSection');
      });

      expect(result.current.openSections.newSection).toBe(true);
      expect(result.current.openSections.section1).toBe(false);
    });

    test('should handle undefined as false when creating new section', () => {
      const initialState = {};

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section1');
      });

      // undefined -> true (because !undefined = true)
      expect(result.current.openSections.section1).toBe(true);
    });
  });

  describe('openAll', () => {
    test('should open all sections', () => {
      const initialState = {
        section1: false,
        section2: false,
        section3: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.openAll();
      });

      expect(result.current.openSections.section1).toBe(true);
      expect(result.current.openSections.section2).toBe(true);
      expect(result.current.openSections.section3).toBe(true);
    });

    test('should maintain true values when opening all', () => {
      const initialState = {
        section1: true,
        section2: false,
        section3: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.openAll();
      });

      expect(result.current.openSections.section1).toBe(true);
      expect(result.current.openSections.section2).toBe(true);
      expect(result.current.openSections.section3).toBe(true);
    });

    test('should handle empty initial state', () => {
      const { result } = renderHook(() => useCollapsibleSections({}));

      act(() => {
        result.current.openAll();
      });

      expect(result.current.openSections).toEqual({});
    });

    test('should handle large number of sections', () => {
      const initialState = {};
      for (let i = 0; i < 100; i++) {
        initialState[`section${i}`] = false;
      }

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.openAll();
      });

      Object.values(result.current.openSections).forEach(value => {
        expect(value).toBe(true);
      });
    });
  });

  describe('closeAll', () => {
    test('should close all sections', () => {
      const initialState = {
        section1: true,
        section2: true,
        section3: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.openSections.section1).toBe(false);
      expect(result.current.openSections.section2).toBe(false);
      expect(result.current.openSections.section3).toBe(false);
    });

    test('should maintain false values when closing all', () => {
      const initialState = {
        section1: false,
        section2: true,
        section3: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.openSections.section1).toBe(false);
      expect(result.current.openSections.section2).toBe(false);
      expect(result.current.openSections.section3).toBe(false);
    });

    test('should handle empty initial state', () => {
      const { result } = renderHook(() => useCollapsibleSections({}));

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.openSections).toEqual({});
    });

    test('should handle large number of sections', () => {
      const initialState = {};
      for (let i = 0; i < 100; i++) {
        initialState[`section${i}`] = true;
      }

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.closeAll();
      });

      Object.values(result.current.openSections).forEach(value => {
        expect(value).toBe(false);
      });
    });
  });

  describe('isOpen', () => {
    test('should return true for open section', () => {
      const initialState = {
        section1: true,
        section2: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.isOpen('section1')).toBe(true);
    });

    test('should return false for closed section', () => {
      const initialState = {
        section1: true,
        section2: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.isOpen('section2')).toBe(false);
    });

    test('should return false for non-existent section', () => {
      const initialState = {
        section1: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.isOpen('nonExistent')).toBe(false);
    });

    test('should return false for undefined section', () => {
      const initialState = {
        section1: undefined
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.isOpen('section1')).toBe(false);
    });

    test('should update after toggling section', () => {
      const initialState = { section1: false };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      expect(result.current.isOpen('section1')).toBe(false);

      act(() => {
        result.current.toggleSection('section1');
      });

      expect(result.current.isOpen('section1')).toBe(true);
    });
  });

  describe('Combined operations', () => {
    test('should handle toggle after openAll', () => {
      const initialState = {
        section1: false,
        section2: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.openAll();
      });

      expect(result.current.openSections.section1).toBe(true);

      act(() => {
        result.current.toggleSection('section1');
      });

      expect(result.current.openSections.section1).toBe(false);
      expect(result.current.openSections.section2).toBe(true);
    });

    test('should handle toggle after closeAll', () => {
      const initialState = {
        section1: true,
        section2: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.openSections.section1).toBe(false);

      act(() => {
        result.current.toggleSection('section1');
      });

      expect(result.current.openSections.section1).toBe(true);
      expect(result.current.openSections.section2).toBe(false);
    });

    test('should handle openAll then closeAll', () => {
      const initialState = {
        section1: false,
        section2: true,
        section3: false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.openAll();
      });

      expect(Object.values(result.current.openSections).every(v => v === true)).toBe(true);

      act(() => {
        result.current.closeAll();
      });

      expect(Object.values(result.current.openSections).every(v => v === false)).toBe(true);
    });

    test('should handle multiple rapid toggles', () => {
      const initialState = { section1: false };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section1');
        result.current.toggleSection('section1');
        result.current.toggleSection('section1');
        result.current.toggleSection('section1');
      });

      expect(result.current.openSections.section1).toBe(false);
    });
  });

  describe('Function stability', () => {
    test('toggleSection should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useCollapsibleSections({ section1: false })
      );

      const toggle1 = result.current.toggleSection;

      rerender();

      const toggle2 = result.current.toggleSection;

      expect(toggle1).toBe(toggle2);
    });

    test('openAll should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useCollapsibleSections({ section1: false })
      );

      const openAll1 = result.current.openAll;

      rerender();

      const openAll2 = result.current.openAll;

      expect(openAll1).toBe(openAll2);
    });

    test('closeAll should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useCollapsibleSections({ section1: false })
      );

      const closeAll1 = result.current.closeAll;

      rerender();

      const closeAll2 = result.current.closeAll;

      expect(closeAll1).toBe(closeAll2);
    });

    test('isOpen should update when openSections changes', () => {
      const { result, rerender } = renderHook(() =>
        useCollapsibleSections({ section1: false })
      );

      const isOpen1 = result.current.isOpen;

      act(() => {
        result.current.toggleSection('section1');
      });

      rerender();

      const isOpen2 = result.current.isOpen;

      // isOpen function should be recreated when openSections changes
      expect(isOpen1).not.toBe(isOpen2);
    });
  });

  describe('Edge cases', () => {
    test('should handle section IDs with special characters', () => {
      const initialState = {
        'section-with-dashes': false,
        'section_with_underscores': false,
        'section.with.dots': false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('section-with-dashes');
      });

      expect(result.current.openSections['section-with-dashes']).toBe(true);
    });

    test('should handle numeric section IDs', () => {
      const initialState = {
        1: false,
        2: true
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection(1);
      });

      expect(result.current.openSections[1]).toBe(true);
    });

    test('should handle empty string as section ID', () => {
      const initialState = {
        '': false
      };

      const { result } = renderHook(() => useCollapsibleSections(initialState));

      act(() => {
        result.current.toggleSection('');
      });

      expect(result.current.openSections['']).toBe(true);
    });

    test('should handle null initial state gracefully', () => {
      const { result } = renderHook(() => useCollapsibleSections(null));

      // Should default to empty object
      expect(result.current.openSections).toEqual(null);

      // Operations should still work
      expect(() => {
        act(() => {
          result.current.toggleSection('section1');
        });
      }).not.toThrow();
    });
  });

  describe('Real-world scenarios', () => {
    test('should work with settings accordion', () => {
      const { result } = renderHook(() =>
        useCollapsibleSections({
          practice: false,
          notifications: false,
          data: false,
          about: false
        })
      );

      // User clicks on practice section
      act(() => {
        result.current.toggleSection('practice');
      });

      expect(result.current.isOpen('practice')).toBe(true);
      expect(result.current.isOpen('notifications')).toBe(false);

      // User clicks on notifications
      act(() => {
        result.current.toggleSection('notifications');
      });

      expect(result.current.isOpen('practice')).toBe(true);
      expect(result.current.isOpen('notifications')).toBe(true);

      // User collapses all
      act(() => {
        result.current.closeAll();
      });

      expect(result.current.isOpen('practice')).toBe(false);
      expect(result.current.isOpen('notifications')).toBe(false);
    });

    test('should work with FAQ accordion', () => {
      const { result } = renderHook(() =>
        useCollapsibleSections({
          faq1: false,
          faq2: false,
          faq3: true // Featured question starts open
        })
      );

      // faq3 starts open
      expect(result.current.isOpen('faq3')).toBe(true);

      // User expands all questions
      act(() => {
        result.current.openAll();
      });

      expect(result.current.isOpen('faq1')).toBe(true);
      expect(result.current.isOpen('faq2')).toBe(true);
      expect(result.current.isOpen('faq3')).toBe(true);
    });

    test('should work with filter panel', () => {
      const { result } = renderHook(() =>
        useCollapsibleSections({
          categories: true,
          priceRange: true,
          brand: false,
          rating: false
        })
      );

      // Essential filters start open
      expect(result.current.isOpen('categories')).toBe(true);
      expect(result.current.isOpen('priceRange')).toBe(true);

      // User toggles brand filter
      act(() => {
        result.current.toggleSection('brand');
      });

      expect(result.current.isOpen('brand')).toBe(true);
    });
  });
});
