"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";

import GlobeVisualization from "../3d/GlobeVisualization";
import SparkleButton from "../ui/SparkleButton";
import { GraduationCap, TrendingUp, Shield, Users, Zap } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gradientTextRef = useRef<HTMLSpanElement>(null);

  const currentTime = "2025-04-04 20:11:30";
  const currentUser = "vkhare2909";

  useEffect(() => {
    // Animation timeline to make cleanup easier
    const tl = gsap.timeline();

    const animateText = async () => {
      try {
        if (headlineRef.current && subtitleRef.current) {
          // Wait for fonts to load
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Animate the headline
          tl.fromTo(
            headlineRef.current.querySelectorAll("span"),
            {
              opacity: 0,
              y: 30,
              rotationX: -40,
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              stagger: 0.12,
              duration: 1,
              ease: "power3.out",
            }
          );

          // Subtitle animation
          tl.fromTo(
            subtitleRef.current,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6" // Start slightly before the headline animation completes
          );
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    // Start animation
    animateText();

    // Set up ScrollTrigger for parallax effect (if needed)
    const parallaxEffect = gsap.to(".parallax-bg", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Cleanup function
    return () => {
      tl.kill(); // Kill the timeline
      if (parallaxEffect && parallaxEffect.scrollTrigger) {
        parallaxEffect.scrollTrigger.kill(); // Kill the scroll trigger
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Background Elements */}
      <div
        className="absolute inset-0 -z-10 parallax-bg"
        style={{ height: "150%" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(147, 51, 234, 0.05) 50%, transparent 80%)",
            height: "150%",
            width: "100%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.15) 0, rgba(0, 0, 0, 0) 80%)",
            height: "150%",
            width: "100%",
          }}
        />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-sm font-medium border border-blue-400/20 inline-flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Education Financing Platform
            </span>
          </motion.div>

          {/* Headline with preserved styling - structured for animation */}
          <div className="mb-6">
            <h1
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight headline-text"
            >
              <span ref={gradientTextRef} className="gradient-text block mb-2">
                Fund Your Future
              </span>
              <span className="with-text inline-block mr-2">With</span>
              <span className="ai-text relative inline-block">
                Skills-Based Financing
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 280 8"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M0,5 Q40,0 80,5 T160,5 T240,5"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-md"
          >
            SkillBridge Pro combines AI-powered career planning, skills
            verification, and innovative financing to make education accessible
            for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <SparkleButton
              href="/signup"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Apply for Funding
            </SparkleButton>

            <Link
              href="/verify"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all duration-300 flex items-center justify-center group"
            >
              Verify Credentials
              <Shield className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Feature highlights */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-700/30 transition-colors duration-300">
              <Shield className="text-blue-400 mb-2" size={24} />
              <h3 className="text-sm font-medium">Blockchain Verification</h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-700/30 transition-colors duration-300">
              <TrendingUp className="text-purple-400 mb-2" size={24} />
              <h3 className="text-sm font-medium">Career Simulation</h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-700/30 transition-colors duration-300">
              <Users className="text-green-400 mb-2" size={24} />
              <h3 className="text-sm font-medium">Expert Mentorship</h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-700/30 transition-colors duration-300">
              <Zap className="text-amber-400 mb-2" size={24} />
              <h3 className="text-sm font-medium">AI Assessments</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative h-[600px] w-full z-0"
        >
          {/* Globe container */}
          <div className="absolute inset-0">
            <GlobeVisualization />
          </div>

          {/* Floating stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-[20%] left-[20%] bg-gray-800/80 backdrop-blur-md border border-gray-700/50 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="text-blue-400" size={16} />
              <div>
                <div className="text-xs font-medium">Students Funded</div>
                <div className="text-sm font-bold">25,000+</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute bottom-[30%] right-[15%] bg-gray-800/80 backdrop-blur-md border border-gray-700/50 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Shield className="text-purple-400" size={16} />
              <div>
                <div className="text-xs font-medium">Verified Credentials</div>
                <div className="text-sm font-bold">100,000+</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <a
            href="#features"
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Styling */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Gradient text styles */
        .gradient-text {
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </section>
  );
}
