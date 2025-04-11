"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hyperspeed, { hyperspeedPresets } from "./Hyperspeed";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hyperspeedActive, setHyperspeedActive] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Activate hyperspeed effect shortly after component mounts
    const hyperspeedTimer = setTimeout(() => {
      setHyperspeedActive(true);
    }, 300);

    // Set timer to remove loading screen
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(hyperspeedTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          {/* Hyperspeed background effect */}
          <div className="absolute inset-0 w-full h-full">
            {hyperspeedActive && (
              <Hyperspeed
                effectOptions={{
                  onSpeedUp: () => {},
                  onSlowDown: () => {},
                  distortion: "turbulentDistortion",
                  length: 400,
                  roadWidth: 10,
                  islandWidth: 2,
                  lanesPerRoad: 4,
                  fov: 90,
                  fovSpeedUp: 150,
                  speedUp: 2,
                  carLightsFade: 0.4,
                  totalSideLightSticks: 20,
                  lightPairsPerRoadWay: 40,
                  shoulderLinesWidthPercentage: 0.05,
                  brokenLinesWidthPercentage: 0.1,
                  brokenLinesLengthPercentage: 0.5,
                  lightStickWidth: [0.12, 0.5],
                  lightStickHeight: [1.3, 1.7],
                  movingAwaySpeed: [60, 80],
                  movingCloserSpeed: [-120, -160],
                  carLightsLength: [400 * 0.03, 400 * 0.2],
                  carLightsRadius: [0.05, 0.14],
                  carWidthPercentage: [0.3, 0.5],
                  carShiftX: [-0.8, 0.8],
                  carFloorSeparation: [0, 5],
                  colors: {
                    roadColor: 0x080808,
                    islandColor: 0x0a0a0a,
                    background: 0x000000,
                    shoulderLines: 0xffffff,
                    brokenLines: 0xffffff,
                    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                    sticks: 0x03b3c3,
                  },
                }}
              />
            )}
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black" />

          {/* Content */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.2,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
          >
            <div className="p-8 rounded-2xl backdrop-blur-md bg-black/30 border border-white/10 shadow-2xl">
              <motion.div
                ref={logoRef}
                className="relative flex flex-col items-center"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.h1
                  className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400"
                  animate={{
                    backgroundPosition: ["0% center", "100% center"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  SkillBridge
                </motion.h1>

                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 blur-xl opacity-50 bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400 rounded-full"
                  animate={{
                    backgroundPosition: ["0% center", "100% center"],
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                    zIndex: -1,
                  }}
                />
              </motion.div>

              {/* Progress bar */}
              <div className="mt-6 relative">
                <div className="h-1.5 w-full rounded-full bg-gray-800/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400 rounded-full"
                    initial={{ width: "5%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Glow effect on progress bar */}
                <motion.div
                  className="absolute top-0 left-0 h-1.5 w-12 bg-white blur-md"
                  animate={{
                    x: ["-10%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    times: [0, 0.8, 1],
                  }}
                />
              </div>

              {/* Loading text */}
              <motion.p
                className="mt-4 text-center text-sm text-gray-400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Initializing experience...
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
