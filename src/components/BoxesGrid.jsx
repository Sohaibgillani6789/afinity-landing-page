import React, { useRef } from 'react';

const BoxesGrid = () => {
  const sectionRef = useRef(null);

  const gridItems = [
    { id: 1, title: "WHAT WE DO", description: "Learn about our services and offerings" },
    { id: 2, title: "HOW IT WORKS", description: "Discover our process and methodology" },
    { id: 3, title: "WHERE IT WORKS", description: "See our locations and coverage areas" },
    { id: 4, title: "TEAM", description: "Meet our talented professionals" },
    { id: 5, title: "COVID-19 RESOURCES", description: "Access important health information" },
    { id: 6, title: "PARTNERS", description: "Our trusted collaborators and affiliates" },
    { id: 7, title: "THE NEWSROOM", description: "Latest updates and press releases" },
    { id: 8, title: "CINEMA", description: "Explore our video content and productions" },
    { id: 9, title: "DON'T CLICK THIS", description: "Just kidding, you can click it!" },
  ];

  return (
    <div
      id="grid-section"
      ref={sectionRef}
      className="relative w-full min-h-screen pt-20" // pt-20 = 80px assuming that's your navbar height
    >
      {/* Background image */}
      <div
        className="absolute inset-0 w-full min-h-screen bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/pictures/kk.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      {/* Grid container */}
      <div className="relative z-20 w-full grid grid-cols-1 md:grid-cols-3 grid-rows-3 min-h-screen">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className="border border-white/60 flex items-center justify-center transition-all duration-300 group p-4 hover:bg-green-300/30"
          >
            <div className="text-center">
              <h3 className="text-white text-base sm:text-lg md:text-xl font-medium transform transition-transform duration-300 group-hover:scale-150">
                {item.title}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxesGrid;
