"use client";
import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FaLaptopCode,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";
import Image from "next/image";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  currentUser?: string;
  currentTime?: string;
  imageUrl?: string;
};

function FeatureCard({
  icon,
  title,
  description,
  delay,
  currentUser,
  currentTime,
  imageUrl,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-white/15 transition-all duration-500 group flex flex-col h-full"
    >
      {/* Image container */}
      {imageUrl && (
        <div className="mb-6 w-full h-48 overflow-hidden rounded-lg relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40 z-10"></div>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      )}

      <div
        className="relative mb-6 w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        <div className="z-10 text-2xl text-white">{icon}</div>
      </div>

      <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-400">
        {title}
      </h3>

      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>

      {currentUser && currentTime && (
        <div className="mt-4 mb-2 flex items-center text-xs text-gray-500">
          <span className="text-blue-400">{currentUser}</span>
          <span className="mx-2">•</span>
          <span>{currentTime}</span>
        </div>
      )}

      <div className="mt-auto pt-6 flex items-center text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <span>Learn more</span>
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </motion.div>
  );
}

// New component for the image cards
type ImageCardProps = {
  imageUrl: string;
  title: string;
  description: string;
  delay: number;
};

function ImageCard({ imageUrl, title, description, delay }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-500 group h-full flex flex-col"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-50 z-10"></div>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-400">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        <div className="mt-auto pt-6 flex items-center text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Explore</span>
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const currentUser = "vkhare2909";
  const currentTime = "2025-04-04 20:17:53";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <FaLaptopCode />,
      title: "AI-Powered Video Interviews",
      description:
        "Our advanced OpenCV-powered system analyzes facial expressions, eye contact, and speech patterns to provide comprehensive candidate assessments for skills verification.",
      imageUrl:
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      icon: <FaChartLine />,
      title: "Career Path Simulator",
      description:
        "Interactive visualization tool that projects salary growth, time-to-goal, and job opportunities based on different education and skill acquisition paths.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      icon: <FaShieldAlt />,
      title: "Blockchain Credential Verification",
      description:
        "Tamper-proof digital credentials secured on the blockchain, allowing instant verification of skills and educational achievements by employers and investors.",
      imageUrl:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
    },
    {
      icon: <FaUsers />,
      title: "Mentor-Mentee Matching",
      description:
        "AI-powered platform that connects students with industry experts based on career goals, learning style, and skill gaps for personalized guidance.",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      icon: <FaGraduationCap />,
      title: "Skills-Based Financing",
      description:
        "Innovative funding model that connects students with investors through Income Share Agreements based on career potential and skills assessment.",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1467&q=80",
    },
  ];

  // New image cards data
  const imageCards = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Investor Dashboard",
      description:
        "Comprehensive analytics platform for investors to track student progress, ROI projections, and manage their education investment portfolio.",
      delay: 0.6,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1581092921461-7384161d8ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      title: "Knowledge Marketplace",
      description:
        "Peer-to-peer platform where students can monetize their expertise by creating and selling educational content with blockchain verification.",
      delay: 0.7,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      title: "Employer Recruitment Hub",
      description:
        "Direct connection to pre-vetted talent with verified skills, allowing employers to sponsor promising students and secure future talent.",
      delay: 0.8,
    },
  ];

  return (
    <section ref={sectionRef} id="features" className="py-24 relative">
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 w-full h-20 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
        }}
      ></div>
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-20 z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
        }}
      ></div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-blue-400 uppercase tracking-wider"
          >
            Key Features
          </motion.span>

          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            Reimagine Education Financing
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            SkillBridge Pro combines AI-powered assessments, blockchain
            verification, and innovative financing models to make education
            accessible and career advancement achievable.
          </p>
        </div>

        {/* First feature gets user details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              currentUser={index === 0 ? currentUser : undefined}
              currentTime={index === 0 ? currentTime : undefined}
              imageUrl={feature.imageUrl}
            />
          ))}
        </div>

        {/* Image cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imageCards.map((card, index) => (
            <ImageCard
              key={index}
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description}
              delay={card.delay}
            />
          ))}
        </div>
      </div>

      {/* Large background glow */}
      <div
        className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: "rgba(59, 130, 246, 0.1)",
        }}
      ></div>
    </section>
  );
}
