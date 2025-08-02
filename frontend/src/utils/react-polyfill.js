/**
 * React 18 Polyfill for the 'use' hook
 * This provides compatibility for libraries expecting React 19 features
 */
import React from 'react';

// Polyfill for React.use() hook for React 18 compatibility
function usePolyfill(promise) {
  // If React already has the use hook, don't override it
  if (React.use) {
    return React.use(promise);
  }
  
  // For React 18, throw the promise to work with Suspense
  if (promise && typeof promise.then === 'function') {
    throw promise; // This will be caught by Suspense
  }
  
  // If it's not a promise, just return the value
  return promise;
}

// Apply polyfill to React if 'use' is not available
if (!React.use) {
  React.use = usePolyfill;
}

export default React;
