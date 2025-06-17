import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Throttled mouse position update using requestAnimationFrame
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastTimeRef.current >= 16) { // ~60fps
        lastTimeRef.current = now;
        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        });
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.hasAttribute('data-clickable') ||
        target.closest('button, a, [data-clickable]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    // Hide the default cursor
    document.body.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 1,
      transition: {
        type: "linear",
        duration: 0.1
      }
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      opacity: 0.8,
      borderColor: "rgba(255, 0, 0, 1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  const dotVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      opacity: 1,
      transition: {
        type: "linear",
        duration: 0.1
      }
    },
    hover: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={cursorVariants}
        animate={isHovering ? "hover" : "default"}
        initial="default"
        style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          height: 32,
          width: 32,
          borderRadius: '50%',
          border: '2px solid green',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
        }}
      />
      
      <motion.div
        className="custom-cursor-dot"
        variants={dotVariants}
        animate={isHovering ? "hover" : "default"}
        initial="default"
        style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          height: 8,
          width: 8,
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />
    </>
  );
};

export default CustomCursor;