import { useEffect, useRef, useState } from 'react';

export const useScrollObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Unobserve after it's been seen if once option is true
          if (options.once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0.1,
      }
    );
    
    const currentRef = elementRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.once, options.root, options.rootMargin, options.threshold]);
  
  return [elementRef, isVisible];
};