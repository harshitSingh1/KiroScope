//frontend\src\components\GraphErrorBoundary.jsx
import React from 'react';

class GraphErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Graph Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#ef4444'
        }}>
          <h3>⚠️ Graph Rendering Error</h3>
          <p>There was an issue displaying the architecture graph.</p>
          <details style={{ 
            backgroundColor: '#fef2f2', 
            padding: '1rem', 
            margin: '1rem 0',
            borderRadius: '4px',
            textAlign: 'left'
          }}>
            <summary>Error Details</summary>
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GraphErrorBoundary;