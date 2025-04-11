"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  // useSpring, // unused import
  useInView,
} from "framer-motion";
// import Image from "next/image"; // unused import
import { FaLinkedinIn, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Layout from "../components/layout/Layout";

const AboutSection = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const isIntroInView = useInView(introRef, { amount: 0.5 });
  const isSkillsInView = useInView(skillsRef, { amount: 0.5 });
  const isJourneyInView = useInView(journeyRef, { amount: 0.5 });
  const isContactInView = useInView(contactRef, { amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 0.8, 0.8, 0]
  );
  // const smoothProgress = useSpring(scrollYProgress, { // unused variable
  //   damping: 20,
  //   stiffness: 100,
  // });

  const skillItems = [
    { name: "Frontend Development", level: 90, icon: "🔷" },
    { name: "Backend Architecture", level: 85, icon: "🔶" },
    { name: "UI/UX Design", level: 80, icon: "💠" },
    { name: "Cloud Services", level: 75, icon: "☁️" },
    { name: "DevOps", level: 70, icon: "⚙️" },
    { name: "Machine Learning", level: 65, icon: "🧠" },
  ];

  const journeyItems = [
    {
      year: "2023-Present",
      title: "Lead Developer",
      company: "TechFusion Inc.",
      description:
        "Leading frontend development for next-generation web applications.",
    },
    {
      year: "2020-2023",
      title: "Senior Software Engineer",
      company: "InnovateSoft",
      description:
        "Developed scalable backend solutions using microservices architecture.",
    },
    {
      year: "2018-2020",
      title: "UI/UX Designer",
      company: "CreativeHub",
      description:
        "Created user-centered designs for mobile and web applications.",
    },
    {
      year: "2016-2018",
      title: "Frontend Developer",
      company: "WebSolutions",
      description:
        "Built responsive web interfaces with modern JavaScript frameworks.",
    },
  ];

  useEffect(() => {
    if (isIntroInView) setActiveSection("intro");
    else if (isSkillsInView) setActiveSection("skills");
    else if (isJourneyInView) setActiveSection("journey");
    else if (isContactInView) setActiveSection("contact");
  }, [isIntroInView, isSkillsInView, isJourneyInView, isContactInView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const floatingElements = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 5 + Math.random() * 10,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5,
  }));

  return (
    <Layout>
      <div
        data-theme="purple"
        className="relative overflow-hidden"
        ref={containerRef}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-full h-full"
            style={{ y: backgroundY }}
          >
            <div className="absolute top-0 left-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px]" />
            <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-[100px]" />
          </motion.div>

          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className="absolute rounded-full bg-white/5 backdrop-blur-sm"
              style={{
                width: `${element.size}px`,
                height: `${element.size}px`,
                left: `${element.x}%`,
                top: `${element.y}%`,
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [0.7, 1, 0.7],
                x: [
                  `${element.x}%`,
                  `${element.x + (Math.random() * 10 - 5)}%`,
                  `${element.x}%`,
                ],
                y: [
                  `${element.y}%`,
                  `${element.y + (Math.random() * 10 - 5)}%`,
                  `${element.y}%`,
                ],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Navigation dots */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
          <div className="flex flex-col gap-4">
            {["intro", "skills", "journey", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                data-cursor-text={`Go to ${section}`}
                className="group relative"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(section)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full transition-colors duration-300 border-2 ${
                    activeSection === section
                      ? "bg-purple-500 border-purple-400"
                      : "bg-transparent border-gray-400 group-hover:border-purple-400"
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-gray-800/80 backdrop-blur-sm rounded px-2 py-1">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Hero section with animated name */}
        <section
          id="intro"
          ref={introRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
        >
          <motion.div
            className="text-center max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ opacity: opacityProgress }}
          >
            <motion.div
              className="mb-4 inline-block text-sm font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 backdrop-blur-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              data-cursor-text="Hello there!"
            >
              About Me
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Vishal Khare
              </span>
            </motion.h1>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="px-4 py-2 rounded-lg bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm inline-flex items-center gap-2">
                <span className="text-blue-400">&#60;</span>
                <span>Full Stack Developer</span>
                <span className="text-blue-400">/&#62;</span>
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm inline-flex items-center gap-2">
                <span className="text-purple-400">✦</span>
                <span>UX Designer</span>
                <span className="text-purple-400">✦</span>
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm inline-flex items-center gap-2">
                <span className="text-emerald-400">◈</span>
                <span>AI Enthusiast</span>
                <span className="text-emerald-400">◈</span>
              </span>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              I create elegant, high-performance digital experiences that blend
              beautiful design with cutting-edge technology. With over 7 years
              of experience across the full development stack, I specialize in
              building products that people love to use.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <a
                href="#skills"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all shadow-lg shadow-purple-500/20 group relative overflow-hidden"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("skills")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-cursor-text="Explore more"
              >
                <span className="relative z-10">Learn more about me</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 2 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13L12 18L17 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 7L12 12L17 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </section>

        {/* Skills section */}
        <section
          id="skills"
          ref={skillsRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
        >
          <div className="max-w-6xl w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <motion.div variants={itemVariants} className="mb-2">
                <span className="text-sm font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 backdrop-blur-sm">
                  My Expertise
                </span>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              >
                Skills & Technologies
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                I&apos;ve worked with a wide range of technologies across the
                development stack. Here are some of my core competencies and
                technologies I use to bring ideas to life.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillItems.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 group hover:border-purple-500/40 transition-all duration-300"
                  data-cursor-text={`${skill.level}% proficiency`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      {skill.level}%
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.2 * index,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {[
                "React",
                "NextJS",
                "TypeScript",
                "Node.js",
                "GraphQL",
                "AWS",
                "Docker",
                "Figma",
              ].map((tech) => (
                <motion.div
                  key={tech}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-3 text-center hover:border-blue-500/30 transition-all duration-300"
                  data-cursor-text={tech}
                >
                  <span className="text-sm font-medium">{tech}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Journey section */}
        <section
          id="journey"
          ref={journeyRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
        >
          <div className="max-w-6xl w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <motion.div variants={itemVariants} className="mb-2">
                <span className="text-sm font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                  My Path
                </span>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-500"
              >
                Professional Journey
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                A timeline of my professional career, highlighting key roles and
                responsibilities that have shaped my expertise.
              </motion.p>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] md:left-1/2 ml-0 md:-ml-0.5 top-0 h-full w-1 bg-gradient-to-b from-purple-500/80 to-emerald-500/80 rounded-full" />

              <div className="space-y-16">
                {journeyItems.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row ${
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Timeline node */}
                    <div className="absolute left-3.5 md:left-1/2 top-7 md:-ml-3.5 h-7 w-7 rounded-full border-4 border-gray-900 bg-gradient-to-br from-purple-500 to-emerald-500 shadow-lg" />

                    {/* Date */}
                    <div
                      className={`md:w-1/2 pb-4 md:pb-0 ${
                        i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                      }`}
                    >
                      <span className="text-lg font-mono tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">
                        {item.year}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className={`pl-12 md:pl-0 md:w-1/2 ${
                        i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/40 transition-all duration-300 relative"
                      >
                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                        <p className="text-emerald-400 mb-3 font-medium">
                          {item.company}
                        </p>
                        <p className="text-gray-300">{item.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section
          id="contact"
          ref={contactRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
        >
          <motion.div
            className="max-w-5xl w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-center mb-16">
              <motion.div variants={itemVariants} className="mb-2">
                <span className="text-sm font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                  Get in Touch
                </span>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              >
                Let&apos;s Connect
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 mb-2">Email</p>
                    <a
                      href="mailto:contact@vishalkhare.dev"
                      className="text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      data-cursor-text="Send me an email"
                    >
                      contact@vishalkhare.dev
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-400 mb-2">Based in</p>
                    <p className="text-lg font-medium">
                      San Francisco, California
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 mb-3">Connect on</p>
                    <div className="flex space-x-4">
                      <motion.a
                        href="https://linkedin.com/in/vishalkhare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/40 flex items-center justify-center text-blue-400 border border-blue-500/30 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        data-cursor-text="LinkedIn"
                      >
                        <FaLinkedinIn />
                      </motion.a>
                      <motion.a
                        href="https://github.com/vkhare2909"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gray-700/80 flex items-center justify-center text-white border border-gray-600/30 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        data-cursor-text="GitHub"
                      >
                        <FaGithub />
                      </motion.a>
                      <motion.a
                        href="https://twitter.com/vishalkhare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-blue-400/20 hover:bg-blue-400/40 flex items-center justify-center text-blue-300 border border-blue-400/30 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        data-cursor-text="Twitter"
                      >
                        <FaTwitter />
                      </motion.a>
                      <motion.a
                        href="mailto:contact@vishalkhare.dev"
                        className="w-10 h-10 rounded-full bg-purple-500/20 hover:bg-purple-500/40 flex items-center justify-center text-purple-400 border border-purple-500/30 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        data-cursor-text="Email"
                      >
                        <FaEnvelope />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-400 mb-2 text-sm"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-400 mb-2 text-sm"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-400 mb-2 text-sm"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Hello, I'd like to discuss a project..."
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all shadow-lg shadow-purple-500/20 relative overflow-hidden group"
                    type="submit"
                    data-cursor-text="Submit message"
                  >
                    <span className="relative z-10">Send Message</span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                      }}
                    />
                  </motion.button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    I typically respond within 24-48 hours
                  </p>
                </form>
              </motion.div>
            </div>

            {/* Additional info section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 text-center hover:border-blue-500/30 transition-all duration-300"
                data-cursor-text="Open to work"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Employment Status
                </h3>
                <p className="text-gray-400">
                  Currently open to freelance and full-time opportunities in web
                  development and UI/UX design.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 text-center hover:border-purple-500/30 transition-all duration-300"
                data-cursor-text="Let's collaborate"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
                <p className="text-gray-400">
                  Interested in collaborating on innovative projects with
                  passionate teams and individuals.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 text-center hover:border-emerald-500/30 transition-all duration-300"
                data-cursor-text="Remote work"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2.5M15 12h2a2 2 0 012 2v1a2 2 0 002 2h2M1.5 4.75a3.25 3.25 0 013.25-3.25h7.5a3.25 3.25 0 013.25 3.25m12.5 0a3.25 3.25 0 00-3.25-3.25h-7.5a3.25 3.25 0 00-3.25 3.25m-12.5 0v10a3.25 3.25 0 003.25 3.25h16.5a3.25 3.25 0 003.25-3.25v-10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Work Preference</h3>
                <p className="text-gray-400">
                  Available for remote work with flexible hours across global
                  time zones.
                </p>
              </motion.div>
            </motion.div>

            {/* Call to action */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-20 text-center"
            >
              <motion.h3
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold mb-6"
              >
                Ready to bring your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  ideas to life
                </span>
                ?
              </motion.h3>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden group"
                  data-cursor-text="Let's talk"
                >
                  <span className="relative z-10">Contact Me</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                  />
                </motion.a>

                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg border border-gray-600 hover:border-blue-500/50 bg-gray-800/30 backdrop-blur-sm text-white transition-all"
                  data-cursor-text="Download PDF"
                >
                  View Resume
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Timestamps for tracking/analytics */}
        </section>
        <Footer />
      </div>
    </Layout>
  );
};

export default AboutSection;
