import { useState, useCallback } from "react";

/**
 * useCollapsibleSections Hook
 *
 * Manages state for collapsible/accordion UI sections with support for individual
 * toggle, open all, close all, and state checking operations.
 *
 * @param {Object} initialState - Initial open/closed state for sections
 *   Example: { section1: true, section2: false, section3: false }
 *
 * @returns {Object} Accordion state and control methods
 *   - openSections: Current state object (section IDs mapped to boolean open/closed)
 *   - toggleSection: (sectionId: string) => void - Toggle individual section
 *   - openAll: () => void - Open all sections
 *   - closeAll: () => void - Close all sections
 *   - isOpen: (sectionId: string) => boolean - Check if section is open
 *
 * @example
 * // Settings screen with multiple collapsible sections
 * function Settings() {
 *   const { openSections, toggleSection, openAll, closeAll, isOpen } = useCollapsibleSections({
 *     practice: false,
 *     notifications: false,
 *     data: false,
 *     about: false
 *   });
 *
 *   return (
 *     <>
 *       <button onClick={openAll}>Expand All</button>
 *       <button onClick={closeAll}>Collapse All</button>
 *
 *       <SettingsSection
 *         id="practice"
 *         title="Practice Settings"
 *         isOpen={openSections.practice}
 *         onToggle={() => toggleSection('practice')}
 *       >
 *         Content here...
 *       </SettingsSection>
 *     </>
 *   );
 * }
 *
 * @example
 * // FAQ page with expandable questions
 * function FAQ() {
 *   const { openSections, toggleSection, isOpen } = useCollapsibleSections({
 *     faq1: false,
 *     faq2: false,
 *     faq3: true // This question starts expanded
 *   });
 *
 *   return (
 *     <div>
 *       {faqs.map(faq => (
 *         <Accordion
 *           key={faq.id}
 *           isOpen={isOpen(faq.id)}
 *           onToggle={() => toggleSection(faq.id)}
 *         >
 *           {faq.answer}
 *         </Accordion>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * @example
 * // Filter panel with collapsible categories
 * function FilterPanel() {
 *   const { openSections, toggleSection, closeAll } = useCollapsibleSections({
 *     categories: true,
 *     priceRange: true,
 *     brand: false,
 *     rating: false
 *   });
 *
 *   return (
 *     <aside>
 *       <button onClick={closeAll}>Collapse All Filters</button>
 *       <FilterSection
 *         title="Categories"
 *         isOpen={openSections.categories}
 *         onToggle={() => toggleSection('categories')}
 *       />
 *     </aside>
 *   );
 * }
 */
function useCollapsibleSections(initialState = {}) {
  const [openSections, setOpenSections] = useState(initialState || {});

  /**
   * Toggle a single section's open/closed state
   * @param {string} sectionId - Unique identifier for the section
   */
  const toggleSection = useCallback((sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  /**
   * Open all sections
   */
  const openAll = useCallback(() => {
    setOpenSections((prev) => {
      const allOpen = {};
      Object.keys(prev).forEach((key) => {
        allOpen[key] = true;
      });
      return allOpen;
    });
  }, []);

  /**
   * Close all sections
   */
  const closeAll = useCallback(() => {
    setOpenSections((prev) => {
      const allClosed = {};
      Object.keys(prev).forEach((key) => {
        allClosed[key] = false;
      });
      return allClosed;
    });
  }, []);

  /**
   * Check if a specific section is open
   * @param {string} sectionId - Unique identifier for the section
   * @returns {boolean} True if section is open, false otherwise
   */
  const isOpen = useCallback(
    (sectionId) => {
      return openSections[sectionId] === true;
    },
    [openSections],
  );

  return {
    openSections,
    toggleSection,
    openAll,
    closeAll,
    isOpen,
  };
}

export default useCollapsibleSections;
