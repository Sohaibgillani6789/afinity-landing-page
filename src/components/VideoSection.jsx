import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import videos
const videos = [
  {
    id: 1,
    title: "What we do",
    url: "https://res.cloudinary.com/ddzllbqlv/video/upload/v1748342620/zjtzamruh1ztnsjntam7.mp4",
    buttonId: "what-we-do",
    path: "/what-we-do"
  },
  {
    id: 2,
    title: "How We Do It",
    url: "https://res.cloudinary.com/ddzllbqlv/video/upload/v1748342623/kfeixt00owusza7oaoxw.mp4",
    buttonId: "how-we-do-it",
    path: "/how-we-do-it"
  },
  {
    id: 3,
    title: "What We Deliver",
    url: "https://res.cloudinary.com/ddzllbqlv/video/upload/v1748342633/zdwyblkjivgsog2q2fad.mp4",
    buttonId: "what-we-deliver",
    path: "/what-we-deliver"
  }
];

const VIDEO_DURATION = 11000; // milliseconds (11s)

const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [nextButtonIndex, setNextButtonIndex] = useState(1);
  const [timerKey, setTimerKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const navigate = useNavigate();
  
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const buttonTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Memoized video variants to prevent recreation
  const videoVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  }), []);

  // Add button animation variants
  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: (index) => ({
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.15 // Stagger effect for multiple buttons
      }
    })
  };

  const cursorVariants = useMemo(() => ({
    default: { 
      x: cursorPosition.x - 16, 
      y: cursorPosition.y - 16,
      scale: 1
    },
    hover: { 
      x: cursorPosition.x - 16, 
      y: cursorPosition.y - 16, 
      scale: 1.5,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      mixBlendMode: "difference"
    }
  }), [cursorPosition.x, cursorPosition.y]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      setIsMobile(window.innerWidth < 768);
    }, 100);
  }, []);

  // Check for mobile devices with debouncing
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  // Throttled cursor tracking
  const throttledCursorUpdate = useCallback((e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    let rafId;
    const trackCursor = (e) => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        throttledCursorUpdate(e);
        rafId = null;
      });
    };

    window.addEventListener('mousemove', trackCursor, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', trackCursor);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile, throttledCursorUpdate]);

  // Optimized timer management
  const startVideoTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setActiveVideo(current => {
        const nextIndex = (current + 1) % videos.length;
        setNextButtonIndex((nextIndex + 1) % videos.length);
        return nextIndex;
      });
    }, VIDEO_DURATION);
  }, []);

  useEffect(() => {
    startVideoTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startVideoTimer]);

  // Optimized button show logic
  useEffect(() => {
    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current);
    }
    
    setShowButton(false);
    buttonTimeoutRef.current = setTimeout(() => {
      if (nextButtonIndex < videos.length) {
        setShowButton(true);
      }
    }, 3000);

    return () => {
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current);
      }
    };
  }, [activeVideo, nextButtonIndex]);

  const handleVideoChange = useCallback((index, isManualClick = true) => {
    const selectedVideo = videos[index];
    
    if (index === activeVideo && selectedVideo.path) {
      console.log('Navigating to:', selectedVideo.path); // Debug log
      navigate(selectedVideo.path);
      return;
    }
    
    setShowButton(false);
    setActiveVideo(index);
    setNextButtonIndex((index + 1) % videos.length);
    
    if (isManualClick) {
      setTimerKey(prevKey => prevKey + 1);
      startVideoTimer();
    }
  }, [activeVideo, startVideoTimer, navigate]);

  const handleButtonHover = useCallback((hovering) => {
    if (!isMobile) {
      setIsHovering(hovering);
    }
  }, [isMobile]);

  // Memoized current video data
  const currentVideo = useMemo(() => videos[activeVideo], [activeVideo]);
  const nextVideo = useMemo(() => videos[nextButtonIndex], [nextButtonIndex]);

  // Add error handling to ReactPlayer
  const handleVideoError = () => {
    console.error('Video failed to load');
    setVideoError(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`video-${activeVideo}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          variants={videoVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ReactPlayer
            ref={playerRef}
            url={currentVideo.url}
            playing
            loop
            muted
            width="100%"
            height="100%"
            playsinline
            onError={handleVideoError}
            style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            config={{
              file: {
                attributes: {
                  preload: 'auto',
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }
                }
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Button Nav - Desktop (Top Right) */}
      {!isMobile && (
        <div className="absolute top-8 right-[calc(2rem--190px)] z-[5000] flex flex-row gap-8 pointer-events-auto">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                className="flex flex-col group"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <button
                  id={video.buttonId}
                  className={`text-white uppercase text-lm font-medium tracking-wider ${
                    activeVideo === index ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  } transition-all duration-300 text-left`}
                  onClick={() => handleVideoChange(index, true)}
                  onMouseEnter={() => handleButtonHover(true)}
                  onMouseLeave={() => handleButtonHover(false)}
                >
                  {video.buttonId === 'how-we-do-it' ? 'How We Do It' : video.buttonId.replace(/-/g, ' ')}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Button Nav - Mobile/Tablet (Top Right as Circles) */}
      {isMobile && (
        <div className="absolute bottom-20 right-8 z-20 flex flex-row gap-4">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.button
                key={video.id}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                id={video.buttonId}
                className={`w-3 h-3 rounded-full ${activeVideo === index ? 'bg-green-600' : 'bg-white/50'} transition-all duration-300`}
                onClick={() => handleVideoChange(index, true)}
                aria-label={`Video ${index + 1}`}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Text content - Responsive positioning */}
      <div className="absolute inset-0 flex flex-col justify-center text-left z-10 px-4 sm:px-6 md:px-8 lg:ml-40 lg:px-4">
        <motion.h1
          className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl leading-tight sm:leading-tight md:leading-tight ${
            currentVideo.buttonId === 'how-we-do-it' ? ' hover:text-green-400 transition-colors duration-300' : ''
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          key={`title-${activeVideo}`}
          onClick={() => currentVideo.buttonId === 'how-we-do-it' && navigate('/how-we-do-it')}
          onMouseEnter={() => currentVideo.buttonId === 'how-we-do-it' && setIsHovering(true)}
          onMouseLeave={() => currentVideo.buttonId === 'how-we-do-it' && setIsHovering(false)}
          style={currentVideo.buttonId === 'how-we-do-it' ? { cursor: 'pointer' } : {}}
        >
          {currentVideo.title}
        </motion.h1>

        <motion.p
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl leading-relaxed sm:leading-relaxed"
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.1 }}
          key={`desc-${activeVideo}`}
        >
          Find out how we help businesses pair better.
        </motion.p>
      </div>

      {/* Next Button - Responsive */}
      <AnimatePresence>
        {showButton && nextButtonIndex !== activeVideo && (
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute ${isMobile ? 'bottom-8 left-4 right-4 w-auto' : 'bottom-10 left-1/2 transform -translate-x-1/2'} bg-green-600/30 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all z-30 cursor-pointer text-sm sm:text-base`}
            onClick={() => handleVideoChange(nextButtonIndex, true)}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
            style={{ zIndex: 40 }}
          >
            Next: {videos[nextButtonIndex].title.split(' ').slice(0, 3).join(' ')} →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoSection;