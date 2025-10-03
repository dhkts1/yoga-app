/**
 * OfflineErrorBoundary Component
 *
 * Specialized error boundary for handling network/offline errors.
 * Shows a calming message reassuring users their data is safe locally.
 *
 * Unlike regular ErrorBoundary, this is optimized for network failures.
 */

import React from 'react';
import { WifiOff, Home, RefreshCw } from 'lucide-react';
import { Button } from './design-system/Button';
import { Heading, Text } from './design-system/Typography';
import ContentBody from './design-system/ContentBody';

class OfflineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      isOffline: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    // Check if error is network-related
    const isNetworkError =
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('fetch') ||
      error.name === 'TypeError' && error.message?.includes('failed to fetch');

    return {
      hasError: true,
      isOffline: isNetworkError || !navigator.onLine,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log network/offline errors
    console.error('Offline/Network error caught:', error);
    console.error('Error info:', errorInfo);

    // Check online status
    this.setState({ isOffline: !navigator.onLine });

    // Log to error tracking
    if (window.logError) {
      window.logError(error, errorInfo, {
        type: 'network',
        online: navigator.onLine,
        route: window.location.pathname
      });
    }
  }

  componentDidMount() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    // Clean up event listeners
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    console.log('Network connection restored');
    this.setState({ isOffline: false });
  };

  handleOffline = () => {
    console.log('Network connection lost');
    this.setState({ isOffline: true });
  };

  handleRetry = () => {
    // Reset error state and retry
    this.setState({
      hasError: false,
      error: null
    });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.isOffline) {
      // Render offline-specific UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <ContentBody size="sm" centered>
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-6">
                  <WifiOff
                    className="h-12 w-12 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <Heading level={1} className="text-center">
                  You're offline
                </Heading>
                <Text variant="secondary" className="text-center">
                  Your practice data is saved locally and safe
                </Text>
              </div>

              {/* Reassurance */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <Text variant="small" className="text-center">
                  The app works offline! You can continue your practice, and everything will sync when you're back online.
                </Text>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  fullWidth
                  icon={<RefreshCw className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  fullWidth
                  icon={<Home className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Go Home
                </Button>
              </div>

              {/* Connection status */}
              <div className="pt-6 border-t border-border">
                <Text variant="caption" className="text-center">
                  {this.state.isOffline
                    ? 'Waiting for connection...'
                    : 'Connection restored! You can try again.'}
                </Text>
              </div>

              {/* Technical details (dev mode only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary mb-2">
                    Technical Details (Dev Only)
                  </summary>
                  <div className="bg-muted rounded-lg p-4 space-y-2 overflow-auto max-h-64">
                    <Text variant="caption" as="div">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </Text>
                    <Text variant="caption" as="div">
                      <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
                    </Text>
                  </div>
                </details>
              )}
            </div>
          </ContentBody>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default OfflineErrorBoundary;
