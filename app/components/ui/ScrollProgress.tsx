"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Current user data
  const currentDateTime = "2025-03-03 19:14:32";
  const currentUser = "vkhare2909";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      // Calculate scroll percentage for display
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const currentProgress = Math.round((window.scrollY / totalHeight) * 100);
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{
          scaleX,
          background: "linear-gradient(to right, #4f46e5, #7e22ce, #ec4899)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        className="fixed bottom-8 left-8 bg-gray-900/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs border border-gray-700/30 z-40"
      >
        <div className="flex items-center space-x-2 text-gray-400">
          <span>{currentUser}</span>
          <span>•</span>
          <span>{progress}%</span>
          <span>•</span>
          <span>{currentDateTime}</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        onClick={handleScrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg transition-colors z-40"
        aria-label="Scroll to top"
        title={`Scroll to top | ${currentUser} | ${currentDateTime}`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </>
  );
}
