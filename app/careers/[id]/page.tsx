"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Wifi,
  Users,
  CalendarDays,
  FileText,
  CheckCircle2,
  ChevronRight,
  Share2,
  Bookmark,
  Send,
  BadgeCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import SparkleButton from "@/components/ui/SparkleButton";
import { gsap } from "gsap";
import { LineChart } from "lucide-react";
import Layout from "@/app/components/layout/Layout";

// Mock data fetch for a specific job
const fetchJob = async (id: string) => {
  try {
    // In a real app, this would fetch from an API
    const jobs = [
      {
        id: "job-001",
        title: "Machine Learning Engineer",
        company: "TechInnovate",
        location: "San Francisco, CA",
        remote: "Hybrid",
        salary: { min: 120000, max: 160000 },
        type: "Full-time",
        postedDate: "2025-03-15T14:30:00Z",
        applicationDeadline: "2025-04-15T23:59:59Z",
        description:
          "Join our AI team to develop cutting-edge machine learning models for our product suite. You'll be working on challenging problems in computer vision, natural language processing, and recommendation systems. This role offers an opportunity to innovate and make a significant impact in how our customers interact with technology.",
        responsibilities: [
          "Design, develop and optimize machine learning models and algorithms",
          "Collaborate with product and engineering teams to integrate ML solutions",
          "Research and implement state-of-the-art ML techniques",
          "Improve model performance through continuous experimentation",
          "Analyze and interpret complex datasets to derive insights",
        ],
        requirements: [
          "Bachelor's or Master's degree in Computer Science, Machine Learning, or related field",
          "3+ years of professional experience in machine learning or related field",
          "Strong proficiency in Python and ML frameworks (TensorFlow, PyTorch)",
          "Experience with data processing, feature engineering, and model validation",
          "Knowledge of modern deep learning architectures",
          "Excellent communication and collaboration skills",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible work arrangements",
          "Professional development budget",
          "401(k) matching",
          "Paid parental leave",
          "Regular team events and retreats",
        ],
        logo: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        skills: [
          "Machine Learning",
          "Python",
          "TensorFlow",
          "PyTorch",
          "Deep Learning",
          "Data Science",
          "AI",
        ],
        companyDescription:
          "TechInnovate is a leading AI technology company focused on developing intelligent solutions that transform how businesses operate. Our mission is to make artificial intelligence accessible, ethical, and impactful for organizations of all sizes. Founded in 2018, we've grown to a team of over 150 professionals dedicated to pushing the boundaries of what's possible with AI.",
        companySize: "100-200 employees",
        companyIndustry: "Artificial Intelligence",
        companyWebsite: "https://techinnovate.example.com",
      },
    ];

    return jobs.find((job) => job.id === id) || null;
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }
};

// Mock data for user skills
const fetchUserSkills = async () => {
  return [
    { name: "Python", level: 85 },
    { name: "Machine Learning", level: 75 },
    { name: "TensorFlow", level: 70 },
    { name: "Data Science", level: 80 },
    { name: "Deep Learning", level: 65 },
  ];
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchScore, setMatchScore] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Current user info
  const currentTime = "2025-03-28 05:52:42";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const skillListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const jobData = await fetchJob(id as string);
      const skills = await fetchUserSkills();

      setJob(jobData);
      setUserSkills(skills);

      // Calculate match score based on required skills and user skills
      if (jobData && skills.length > 0) {
        const relevantSkills = skills.filter((skill) =>
          jobData.skills.some(
            (jobSkill: string) =>
              jobSkill.toLowerCase().includes(skill.name.toLowerCase()) ||
              skill.name.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );

        const score = Math.min(
          100,
          Math.round(
            (relevantSkills.length / Math.min(5, jobData.skills.length)) * 100
          )
        );
        setMatchScore(score);
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  // Animation effect for the job title and skills
  useEffect(() => {
    if (!loading && headlineRef.current) {
      // Animation timeline
      const tl = gsap.timeline();

      // Animate the headline
      tl.fromTo(
        headlineRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Animate skills list if it exists
      if (skillListRef.current) {
        const skillItems = skillListRef.current.querySelectorAll(".skill-item");

        tl.fromTo(
          skillItems,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4" // Start slightly before previous animation completes
        );
      }
    }
  }, [loading]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleApply = async () => {
    setIsApplying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsApplying(false);
    setIsApplied(true);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
        {/* Background Elements */}
        <div
          className="absolute inset-0 -z-10 parallax-bg"
          style={{ height: "150%" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(45, 212, 191, 0.05) 50%, transparent 80%)",
              height: "150%",
              width: "100%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(14,165,233,0.15) 0, rgba(0,0,0,0) 80%)",
              height: "150%",
              width: "100%",
            }}
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-200">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="relative min-h-screen py-24 overflow-hidden">
        {/* Background Elements */}
        <div
          className="absolute inset-0 -z-10 parallax-bg"
          style={{ height: "150%" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(45, 212, 191, 0.05) 50%, transparent 80%)",
              height: "150%",
              width: "100%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(14,165,233,0.15) 0, rgba(0,0,0,0) 80%)",
              height: "150%",
              width: "100%",
            }}
          />
        </div>

        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Job not found
            </h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              The job posting you're looking for doesn't exist or has been
              removed.
            </p>
            <Link href="/careers">
              <span className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all inline-block">
                Browse All Jobs
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen py-24 overflow-hidden">
        {/* Background Elements */}
        <div
          className="absolute inset-0 -z-10 parallax-bg"
          style={{ height: "150%" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(45, 212, 191, 0.05) 50%, transparent 80%)",
              height: "150%",
              width: "100%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(14,165,233,0.15) 0, rgba(0,0,0,0) 80%)",
              height: "150%",
              width: "100%",
            }}
          />
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="mb-2">
                <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium border border-white/20 inline-flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  {currentTime} • {currentUser}
                </span>
              </div>
            </div>

            <Link href="/careers">
              <span className="flex items-center text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all jobs
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main job details */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 overflow-hidden rounded-lg border border-white/20 bg-white/10">
                      <Image
                        src={job.logo}
                        alt={job.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h1
                      ref={headlineRef}
                      className="text-3xl font-bold mb-2 text-white"
                    >
                      <span className="gradient-text">{job.title}</span>
                    </h1>
                    <div className="text-xl text-gray-300 mb-4">
                      {job.company}
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-300">
                        <MapPin className="h-4 w-4 text-indigo-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Wifi className="h-4 w-4 text-purple-400" />
                        <span>{job.remote}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Briefcase className="h-4 w-4 text-teal-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <DollarSign className="h-4 w-4 text-indigo-400" />
                        <span>
                          ${formatCurrency(job.salary.min)} - $
                          {formatCurrency(job.salary.max)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 py-4 border-t border-b border-white/10">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">
                      Posted: {formatDate(job.postedDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <CalendarDays className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">
                      Apply by: {formatDate(job.applicationDeadline)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-white flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-indigo-400" />
                      Job Description
                    </h2>
                    <p className="text-gray-300 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-white flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-purple-400" />
                      Responsibilities
                    </h2>
                    <ul className="list-none space-y-2 text-gray-300">
                      {job.responsibilities.map(
                        (item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 mt-0.5 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 flex-shrink-0">
                              <span className="text-xs">{index + 1}</span>
                            </div>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-white flex items-center">
                      <Star className="h-5 w-5 mr-2 text-teal-400" />
                      Requirements
                    </h2>
                    <ul className="list-none space-y-2 text-gray-300">
                      {job.requirements.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-5 w-5 mt-0.5 flex items-center justify-center rounded-full bg-teal-500/20 text-teal-400 flex-shrink-0">
                            <span className="text-xs">{index + 1}</span>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-white flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-indigo-400" />
                      Benefits
                    </h2>
                    <ul className="list-none space-y-2 text-gray-300">
                      {job.benefits.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-5 w-5 mt-0.5 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                            <span className="text-xs">✓</span>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <BadgeCheck className="h-5 w-5 mr-2 text-purple-400" />
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                  <Building className="h-5 w-5 mr-2 text-indigo-400" />
                  About {job.company}
                </h2>

                <div className="space-y-4">
                  <p className="text-gray-300">{job.companyDescription}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Company Size
                        </div>
                        <div className="font-medium text-white">
                          {job.companySize}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Industry</div>
                        <div className="font-medium text-white">
                          {job.companyIndustry}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center group"
                    >
                      Visit company website
                      <ExternalLink className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 sticky top-20"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-purple-400" />
                    Your Match Score
                  </h2>

                  <div className="relative mb-6">
                    <div className="text-center mb-3">
                      <span className="text-4xl font-bold text-white">
                        {matchScore}%
                      </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{ width: `${matchScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
                    <h3 className="font-medium text-white mb-3">
                      Skills Analysis
                    </h3>

                    <div className="space-y-3" ref={skillListRef}>
                      {userSkills.map((skill, index) => {
                        const isRelevant = job.skills.some(
                          (jobSkill: string) =>
                            jobSkill
                              .toLowerCase()
                              .includes(skill.name.toLowerCase()) ||
                            skill.name
                              .toLowerCase()
                              .includes(jobSkill.toLowerCase())
                        );

                        return (
                          <div
                            key={skill.name}
                            className="flex justify-between items-center skill-item"
                          >
                            <div className="flex items-center gap-2">
                              {isRelevant ? (
                                <CheckCircle2 className="h-4 w-4 text-teal-400" />
                              ) : (
                                <span className="w-4" />
                              )}
                              <span
                                className={
                                  isRelevant
                                    ? "font-medium text-white"
                                    : "text-gray-400"
                                }
                              >
                                {skill.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium w-5 text-right text-gray-300">
                                {skill.level}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {isApplied ? (
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg mb-4">
                      <h3 className="font-medium text-indigo-300 mb-1 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Application Submitted!
                      </h3>
                      <p className="text-sm text-gray-300">
                        Your application has been sent. The company will review
                        your profile and contact you if there's a match.
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={!isApplying ? handleApply : undefined}
                      style={{
                        cursor: isApplying ? "default" : "pointer",
                        opacity: isApplying ? 0.7 : 1,
                      }}
                    >
                      <SparkleButton
                        href="#"
                        className="w-full mb-4 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                      >
                        {isApplying ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply Now
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </SparkleButton>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center justify-center">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center justify-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h3 className="font-medium mb-3 text-white">Similar Jobs</h3>
                  <Link href="/careers">
                    <span className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center group">
                      Browse related positions
                      <ChevronRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Global styles to match Hero.tsx */}
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
            background: linear-gradient(to right, #38bdf8, #d946ef, #2dd4bf);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
        `}</style>
      </div>
    </Layout>
  );
}
