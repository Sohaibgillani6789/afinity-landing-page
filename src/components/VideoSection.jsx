import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  {
    id: 1,
    title: "Afinity uses data and artificial intelligence to transform the quality of    interpersonal interactions",
    url: "/videos/hyy.webm",
    buttonId: "what-we-do"
  },
  {
    id: 2,
    title: "How We Do It",
    url: "/videos/loll.webm",
    buttonId: "how-we-do-it"
  },
  {
    id: 3,
    title: "What We Deliver",
    url: "/videos/jiu.webm",
    buttonId: "what-we-deliver"
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
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const videoPreloadRefs = useRef(new Map());
  const buttonTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Memoized video variants to prevent recreation
  const videoVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  }), []);

  const buttonVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  }), []);

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

  // Optimized video preloading with better memory management
  useEffect(() => {
    const preloadVideos = async () => {
      // Only preload the first video initially
      const firstVideo = videos[0];
      if (!videoPreloadRefs.current.has(firstVideo.id)) {
        const videoElement = document.createElement('video');
        videoElement.src = firstVideo.url;
        videoElement.preload = 'metadata';
        videoElement.muted = true;
        videoElement.playsInline = true;
        
        videoPreloadRefs.current.set(firstVideo.id, videoElement);
        
        await new Promise((resolve) => {
          const onCanPlay = () => {
            setLoadedVideos(prev => new Set([...prev, firstVideo.id]));
            videoElement.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          
          const onError = () => {
            console.warn(`Failed to preload video: ${firstVideo.url}`);
            videoElement.removeEventListener('error', onError);
            resolve();
          };
          
          videoElement.addEventListener('canplay', onCanPlay);
          videoElement.addEventListener('error', onError);
        });
      }

      // Preload next video when needed
      const preloadNextVideo = (nextIndex) => {
        if (nextIndex < videos.length) {
          const nextVideo = videos[nextIndex];
          if (!videoPreloadRefs.current.has(nextVideo.id)) {
            const videoElement = document.createElement('video');
            videoElement.src = nextVideo.url;
            videoElement.preload = 'metadata';
            videoElement.muted = true;
            videoElement.playsInline = true;
            
            videoPreloadRefs.current.set(nextVideo.id, videoElement);
          }
        }
      };

      // Add listener for video changes to preload next video
      const handleVideoChange = (index) => {
        preloadNextVideo(index + 1);
      };

      return handleVideoChange;
    };

    const cleanup = preloadVideos();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      videoPreloadRefs.current.forEach((videoElement) => {
        videoElement.src = '';
        videoElement.load();
      });
      videoPreloadRefs.current.clear();
    };
  }, []);

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
    if (index === activeVideo) return; // Prevent unnecessary updates
    
    setShowButton(false);
    setActiveVideo(index);
    setNextButtonIndex((index + 1) % videos.length);
    
    if (isManualClick) {
      setTimerKey(prevKey => prevKey + 1);
      startVideoTimer();
    }
  }, [activeVideo, startVideoTimer]);

  const handleButtonHover = useCallback((hovering) => {
    if (!isMobile) {
      setIsHovering(hovering);
    }
  }, [isMobile]);

  // Memoized current video data
  const currentVideo = useMemo(() => videos[activeVideo], [activeVideo]);
  const nextVideo = useMemo(() => videos[nextButtonIndex], [nextButtonIndex]);

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
            style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            config={{
              file: {
                attributes: {
                  preload: 'metadata',
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
<div className="absolute top-8 right-[calc(2rem--250px)] z-[5000] flex flex-row gap-8 pointer-events-auto">
          {videos.map((video, index) => (
            <div key={video.id} className="flex flex-col group">
              <button
                id={video.buttonId}
                className={`text-white uppercase text-lm font-medium tracking-wider  ${
                  activeVideo === index ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                } transition-opacity duration-300 text-left`}
                onClick={() => handleVideoChange(index, true)}
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
              >
                {video.buttonId.replace(/-/g, ' ')}
              </button>
       
            </div>
          ))}
        </div>
      )}

      {/* Button Nav - Mobile/Tablet (Top Right as Circles) */}
      {isMobile && (
        <div className="absolute bottom-20 right-8 z-20 flex flex-row gap-4">
          {videos.map((video, index) => (
            <button
              key={video.id}
              id={video.buttonId}
              className={`w-3 h-3 rounded-full ${activeVideo === index ? 'bg-green-600' : 'bg-white/50'} transition-all duration-300`}
              onClick={() => handleVideoChange(index, true)}
              aria-label={`Video ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Text content - Responsive positioning */}
      <div className="absolute inset-0 flex flex-col justify-center text-left z-10 px-4 sm:px-6 md:px-8 lg:ml-40 lg:px-4">
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl leading-tight sm:leading-tight md:leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          key={`title-${activeVideo}`}
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
            Discover {nextVideo.buttonId.replace(/-/g, ' ')} →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoSection;