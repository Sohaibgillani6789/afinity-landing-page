import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const [text, setText] = useState("afinity");
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    const timeline = [
      { phase: 1, text: "ai", delay: 1000 },     // Shrink to "ai"
      { phase: 2, text: "ai", delay: 800 },      // Hold "ai"
      { phase: 3, text: "afinity", delay: 1000 } // Expand back to "afinity"
    ];
    
    let timeoutId;
    
    const runAnimation = (step = 0) => {
      if (step < timeline.length) {
        timeoutId = setTimeout(() => {
          setAnimationPhase(timeline[step].phase);
          setText(timeline[step].text);
          runAnimation(step + 1);
        }, timeline[step].delay);
      }
    };
    
    runAnimation();
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const containerVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };
  
  const textVariants = {
    shrink: { scale: 0.3, opacity: 0.8, transition: { duration: 0.8 } },
    hold: { scale: 0.3, opacity: 1, transition: { duration: 0.5 } },
    expand: { scale: 1, opacity: 1, transition: { duration: 0.8 } }
  };
  
  const getTextVariant = () => {
    switch(animationPhase) {
      case 1: return "shrink";
      case 2: return "hold";
      case 3: return "expand";
      default: return "expand";
    }
  };

  // Function to render text with green "i" in "ai"
  const renderText = () => {
    if (text === "ai") {
      return (
        <>
          <span className="text-black">a</span>
          <span className="text-green-500">i</span>
        </>
      );
    }
    
    return text.split('').map((char, index) => (
      <span key={index} className="text-black">{char}</span>
    ));
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-white z-50"
        variants={containerVariants}
        initial="initial"
        exit="exit"
      >
        <motion.div
          className="font-bold text-5xl md:text-7xl"
          variants={textVariants}
          animate={getTextVariant()}
        >
          {renderText()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;