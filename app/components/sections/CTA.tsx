"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Current user data
  const currentDateTime = "2025-03-03 19:12:55";
  const currentUser = "vkhare2909";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pulse animation for the button
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-0 right-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
          }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] top-1/2 -left-64 transform -translate-y-1/2 rounded-full blur-[100px]"
          style={{ background: "rgba(79, 70, 229, 0.1)" }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] bottom-0 right-0 rounded-full blur-[100px]"
          style={{ background: "rgba(147, 51, 234, 0.1)" }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6"
      >
        {/* User info badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center bg-gray-800/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs border border-gray-700/30">
            <span className="text-gray-400 mr-1">Session:</span>
            <span className="font-medium text-indigo-400">{currentUser}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-gray-400">UTC: {currentDateTime}</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div
              className="absolute top-0 left-0 w-40 h-40 rounded-full blur-[50px]"
              style={{ background: "rgba(79, 70, 229, 0.2)" }}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-60 h-60 rounded-full blur-[60px]"
              style={{ background: "rgba(147, 51, 234, 0.2)" }}
            ></div>
          </div>

          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            Get Started Today
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Ready to Transform Your{" "}
            <span
              style={{
                background:
                  "linear-gradient(to right, #4f46e5, #7e22ce, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Career Journey?
            </span>
          </h2>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            with our AI-powered platform and blockchain credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div ref={buttonRef}>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 text-lg px-8 py-4 inline-block"
              >
                Start For Free
              </Link>
            </div>

            <Link
              href="/demo"
              className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium rounded-lg transition-colors duration-300 px-6 py-4 flex items-center"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Watch Demo
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>

          {/* Last action info */}
          <div className="mt-8 pt-4 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
            <span>
              Last viewed by:{" "}
              <span className="text-indigo-400">{currentUser}</span>
            </span>
            <span>Updated: {currentDateTime}</span>
          </div>
        </div>

        {/* Special offer for current user */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-lg mx-auto mt-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20 text-center"
        >
          <p className="text-sm">
            <span className="text-gray-300">Special offer for</span>
            <span className="text-indigo-400 font-medium ml-1">
              {currentUser}
            </span>
            :
            <span className="text-gray-300 ml-1">
              Upgrade to Pro and get 3 months free!
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Offer expires on 2025-04-01
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
