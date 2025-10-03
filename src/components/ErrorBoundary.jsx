/**
 * ErrorBoundary Component
 *
 * Catches errors in child components and displays a user-friendly error UI.
 * Prevents crashes from propagating and breaking the entire app.
 *
 * Must be a class component (React requirement for error boundaries).
 */

import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from './design-system/Button';
import { Heading, Text } from './design-system/Typography';
import ContentBody from './design-system/ContentBody';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Store error info in state
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log to error tracking utility (only in production)
    if (process.env.NODE_ENV === 'production' && window.logError) {
      window.logError(error, errorInfo, {
        route: window.location.pathname,
        errorCount: this.state.errorCount + 1
      });
    }
  }

  handleReset = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <ContentBody size="sm" centered>
            <div className="space-y-6 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="rounded-full bg-accent/10 p-6">
                  <AlertTriangle
                    className="size-12 text-accent"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <Heading level={1} className="text-center">
                  Something went wrong
                </Heading>
                <Text variant="secondary" className="text-center">
                  Don't worry, your practice data is safe
                </Text>
              </div>

              {/* Error count indicator (helpful for debugging) */}
              {this.state.errorCount > 1 && (
                <Text variant="caption" className="text-center">
                  This error has occurred {this.state.errorCount} times
                </Text>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  fullWidth
                  icon={<RefreshCw className="size-5" />}
                  iconPosition="left"
                >
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  fullWidth
                  icon={<Home className="size-5" />}
                  iconPosition="left"
                >
                  Go Home
                </Button>
              </div>

              {/* Helpful guidance */}
              <div className="border-t border-border pt-6">
                <Text variant="caption" className="text-center">
                  If this keeps happening, try refreshing the page or clearing your browser cache
                </Text>
              </div>
            </div>
          </ContentBody>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
