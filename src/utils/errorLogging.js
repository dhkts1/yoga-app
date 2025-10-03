/**
 * Error Logging Utility
 *
 * Central utility for logging errors with context.
 * Provides foundation for future error tracking service integration (e.g., Sentry).
 */

/**
 * Log an error with context
 *
 * @param {Error} error - The error object
 * @param {Object} errorInfo - React error info (componentStack, etc.)
 * @param {Object} context - Additional context (route, user action, etc.)
 */
export const logError = (error, errorInfo = {}, context = {}) => {
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Context:', context);
    console.error('Timestamp:', new Date().toISOString());
    console.error('User Agent:', navigator.userAgent);
    console.error('Location:', window.location.href);
    console.groupEnd();
  } else {
    // In production, log less verbosely
    console.error('Error occurred:', error.message || error.toString());
  }

  // Store error in sessionStorage for debugging
  try {
    const errorLog = {
      message: error.message || error.toString(),
      stack: error.stack,
      errorInfo,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      location: window.location.href
    };

    const existingLogs = JSON.parse(sessionStorage.getItem('error-logs') || '[]');
    // Keep only last 10 errors to avoid storage issues
    const updatedLogs = [...existingLogs, errorLog].slice(-10);
    sessionStorage.setItem('error-logs', JSON.stringify(updatedLogs));
  } catch (storageError) {
    // If we can't even log the error, at least report it
    console.warn('Failed to store error log:', storageError);
  }

  // Future: Send to error tracking service
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     extra: { errorInfo, context }
  //   });
  // }
};

/**
 * Get all stored error logs
 * @returns {Array} Array of error log objects
 */
export const getErrorLogs = () => {
  try {
    return JSON.parse(sessionStorage.getItem('error-logs') || '[]');
  } catch (error) {
    console.warn('Failed to retrieve error logs:', error);
    return [];
  }
};

/**
 * Clear all stored error logs
 */
export const clearErrorLogs = () => {
  try {
    sessionStorage.removeItem('error-logs');
  } catch (error) {
    console.warn('Failed to clear error logs:', error);
  }
};

/**
 * Export error logs as downloadable JSON
 */
export const exportErrorLogs = () => {
  try {
    const logs = getErrorLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `error-logs-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Failed to export error logs:', error);
  }
};

// Make logError globally available for ErrorBoundary
if (typeof window !== 'undefined') {
  window.logError = logError;
}

export default {
  logError,
  getErrorLogs,
  clearErrorLogs,
  exportErrorLogs
};
