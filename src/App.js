// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Home from './pages/Home';
import CustomCursor from './components/Customcursor';
import HowWeDoIt from './pages/how-we-do-it';
import WhatWeDeliver from './pages/WhatWeDeliver'; // Add this import
import Blog from './pages/Blog';
import BlogPost from './components/blogpost'; // Import the BlogPost component

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setLoading(false);
    }, process.env.NODE_ENV === 'production' ? 1500 : 3500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <Router>
      {!isMobile && <CustomCursor />}

      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-we-do-it" element={<HowWeDoIt showProcessSummary={true} />} />
          <Route path="/what-we-deliver" element={<WhatWeDeliver />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
