import React, { useState, useEffect, useCallback } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navLinks = [
    { name: 'What We Do', href: '#what-we-do' },
    { name: 'How We Do It', href: '#how-we-do-it' },
    { name: 'What We Deliver', href: '#what-we-deliver' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = useCallback((sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[2001] transition-all duration-300 ${
        scrolled ? 'bg-white/20 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center h-16 px-5 sm:h-20 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-full">
          {/* Logo - Left Side */}
          <a 
            href="/" 
            className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 hover:text-green-300 flex-shrink-0"
          >
            afinity
          </a>

          {/* Hamburger Button - Right Side */}
          <button 
            className="flex flex-col justify-center items-center group p-2 relative
                       w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                       rounded-lg flex-shrink-0"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block rounded transition-all duration-300 ease-out
                         w-5 h-0.5 sm:w-6 sm:h-1 md:w-8 md:h-1 lg:w-10 lg:h-1
                         ${isOpen
                           ? 'rotate-45 translate-y-0.5 sm:translate-y-1 md:translate-y-1.5 bg-green-900'
                           : `${scrolled ? 'bg-green-800' : 'bg-white'} group-hover:bg-green-600 -translate-y-1 sm:-translate-y-1.5 md:-translate-y-2`
                         }`}
            />
            <span
              className={`block rounded transition-all duration-300 ease-out
                         w-5 h-0.5 sm:w-6 sm:h-1 md:w-8 md:h-1 lg:w-10 lg:h-1
                         ${isOpen
                           ? '-rotate-45 -translate-y-0.5 sm:-translate-y-1 md:-translate-y-1.5 bg-green-900'
                           : `${scrolled ? 'bg-green-800' : 'bg-white'} group-hover:bg-green-600 translate-y-1 sm:translate-y-1.5 md:translate-y-2`
                         }`}
            />
          </button>
        </div>
      </nav>

      {/* Fullscreen Right-Side Sliding Menu */}
      <div
        className={`fixed inset-0 bg-white z-[1000] transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-full px-5 sm:px-8 md:px-12">
          <div className="w-full max-w-6xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              {navLinks.map((link, index) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-full overflow-hidden group bg-transparent
                             transition-all duration-300 whitespace-nowrap
                             focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
                             hover:scale-105 active:scale-95 transform ${
                    isOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <span className="relative z-10 text-sm sm:text-base md:text-lg lg:text-xl font-normal 
                                 transition-colors duration-300 text-black group-hover:text-green-600
                                 text-center">
                    {link.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;