import React, { useEffect, useState } from 'react';
import { lazyLoad } from '../utils/lazyload';
import Navbar from '../components/Navbar';
import Lenis from '@studio-freight/lenis';

// Lazy load components
const VideoSection = lazyLoad(() => import('../components/VideoSection'), {
  fallback: <div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading...</div>
});

const BoxesGrid = lazyLoad(() => import('../components/BoxesGrid'), {
  fallback: <div className="w-full min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
});

const Footer = lazyLoad(() => import('../components/Footer'), {
  fallback: <div className="w-full h-64 flex items-center justify-center bg-black text-white">Loading...</div>
});

const Home = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [scrollLocked, setScrollLocked] = useState(false);

  useEffect(() => {
    const sectionOrder = ['hero', 'grid-section', 'contact'];

    const scrollToSection = (sectionId) => {
      if (scrollLocked) return;
      const section = document.getElementById(sectionId);
      if (!section) return;

      setScrollLocked(true);

      if (window.lenis) {
        window.lenis.scrollTo(section, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            setCurrentSection(sectionId);
            setTimeout(() => setScrollLocked(false), 500);
          }
        });
      } else {
        section.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(sectionId);
        setTimeout(() => setScrollLocked(false), 1000);
      }
    };

    const handleWheel = (e) => {
      if (scrollLocked) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const currentIndex = sectionOrder.indexOf(currentSection);
      const nextIndex = currentIndex + direction;

      if (nextIndex >= 0 && nextIndex < sectionOrder.length) {
        e.preventDefault();
        scrollToSection(sectionOrder[nextIndex]);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (scrollLocked) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      const threshold = 50;

      const direction = diff > threshold ? 1 : diff < -threshold ? -1 : 0;
      if (direction !== 0) {
        const currentIndex = sectionOrder.indexOf(currentSection);
        const nextIndex = currentIndex + direction;

        if (nextIndex >= 0 && nextIndex < sectionOrder.length) {
          e.preventDefault();
          scrollToSection(sectionOrder[nextIndex]);
        }
      }
    };

    const observerOptions = {
      root: null,
      threshold: 0.6 // Ensures section is at least 60% visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !scrollLocked) {
          setCurrentSection(entry.target.id);
        }
      });
    }, observerOptions);

    const hero = document.getElementById('hero');
    const grid = document.getElementById('grid-section');
    const contact = document.getElementById('contact');

    if (hero) sectionObserver.observe(hero);
    if (grid) sectionObserver.observe(grid);
    if (contact) sectionObserver.observe(contact);

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      sectionObserver.disconnect();
    };
  }, [currentSection, scrollLocked]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <section id="hero" className="h-screen">
          <VideoSection />
        </section>
        <section id="grid-section" className="min-h-screen">
          <BoxesGrid />
        </section>
        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Home;
