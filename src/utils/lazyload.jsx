import React, { Suspense, lazy } from 'react';

// Optimized lazy loading utility for components
export const lazyLoad = (importFunc, { fallback = null } = {}) => {
  const LazyComponent = lazy(() => {
    return Promise.all([
      importFunc(),
      // Add a small delay in development, but not in production
      new Promise(resolve => 
        setTimeout(resolve, process.env.NODE_ENV === 'production' ? 0 : 100)
      )
    ])
    .then(([moduleExports]) => moduleExports)
    .catch(error => {
      console.error('Error loading component:', error);
      return { default: () => <div>Error loading component</div> };
    });
  });
  
  return props => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};