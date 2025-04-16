import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Define types for preload resource links
interface PreloadResource {
  rel: string;
  href: string;
  as: string;
  type?: string;
  crossOrigin?: string;
}

// Preload critical resources
const preloadResources = () => {
  // Create link elements to preload important images or fonts
  const links: PreloadResource[] = [
    // Example: { rel: 'preload', href: '/fonts/Inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
  ];
  
  links.forEach(attrs => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => {
      if (value) {
        // @ts-ignore - Dynamic assignment is safe here
        link[key] = value;
      }
    });
    document.head.appendChild(link);
  });
};

// Optimize rendering with concurrent mode
const initApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root element not found');
    return;
  }
  
  // Create root using concurrent mode
  const root = createRoot(container);
  
  // Render with error boundary
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering application:', error);
    root.render(
      <div className="error-boundary">
        <h1>Something went wrong</h1>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
};

// Implement performance monitoring
const monitorPerformance = () => {
  // Simple performance monitoring
  if (import.meta.env.PROD && window.performance) {
    // Log navigation timing metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.info(`Page load time: ${pageLoadTime}ms`);
      }, 0);
    });
  }
};

// Initialize app based on browser capabilities
if (document.readyState === 'loading') {
  // Document still loading, wait for it
  document.addEventListener('DOMContentLoaded', () => {
    preloadResources();
    initApp();
    monitorPerformance();
  });
} else {
  // Document already loaded
  preloadResources();
  initApp();
  monitorPerformance();
}

// Add error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Could add error reporting service here
});
