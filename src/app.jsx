// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Home from './pages/Home';
import CustomCursor from './components/Customcursor';
import WhereItWorks from './pages/WhereItWorks'; // Updated import based on your provided code
import WhatWeDeliver from './pages/WhatWeDeliver';
import Blog from './pages/Blog';
import BlogPost from './components/blogpost'; // Import the BlogPost component
import 'lenis/dist/lenis.css';


const App = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // This useEffect seems to be empty or for debug logging that's now commented out.
  // Keeping it as is from your provided code, but it's not performing any active logic.
  useEffect(() => {
    // Add debug logging
  }, []);

  // This useEffect also seems empty.
  useEffect(() => {
  }, []);

  useEffect(() => {
    // Check if the device is mobile/touch
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Reduce loader time in production
    const timer = setTimeout(() => {
      setLoading(false);
    }, process.env.NODE_ENV === 'production' ? 1500 : 3500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <Router>
      {/* Only show custom cursor on non-mobile devices */}
      {!isMobile && <CustomCursor />}
      
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          {/* Add the route for individual blog posts using the :slug parameter */}
          <Route path="/blog/:slug" element={<BlogPost />} /> 
          <Route path="/what-we-deliver" element={<WhatWeDeliver />} />
          <Route path="/how-we-do-it" element={<WhereItWorks />} /> {/* Route updated to WhereItWorks */}
          
          <Route
            path="*"
            element={
              <>
                {console.log('No route match for:', window.location.pathname)}
                <Navigate to="/" replace />
              </>
            }
          />
        </Routes>
      )}
    </Router>
  );
};

export default App;
