import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BoxesGrid = () => {
  const sectionRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (e, path) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(path);
  };

  const gridItems = [
    { id: 1, title: "WHAT WE DO", description: "Learn about our services and offerings" },
    { 
      id: 2, 
      title: "HOW WE DO IT", 
      description: "Discover our innovative process and methodology",
      path: '/how-we-do-it'
    },
    { 
      id: 3, 
      title: "WHAT WE DELIVER", 
      description: "See our solutions and deliverables",
      path: '/what-we-deliver'
    },
    { id: 4, title: "TEAM", description: "Meet our talented professionals" },
    { id: 5, title: "COVID-19 RESOURCES", description: "Access important health information" },
    { id: 6, title: "PARTNERS", description: "Our trusted collaborators and affiliates" },
    { id: 7, title: "THE NEWSROOM", description: "Latest updates and press releases" },
    { 
      id: 8, 
      title: "Blog", 
      description: "Explore our blog content",
      path: '/blog'  // ensure this is lowercase
    },
    { id: 9, title: "DON'T CLICK THIS", description: "Just kidding, you can click it!" },
  ];

  // Preload the image with priority
  React.useEffect(() => {
    const img = new Image();
    img.src = './pictures/kk.jpg';
    img.fetchPriority = 'high';
    img.loading = 'eager';
    img.onload = () => setImageError(false);
    img.onerror = () => {
      console.error('Failed to load image');
      setImageError(true);
    };
  }, []);

  return (
    <div
      id="grid-section"
      ref={sectionRef}
      className="relative w-full h-screen pt-16 sm:pt-20"
    >
      {/* Background image with loading optimization */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center z-0 ${imageError ? 'bg-gray-900' : ''}`}
        style={{
          backgroundImage: "url('./pictures/kk.jpg')",
          willChange: 'transform',
          transform: 'translateZ(0)',
          top: 0
        }}
      >
        <div className="absolute inset-0 bg-black/10 z-10" />
        {/* Preload image tag */}
        <link
          rel="preload"
          as="image"
          href="./pictures/kk.jpg"
          fetchpriority="high"
        />
      </div>

      {/* Grid container with performance optimizations */}
      <div 
        className="relative z-20 w-full h-full grid grid-cols-3 grid-rows-3"
      >
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`border border-white/60 flex items-center justify-center transition-all duration-300 group p-4 hover:bg-green-300/30 ${item.path ? 'cursor-pointer' : ''}`}
            onClick={item.path ? (e) => handleNavigation(e, item.path) : undefined}
          >
            <div className="text-center">
              <h3 className="text-white text-xl font-medium transform transition-transform duration-300 group-hover:scale-150">
                {item.title}
              </h3>
              <p className="text-white/90 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.description}
              </p>
              {item.path && (
                <button 
                  onClick={(e) => handleNavigation(e, item.path)}
                  className="mt-4 px-6 py-2 bg-green-500/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-500/40"
                >
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxesGrid;
