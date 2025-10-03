import { useCallback } from 'react';
import usePreferencesStore from '../stores/preferences';
import { translations, supportedLanguages } from '../i18n/translations';

/**
 * Translation hook for i18n support
 *
 * @returns {Object} Translation utilities
 * @returns {Function} t - Translation function t('key.path')
 * @returns {string} language - Current language code
 * @returns {Function} setLanguage - Change language
 * @returns {boolean} isRTL - Is current language RTL
 * @returns {string} dir - Direction ('ltr' or 'rtl')
 */
export default function useTranslation() {
  const { language, setLanguage } = usePreferencesStore();

  // Get current language config
  const currentLang = supportedLanguages.find(lang => lang.code === language)
    || supportedLanguages[0]; // Fallback to English

  /**
   * Translate a key path (e.g., 'screens.welcome.title')
   * Falls back to English if translation missing
   * Supports variable interpolation: t('key', { var: 'value' })
   */
  const t = useCallback((key, variables = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    // Traverse the translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let englishValue = translations.en;
        for (const k2 of keys) {
          if (englishValue && typeof englishValue === 'object' && k2 in englishValue) {
            englishValue = englishValue[k2];
          } else {
            return key; // Return key if nothing found
          }
        }
        value = englishValue;
        break;
      }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }

    // Replace variables in the string (e.g., {duration} -> 5)
    let result = value;
    for (const [varKey, varValue] of Object.entries(variables)) {
      result = result.replace(`{${varKey}}`, varValue);
    }

    return result;
  }, [language]);

  return {
    t,
    language,
    setLanguage,
    isRTL: currentLang.direction === 'rtl',
    dir: currentLang.direction
  };
}
