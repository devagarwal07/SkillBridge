"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaUserClock,
} from "react-icons/fa";

// Current user data

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Michael Torres",
    role: "Software Engineer",
    company: "CloudMatrix Inc.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    quote:
      "SkillBridge Pro revolutionized my education journey. Their Income Share Agreement meant zero upfront costs for my coding bootcamp, and the AI-powered career simulator helped me map a clear path to becoming a senior engineer.",
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "Data Scientist",
    company: "Analytix",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    quote:
      "The blockchain verification system gave my credentials instant credibility with employers. Combined with the AI video interview practice, I was fully prepared to land my dream job after completing my data science program.",
  },
  {
    id: 3,
    name: "James Wilson",
    role: "UX Designer",
    company: "DesignForward",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    quote:
      "As a career-changer, SkillBridge Pro's investor matching was perfect. I secured funding based on my potential, not my credit score. The platform's mentor matching connected me with a senior designer who guided my transition into tech.",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "Full Stack Developer",
    company: "TechNova Solutions",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    quote:
      "SkillBridge Pro removed the financial barrier to my education. Their skills assessment accurately identified my strengths, and the career path simulator mapped my journey from bootcamp graduate to full stack developer. Now I'm earning triple my previous salary!",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;

      if (nextIndex < 0) {
        nextIndex = testimonials.length - 1;
      } else if (nextIndex >= testimonials.length) {
        nextIndex = 0;
      }

      return nextIndex;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 1))",
        }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* User badge */}

          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
            Success Stories
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Transforming Education Funding
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how SkillBridge Pro has helped students secure funding,
            advance their careers, and achieve financial success through
            skills-based financing.
          </p>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div
            className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden"
            ref={slideRef}
          >
            {/* Background accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  "linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)",
              }}
            ></div>

            {/* Quote icon */}
            <FaQuoteLeft className="absolute top-8 left-8 text-4xl text-gray-700 opacity-30" />

            {/* Last viewed by indicator */}

            {/* Testimonial carousel */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-8 px-4 md:px-12"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div
                      className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2"
                      style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
                    >
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-lg md:text-xl text-gray-300 italic mb-6">
                      "{testimonials[currentIndex].quote}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {testimonials[currentIndex].role},{" "}
                          {testimonials[currentIndex].company}
                        </p>
                      </div>

                      <div className="hidden md:block text-right text-xs text-gray-500">
                        <div>
                          Success Story #{testimonials[currentIndex].id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="absolute bottom-8 right-8 flex items-center space-x-3">
              <button
                onClick={() => paginate(-1)}
                className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-700 flex items-center justify-center text-white hover:bg-blue-500 hover:border-blue-500 transition-colors"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-700 flex items-center justify-center text-white hover:bg-blue-500 hover:border-blue-500 transition-colors"
                aria-label="Next testimonial"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              25,000+
            </div>
            <p className="text-gray-400">Students Funded</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              145%
            </div>
            <p className="text-gray-400">Average Salary Increase</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              100,000+
            </div>
            <p className="text-gray-400">Blockchain Credentials Verified</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
