"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // User data

  useEffect(() => {
    if (!timelineRef.current) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    // Animate the progress line
    timeline.to(".timeline-progress", {
      height: "100%",
      duration: 1,
      ease: "none",
    });

    // Animate each step as it comes into view
    const steps = gsap.utils.toArray(".timeline-step");
    steps.forEach((step, i) => {
      gsap.to(step as Element, {
        scrollTrigger: {
          trigger: step as Element,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const steps = [
    {
      title: "Apply for Funding",
      description:
        "Submit your educational goals, current skills, and career aspirations to apply for skills-based financing tailored to your needs.",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "AI Skills Assessment",
      description:
        "Our advanced OpenCV-powered interview system and assessment tools evaluate your current abilities and career potential.",
      image:
        "https://images.unsplash.com/photo-1581092921461-7384161d8ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Investor Matching",
      description:
        "Connect with investors who believe in your potential and are willing to fund your education in exchange for future income sharing.",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Career Path Simulation",
      description:
        "Visualize your future career trajectory with our interactive simulator showing salary projections, time-to-goal, and job opportunities.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Blockchain Verification",
      description:
        "Earn verifiable credentials secured on the blockchain that prove your skills and accomplishments to employers and investors.",
      image:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1467&q=80",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      title: "Mentorship Connection",
      description:
        "Get matched with industry experts through our AI-powered mentorship system to accelerate your learning and career development.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 relative"
      style={{
        background:
          "linear-gradient(to bottom, rgb(17, 24, 39), rgba(0, 0, 0, 0.8))",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-blue-400 uppercase tracking-wider"
          >
            The Process
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            How SkillBridge Pro Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Follow these six steps to secure your education funding, develop
            valuable skills, and launch your career with our blockchain-powered
            platform.
          </motion.p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline track */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-800">
            <div
              className="timeline-progress absolute top-0 left-0 right-0 h-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(59, 130, 246), rgb(139, 92, 246), rgb(99, 102, 241))",
              }}
            ></div>
          </div>

          {/* Timeline steps */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`timeline-step flex items-center opacity-0 ${
                  index % 2 === 0
                    ? "flex-row -translate-x-4"
                    : "flex-row-reverse -translate-x-4 md:translate-x-4"
                }`}
              >
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "text-right pr-10" : "text-left pl-10"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>

                  {/* Add user tag to first step */}
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold`}
                  >
                    {index + 1}
                  </div>
                </div>

                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "pl-10" : "pr-10"
                  }`}
                >
                  <div className="relative w-full h-40 md:h-64 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover p-4"
                    />

                    {/* Last updated timestamp */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
