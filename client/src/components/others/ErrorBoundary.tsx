import React, { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
  componentName: string;
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with component name
    console.error(`Error in component: ${this.props.componentName}`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI with component name
      return (
        <div className="text-red-600">
          <h1>
            Something went wrong in <strong>{this.props.componentName}</strong>. Please try again later.
          </h1>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
