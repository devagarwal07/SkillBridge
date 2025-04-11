"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { TrendingUp, Map, Clock, Target, BarChart, Users } from "lucide-react";

export default function CareerVisualization() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // User data and timestamp
  const currentDateTime = "2025-04-04 20:19:49";
  const currentUser = "vkhare2909";

  // Mouse parallax effect for the 3D scene
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 70 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in-up", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const tabItems = [
    {
      id: "salary-projection",
      title: "Salary Projection",
      icon: <TrendingUp className="mr-2 h-4 w-4" />,
      description:
        "Visualize your salary growth over time based on education choices, skill acquisition, and career progress.",
      features: [
        "Dynamic projection curves",
        "Milestone salary increases",
        "Industry comparison",
        "Adjustable timeline settings",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "opportunity-map",
      title: "Job Opportunity Map",
      icon: <Map className="mr-2 h-4 w-4" />,
      description:
        "Explore geographic distribution of job opportunities with interactive visualization showing demand, salary, and growth by location.",
      features: [
        "Job density heatmap",
        "Salary differential by region",
        "Remote work opportunities",
        "Growth trend indicators",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "time-to-goal",
      title: "Time-to-Goal Gauge",
      icon: <Target className="mr-2 h-4 w-4" />,
      description:
        "Calculate how quickly you can reach your career goals based on learning pace, education choices, and market conditions.",
      features: [
        "Adaptive timeline estimation",
        "Milestone completion tracking",
        "Learning pace adjustment",
        "Alternative path comparison",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="visualization"
      className="py-24 relative"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          {/* User and time badge */}
          <div className="inline-flex items-center text-xs text-gray-500 bg-gray-900/50 backdrop-blur-sm border border-gray-800 px-3 py-1 rounded-full mb-4">
            <span>Last updated: {currentDateTime}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-400">{currentUser}</span>
          </div>

          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
            Data-Driven Planning
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Career Path Simulator
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Make informed decisions about your education and career with our
            advanced simulation tools that visualize potential outcomes and
            opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 fade-in-up">
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 p-1 rounded-xl mb-8">
              <div className="flex">
                {tabItems.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                      activeTab === index
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                        }}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      {tab.icon}
                      {tab.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={activeTab}
              className="space-y-6"
            >
              <h3
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {tabItems[activeTab].title}
              </h3>

              <p className="text-gray-300">{tabItems[activeTab].description}</p>

              <ul className="space-y-3">
                {tabItems[activeTab].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 text-blue-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Run Simulation
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Compare Paths
                </motion.button>
              </div>

              {/* Last interaction info */}
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>
                    Simulation updates in real-time based on market data
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="order-1 md:order-2 fade-in-up">
            <motion.div
              style={{ rotateX, rotateY, perspective: 1000 }}
              className="h-[400px] bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10"></div>
              <Image
                src={tabItems[activeTab].imageUrl}
                alt={tabItems[activeTab].title}
                fill
                className="object-cover"
              />

              {/* Overlay UI elements to simulate the actual tool */}
              {activeTab === 0 && (
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/70 backdrop-blur-sm rounded-lg p-3 z-20 border border-blue-500/30">
                  <div className="text-xs text-blue-300 mb-1">
                    Projected Salary Growth
                  </div>
                  <div className="h-16 relative">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 left-0 h-8 w-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 left-[20%] h-8 w-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 left-[40%] h-8 w-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 left-[60%] h-8 w-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 left-[80%] h-8 w-1 bg-gray-700"></div>
                    <div className="absolute bottom-0 right-0 h-8 w-1 bg-gray-700"></div>

                    <svg
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <path
                        d="M0,30 L10,28 L20,25 L30,20 L40,17 L50,13 L60,10 L70,7 L80,5 L90,3 L100,1"
                        fill="none"
                        stroke="url(#salary-gradient)"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient
                          id="salary-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-4 border-blue-500/30 relative">
                    <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-500/30"></div>
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-500/30"></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500"></div>

                    <div className="absolute top-0 right-0 w-8 h-8 -translate-x-8 -translate-y-4 rounded-full bg-purple-500/60 backdrop-blur-sm text-xs flex items-center justify-center">
                      24k
                    </div>
                    <div className="absolute bottom-0 left-10 w-10 h-10 rounded-full bg-blue-500/60 backdrop-blur-sm text-xs flex items-center justify-center">
                      65k
                    </div>
                    <div className="absolute left-0 top-10 w-7 h-7 rounded-full bg-indigo-500/60 backdrop-blur-sm text-xs flex items-center justify-center">
                      18k
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/70 backdrop-blur-sm rounded-lg p-3 z-20 border border-blue-500/30">
                  <div className="text-xs text-blue-300 mb-2">
                    Time to Reach Goal: Senior Developer
                  </div>
                  <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center pl-3"
                      style={{ width: "65%" }}
                    >
                      <span className="text-xs text-white">3.2 years</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background glow effect */}
      <div
        className="absolute -z-10 bottom-0 left-0 w-full h-[500px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(17, 24, 39, 0) 70%)",
        }}
      ></div>
    </section>
  );
}
