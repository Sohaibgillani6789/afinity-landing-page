import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

// Accept showProcessSummary as a prop
const HowWeDoIt = ({ showProcessSummary = true }) => { // Default to true for existing behavior
  const [activeSection, setActiveSection] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); // Set default to true
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const lastScrollY = useRef(0); // Not directly used with Lenis for scroll tracking, but kept for context if needed elsewhere
  const blueSectionRef = useRef(null);
  const whiteBackgroundRef = useRef(null);
  const navigate = useNavigate();

  // Define section titles
  const sectionTitles = [
    'Overview',
    'The Science Behind Afiniti',
    'Data Integration',
    'Pattern Recognition',
    'Results & Impact',
    'Process Summary', // This section will be conditionally rendered
    'Afiniti University'
  ];

  const processSteps = [
    {
      id: 'strategic',
      title: 'Strategic Planning',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 'data',
      title: 'Data Discovery & Modeling',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      id: 'telephony',
      title: 'Telephony Integration',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
    },
    {
      id: 'testing',
      title: 'Lab Testing',
      content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
    },
    {
      id: 'deployment',
      title: 'Deployment',
      content: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
    },
    {
      id: 'optimization',
      title: 'Optimization',
      content: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit.'
    }
  ];

  // Adjust sectionTitles based on the prop
  const visibleSectionTitles = showProcessSummary
    ? sectionTitles
    : sectionTitles.filter(title => title !== 'Process Summary');

  // --- Lenis Initialization ---
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Function to run on each animation frame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }


    requestAnimationFrame(raf);

  
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Intersection Observer for Sections ---
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -80% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = parseInt(entry.target.dataset.sectionIndex);
          // If Process Summary is hidden, adjust index for sections following it
          let actualSectionIndex = sectionIndex;
          if (!showProcessSummary && sectionIndex >= 5) { // Assuming "Process Summary" was index 5
            actualSectionIndex = sectionIndex - 1;
          }
          setActiveSection(actualSectionIndex);

          // This logic might need refinement if you want the header to appear/disappear differently
          if (actualSectionIndex === 0) {
            setShowHeader(true);
          }
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      sections.forEach(section => {
        sectionObserver.unobserve(section);
      });
    };
  }, [showProcessSummary]); // Add showProcessSummary to dependencies

  // --- Intersection Observer for Header/Navbar Visibility ---
  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        // When blue section is visible, show fixed elements
        setShowNavbar(entry.isIntersecting);
        setShowHeader(!entry.isIntersecting); // Show header only when blue section is not visible
      },
      {
        threshold: 0.1,
        rootMargin: "-10px 0px 0px 0px"
      }
    );

    if (blueSectionRef.current) {
      headerObserver.observe(blueSectionRef.current);
    }

    return () => headerObserver.disconnect();
  }, []);

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/', { state: { slideDirection: 'left' } });
  };

  const handleSectionChange = (index) => {
    // Adjust target index if 'Process Summary' is hidden
    let targetIndex = index;
    if (!showProcessSummary && index >= 5) { // If 'Process Summary' (index 5) is hidden
      targetIndex = index + 1; // Skip the hidden section's original index for actual DOM element index
    }
    setActiveSection(index); // Still set active section based on the visible list index

    const targetSection = document.querySelector(`[data-section-index="${targetIndex}"]`);
    if (targetSection) {
    
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  
    }

    if (isOpen) {
      toggleMenu();
    }
  };


  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setShowNavbar(!showNavbar);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Slider handlers
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === 3 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? 3 : prev - 1));
  };

  return (
    <>
      {/*
    
      */}
      <div className="relative min-h-screen">

   
        {showNavbar && (
          <div className="fixed top-0 left-0 right-0 z-[1010]"> {/* Ensure high z-index */}
          
            <Navbar noBlur />


          </div>
        )}

   
        {showNavbar && (
          <>
            <h3
              onClick={handleBackToHome}
              className="fixed bottom-40 left-8 md:left-24 text-white text-lg cursor-pointer hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group z-40"
              style={{ zIndex: 1000 }} // Explicitly set z-index
            >
              <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
              Back to Home
            </h3>

            <h1
              className='fixed bottom-24 left-4 md:left-24 text-white text-3xl font-["Josefin_Sans"] font-light z-40'
              style={{ zIndex: 1000 }} // Explicitly set z-index
            >
              HOW WE DO IT
            </h1>
          </>
        )}

        {/* Main Content Container - This is the element that Lenis will effectively control for scrolling. */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.5 }}
          className=""
        >
          {/* First Section - Dark Blue Background */}
          <section
            ref={blueSectionRef}
            className="relative min-h-screen bg-[#070c24] flex flex-col items-center justify-center"
          >
            {/* The line animation is fine here */}
            <div className="absolute left-1/2 bottom-1 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-[1px] h-24 bg-white/20 relative overflow-hidden">
                <motion.div
                  className="w-full h-full bg-white"
                  animate={{
                    y: ['-100%', '100%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>
          </section>

          {/* White Background Sections */}
          <div ref={whiteBackgroundRef} className="relative bg-white">
            {/* Fixed Header */}
            <div
              className={`sticky top-0 z-30 bg-white py-4 transition-opacity duration-300
              ${showHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              {/* Header Title - Middle */}
              <motion.h1
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-['Josefin_Sans'] text-black text-center mb-4 font-light"
              >
                {visibleSectionTitles[activeSection]}
              </motion.h1>

              {/* Navigation dots - Bottom */}
              <div className="flex justify-center gap-2">
                {visibleSectionTitles.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300`}
                    animate={{
                      backgroundColor: index === activeSection ? '#ec4899' : '#d1d5db',
                      scale: index === activeSection ? 1.2 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionChange(index);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content Sections */}
            {/* Section 1: Overview */}
            <section data-section-index="0" className="content-section min-h-screen relative pt-1">
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-2">
                <h1 className="text-4xl font-['Josefin_Sans'] text-pink-300 mb-20 top-4 font-light">Overview</h1>
                <h2 className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl text-center mb-16">
                  Afiniti Enterprise Behavioral Pairing™ discovers and predicts patterns of interpersonal behavior to optimally pair customers with agents.
                </h2>
                <p className="text-gray-700 max-w-2xl text-center leading-relaxed mb-16">
                  With over 150 patents, Afiniti's technology examines data and commercially available information tied to customer identity to determine patterns of successful behavioral interactions and applies these patterns in real time to drive improvements in health, enterprise profitability, and customer satisfaction.
                </p>
                <div className="w-full max-w-xl h-[400px] mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src="https://res.cloudinary.com/ddzllbqlv/video/upload/v1748342620/zjtzamruh1ztnsjntam7.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </section>

            {/* Section 2: The Science Behind Afiniti */}
            <section data-section-index="1" className="content-section min-h-screen relative pt-18">
              <h1 className="text-4xl font-serif text-pink-300 mb-16 text-center">The Science Behind Afiniti</h1>
              <div className="flex flex-col max-w-7xl mx-auto px-6 pb-20 gap-16">
                <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                  <div className="w-full md:w-1/2 space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-light text-gray-700">The Process</h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        In this process we combine interaction-level outcomes data from our clients with hundreds of internal and external databases through highly complex data joins in order to build a rich contextual data source for each interaction. Using this data, Afiniti deploys specialized machine learning techniques to identify behavioral patterns in customer-representative interactions that lead to success.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        src="path-to-your-second-video.mp4"
                        poster="/path-to-your-thumbnail.jpg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                  <div className="w-full md:w-1/2 space-y-8 md:order-2">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-light text-gray-700">The Results</h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Through this innovative approach, we've achieved remarkable improvements in customer satisfaction and business outcomes. Our AI-driven pairing technology continuously learns and adapts, ensuring optimal matches between customers and agents while driving measurable value for our clients.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 md:order-1">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        src="path-to-your-second-video-2.mp4"
                        poster="/path-to-your-thumbnail-2.jpg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Data Integration */}
            <section data-section-index="2" className="content-section min-h-screen relative pt-19">
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                <h1 className="text-4xl font-['Josefin_Sans'] text-pink-300 mb-12">Data Integration</h1>
                <h2 className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl text-center mb-16">
                  Our data integration process seamlessly combines multiple data sources to create comprehensive behavioral profiles that drive intelligent pairing decisions.
                </h2>
                <p className="text-gray-700 max-w-2xl text-center leading-relaxed mb-16">
                  By leveraging advanced data engineering techniques, we process millions of data points in real-time, ensuring that every customer interaction is optimized based on the most current and relevant information available.
                </p>
                <div className="w-full max-w-xl h-[400px] mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden mb-40">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src="path-to-your-third-video.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </section>

            {/* Section 4: Pattern Recognition */}
            <section data-section-index="3" className="content-section min-h-screen relative pt-18 bg-pink-0">
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                <h1 className="text-4xl font-['Josefin_Sans'] text-pink-300 mb-12 ">Pattern Recognition</h1>
                <h2 className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl text-center mb-16">
                  Our proprietary machine learning algorithms identify subtle patterns in human behavior that traditional systems miss, uncovering the hidden dynamics that make interactions successful.
                </h2>
                <p className="text-gray-700 max-w-2xl text-center leading-relaxed mb-16">
                  Through continuous learning and adaptation, our models become increasingly sophisticated, recognizing complex behavioral patterns that predict positive outcomes across diverse industries and use cases.
                </p>
                <div className="flex flex-col md:flex-row gap-8 justify-center w-full md:w-auto">
                  <div className="w-full md:w-[450px] md:h-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      src="path-to-your-fourth-video.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="w-full md:w-[450px] aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      src="path-to-your-additional-video.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Results & Impact */}
            <section data-section-index="4" className="content-section min-h-screen relative pt-18">
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                <h1 className="text-4xl font-['Josefin_Sans'] text-pink-300 mb-12">Results & Impact</h1>
                <h2 className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl text-center mb-16">
                  Organizations using Afiniti see measurable improvements in key business metrics, from increased sales and customer satisfaction to reduced churn and operational costs.
                </h2>
                <p className="text-gray-700 max-w-2xl text-center leading-relaxed mb-16">
                  Our proven track record spans multiple industries, with Fortune 500 companies experiencing significant ROI through the power of behavioral pairing technology that transforms every interaction into an opportunity for success.
                </p>
                <div className="w-full max-w-xl h-[400px] mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden mb-40">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src="path-to-your-sixth-video.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </section>

            {/* Section 6: Process Summary - CONDITIONAL RENDERING */}
            {showProcessSummary && (
              <section data-section-index="5" className="content-section h-auto relative pt-18 bg-[#f0f0f0] py-8">
                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-2">
                  <h1 className="text-3xl sm:text-4xl font-['Josefin_Sans'] text-pink-300 mt-2 mb-12">Process Summary</h1>
                  <div className="w-full max-w-4xl mx-auto space-y-3">
                    {processSteps.map((step) => (
                      <div key={step.id} className="border-t border-b border-gray-300">
                        <div
                          onClick={() => toggleSection(step.id)}
                          className="flex justify-between items-center py-3 px-4 sm:px-5 cursor-pointer"
                        >
                          <h2 className="text-sm sm:text-lg font-light text-gray-700">{step.title}</h2>
                          <button
                            className="text-gray-500 transition-transform transform"
                            style={{
                              transform: expandedSections[step.id] ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform 0.3s ease'
                            }}
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        {expandedSections[step.id] && (
                          <div className="px-4 sm:px-5 py-3 bg-transparent">
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                              {step.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
            {/* Afiniti University Section */}
            <section data-section-index={showProcessSummary ? "6" : "5"} className="content-section min-h-screen relative py-4 bg-white pt-12">
              <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-['Josefin_Sans'] text-pink-400 mb-8">Afiniti University</h1>
                <p className="text-gray-600 text-xl font-light leading-relaxed mb-12 max-w-3xl">
                  Afiniti runs University sessions for new and existing clients to help them gain further understanding of how Afiniti works. Find out more in the video below.
                </p>
                <div className="relative">
                  <div className="overflow-hidden">
                    <motion.div
                      className="flex gap-12"
                      animate={{ x: currentSlide * -100 + '%' }}
                      transition={{ type: "tween", duration: 0.5 }}
                    >
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image1.jpg"
                          alt="What is AI?"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image2.jpg"
                          alt="What is Data?"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image3.jpg"
                          alt="AI Applications"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image4.jpg"
                          alt="AI Future"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image4.jpg"
                          alt="AI Future"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[750px] h-[450px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="/path-to-your-image4.jpg"
                          alt="AI Future"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>
                  <div className="absolute left-0 bottom-[-40px] right-0 flex items-center">
                    <div className="flex items-center gap-4 pr-4">
                      <button
                        className="text-xl text-black hover:text-gray-600 transition-colors"
                        onClick={() => handlePrevSlide()}
                      >
                        ←
                      </button>
                      <button
                        className="text-xl text-black hover:text-gray-600 transition-colors"
                        onClick={() => handleNextSlide()}
                      >
                        →
                      </button>
                    </div>
                    <div className="flex-1 h-[1px] bg-gray-200 relative">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-black"
                        animate={{
                          width: `${(currentSlide + 1) * 25}%`
                        }}
                        transition={{ type: "tween", duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Section */}
            <Footer />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HowWeDoIt;