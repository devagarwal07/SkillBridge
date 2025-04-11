"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkillGraph } from "@/components/visualizations/skill-graph";
import SparkleButton from "@/components/ui/SparkleButton";
import BackgroundGradient from "@/app/components/ui/Aurora";
import Layout from "../components/layout/Layout";
import {
  BadgeCheck,
  ArrowRight,
  Search,
  Clock,
  BarChart,
  Award,
  Shield,
  Plus,
  Filter,
  Briefcase,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import useNavigate from "next/navigation";
import { generateSkillQuestions } from "@/lib/gemini-api";
import { cn } from "@/lib/utils";

// Mock data fetch - replace with actual API calls later
const fetchUserSkills = async () => {
  try {
    const response = await fetch("/data/students.json");
    const students = await response.json();
    return students[0].skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

const fetchAvailableSkills = async () => {
  try {
    const response = await fetch("/data/skills.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching skills catalog:", error);
    return [];
  }
};

export default function SkillAssessment() {
  // Current user info
  const currentTime = "2025-03-28 07:08:39";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-skills");

  // For assessment flow
  const [assessmentMode, setAssessmentMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    level: number;
    feedback: string;
  } | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const skills = await fetchUserSkills();
      const catalog = await fetchAvailableSkills();

      setUserSkills(skills);
      setAvailableSkills(catalog);
      setFilteredSkills(catalog);
      setLoading(false);
    };

    loadData();
  }, []);

  // Animation effect for the heading
  useEffect(() => {
    if (!loading && headlineRef.current) {
      // Animation timeline
      const tl = gsap.timeline();

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
    }
  }, [loading]);

  useEffect(() => {
    // Filter skills based on search query and category
    if (availableSkills.length > 0) {
      let filtered = [...availableSkills];

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (skill) =>
            skill.name.toLowerCase().includes(lowerQuery) ||
            skill.category.toLowerCase().includes(lowerQuery) ||
            skill.description.toLowerCase().includes(lowerQuery)
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          (skill) => skill.category === selectedCategory
        );
      }

      setFilteredSkills(filtered);
    }
  }, [searchQuery, selectedCategory, availableSkills]);

  const startAssessment = async (skill: any) => {
    setSelectedSkill(skill);
    setAssessmentMode(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAssessmentComplete(false);
    setAssessmentResult(null);

    setLoadingQuestions(true);
    try {
      // Generate questions using Gemini API
      const questions = await generateSkillQuestions(
        skill.name,
        "intermediate"
      );
      setAssessmentQuestions(questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback to sample questions if API fails
      setAssessmentQuestions([
        {
          question: `What is a key feature of ${skill.name}?`,
          options: [
            "Sample answer 1",
            "Sample answer 2",
            "Sample answer 3",
            "Sample answer 4",
          ],
          correctAnswer: 1,
          explanation: "This is a sample explanation.",
        },
        {
          question: `How would you implement ${skill.name} in a project?`,
          options: [
            "Sample approach 1",
            "Sample approach 2",
            "Sample approach 3",
            "Sample approach 4",
          ],
          correctAnswer: 2,
          explanation: "This is a sample explanation.",
        },
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const answerQuestion = (optionIndex: number) => {
    // Store the user's answer
    const updatedAnswers = [...userAnswers, optionIndex];
    setUserAnswers(updatedAnswers);

    // Move to next question or complete assessment
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      completeAssessment(updatedAnswers);
    }
  };

  const completeAssessment = (answers: number[]) => {
    setAssessmentComplete(true);

    // Calculate result (in real implementation, this would use the Gemini API)
    const correctAnswers = answers.filter(
      (answer, index) => answer === assessmentQuestions[index].correctAnswer
    ).length;

    const score = Math.round(
      (correctAnswers / assessmentQuestions.length) * 100
    );

    setAssessmentResult({
      level: score,
      feedback: `
        <p>You answered ${correctAnswers} out of ${assessmentQuestions.length} questions correctly.</p>
        <p class="mt-4"><strong>Strengths:</strong> You demonstrated good understanding of the core concepts.</p>
        <p class="mt-2"><strong>Areas for improvement:</strong> Consider focusing on advanced techniques and practical applications.</p>
        <p class="mt-4"><strong>Recommended resources:</strong></p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>"Advanced ${selectedSkill.name}" by TechEd Academy</li>
          <li>${selectedSkill.name} Documentation</li>
        </ul>
      `,
    });

    // In a real implementation, we would update the user's skill in the database
    if (score > 0) {
      // Check if user already has this skill
      const existingSkillIndex = userSkills.findIndex(
        (s) => s.name === selectedSkill.name
      );

      if (existingSkillIndex >= 0) {
        // Update existing skill
        const updatedSkills = [...userSkills];
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          level: score,
          lastVerified: new Date().toISOString(),
        };
        setUserSkills(updatedSkills);
      } else {
        // Add new skill
        const newSkill = {
          id: `skill-${Date.now()}`,
          name: selectedSkill.name,
          level: score,
          lastVerified: new Date().toISOString(),
          endorsements: 0,
        };
        setUserSkills([...userSkills, newSkill]);
      }
    }
  };

  const resetAssessment = () => {
    setAssessmentMode(false);
    setSelectedSkill(null);
    setAssessmentQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setAssessmentComplete(false);
    setAssessmentResult(null);
  };

  // Get unique categories from available skills
  const categories = [
    ...new Set(availableSkills.map((skill) => skill.category)),
  ];

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
            Loading skill assessment...
          </p>
        </div>
      </div>
    );
  }

  // Assessment mode takes over the UI
  if (assessmentMode) {
    return (
      <Layout>
        <div className="relative min-h-screen py-24 overflow-hidden">
          <BackgroundGradient />

          <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-2">
              <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium border border-white/20 inline-flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {currentTime} • {currentUser}
              </span>
            </div>

            <div className="mb-8">
              <button
                onClick={resetAssessment}
                className="mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Skills
              </button>

              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <span className="gradient-text">{selectedSkill.name}</span>{" "}
                  Assessment
                </h1>
                {!assessmentComplete && (
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-none text-sm">
                    Question {currentQuestionIndex + 1} of{" "}
                    {assessmentQuestions.length}
                  </Badge>
                )}
              </div>

              <div className="mt-2 text-gray-300">
                {selectedSkill.description}
              </div>
            </div>

            {loadingQuestions ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-12 flex flex-col items-center justify-center">
                <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-white">
                  Generating assessment questions...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Using AI to create personalized questions for your skill level
                </p>
              </div>
            ) : assessmentComplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {assessmentResult?.level}
                      </span>
                    </div>
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeOpacity="0.1"
                        className="text-white/10"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#skill-score-gradient)"
                        strokeWidth="5"
                        strokeDasharray="282.74"
                        initial={{ strokeDashoffset: 282.74 }}
                        animate={{
                          strokeDashoffset:
                            282.74 * (1 - (assessmentResult?.level || 0) / 100),
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>

                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id="skill-score-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" style={{ stopColor: "#38bdf8" }} />
                          <stop offset="50%" style={{ stopColor: "#d946ef" }} />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#2dd4bf" }}
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Assessment Complete
                    </h2>
                    <p className="text-gray-300">
                      Your {selectedSkill.name} skill level has been verified
                    </p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Skill Level: {assessmentResult?.level}/100
                  </h3>
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: assessmentResult?.feedback || "",
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={resetAssessment}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Return to Skills
                  </button>
                  <Link href="/marketplace">
                    <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all">
                      Find Courses to Improve
                    </button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-8"
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">
                    {assessmentQuestions[currentQuestionIndex]?.question}
                  </h2>

                  <div className="space-y-3 mb-6">
                    {assessmentQuestions[currentQuestionIndex]?.options.map(
                      (option: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => answerQuestion(index)}
                          className="w-full p-4 text-left rounded-lg border border-white/20 hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors duration-200 text-white"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      <Clock className="inline mr-1 h-4 w-4" />
                      Take your time to consider each answer
                    </div>
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{
                          width: `${
                            (currentQuestionIndex /
                              assessmentQuestions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen py-24 overflow-hidden">
        <BackgroundGradient />

        <div className="container mx-auto px-6">
          <div className="mb-2">
            <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium border border-white/20 inline-flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {currentTime} • {currentUser}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1
                ref={headlineRef}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                <span className="gradient-text">Skill</span>{" "}
                <span className="text-white">Assessment</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Verify your skills and showcase your expertise to employers and
                investors
              </p>
            </div>
            <SparkleButton
              href="/marketplace"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              Find Learning Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </SparkleButton>
          </div>

          <div className="flex border-b border-white/10 mb-8">
            <button
              className={cn(
                "px-6 py-2 font-medium text-sm transition-colors relative",
                activeTab === "my-skills"
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              )}
              onClick={() => setActiveTab("my-skills")}
            >
              My Skills
              {activeTab === "my-skills" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  layoutId="activeTab"
                />
              )}
            </button>

            <button
              className={cn(
                "px-6 py-2 font-medium text-sm transition-colors relative",
                activeTab === "add-skills"
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              )}
              onClick={() => setActiveTab("add-skills")}
            >
              Add New Skills
              {activeTab === "add-skills" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  layoutId="activeTab"
                />
              )}
            </button>
            <Link href="/skill-assessment/coding-test">
              <button
                className={cn(
                  "px-6 py-2 font-medium text-sm transition-colors relative",
                  activeTab === "code-test"
                    ? "text-indigo-400"
                    : "text-gray-400 hover:text-gray-200"
                )}
                onClick={() => {
                  setActiveTab("coding-test");
                }}
              >
                Take a Coding Test
                {activeTab === "coding-test" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
            </Link>
          </div>

          {activeTab === "my-skills" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Your Verified Skills
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <BadgeCheck className="h-4 w-4 text-indigo-400" />
                      <span className="text-gray-300">
                        {userSkills.length} Verified Skills
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <Shield className="h-4 w-4 text-teal-400" />
                      <span className="text-gray-300">Blockchain Secured</span>
                    </div>
                  </div>
                </div>

                {userSkills.length > 0 ? (
                  <div className="h-[400px] mb-6">
                    <SkillGraph skills={userSkills} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-lg">
                    <BadgeCheck className="h-16 w-16 text-gray-400 mb-6" />
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      No Verified Skills Yet
                    </h3>
                    <p className="text-gray-300 text-center max-w-md mb-8">
                      Start by adding and verifying your skills to showcase your
                      expertise to potential employers and investors.
                    </p>
                    <button
                      onClick={() => setActiveTab("add-skills")}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      Add Your First Skill
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {userSkills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Skill Details
                    </h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {userSkills.map((skill) => {
                        // Calculate days since verification
                        const lastVerified = new Date(skill.lastVerified);
                        const now = new Date();
                        const daysSince = Math.floor(
                          (now.getTime() - lastVerified.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        const isRecent = daysSince < 30;

                        return (
                          <div
                            key={skill.id}
                            className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-indigo-500/40 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-white">
                                {skill.name}
                              </h4>
                              <Badge
                                className={
                                  isRecent
                                    ? "bg-indigo-500/20 text-indigo-300 border-none"
                                    : "bg-white/5 text-gray-300 border border-white/10"
                                }
                              >
                                {isRecent ? "Recent" : `${daysSince}d ago`}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-10 text-right text-white">
                                {skill.level}/100
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-400">
                                <Award className="h-3 w-3" />
                                <span>{skill.endorsements} endorsements</span>
                              </div>
                              <button
                                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                                onClick={() => {
                                  const fullSkill = availableSkills.find(
                                    (s) => s.name === skill.name
                                  ) || {
                                    name: skill.name,
                                    description: `${skill.name} skills and knowledge`,
                                    category: "Other",
                                  };
                                  startAssessment(fullSkill);
                                }}
                              >
                                Re-verify
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Job Market Impact
                  </h2>
                  <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all text-sm">
                    View Full Report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-5 w-5 text-indigo-400" />
                      <h3 className="font-semibold text-white">
                        Job Opportunities
                      </h3>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-white">
                      247
                    </div>
                    <p className="text-sm text-gray-400">
                      Jobs matching your verified skills in your preferred
                      locations
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart className="h-5 w-5 text-purple-400" />
                      <h3 className="font-semibold text-white">
                        Salary Potential
                      </h3>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-white">
                      $94,500
                    </div>
                    <p className="text-sm text-gray-400">
                      Average salary based on your highest-level skills
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUpRight className="h-5 w-5 text-teal-400" />
                      <h3 className="font-semibold text-white">Skill Gaps</h3>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-white">
                      3 Key Skills
                    </div>
                    <p className="text-sm text-gray-400">
                      Add these skills to unlock 40% more opportunities
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
                  <input
                    placeholder="Search skills..."
                    className="w-full pl-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      selectedCategory === null
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
                    } transition-all`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
                      } transition-all`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill, index) => {
                  // Check if user already has this skill
                  const userSkill = userSkills.find(
                    (s) => s.name === skill.name
                  );
                  const isVerified = !!userSkill;

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white/5 p-5 rounded-lg border border-white/10 hover:border-indigo-500/40 transition-all hover:shadow-md group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">
                            {skill.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {skill.category}
                          </p>
                        </div>
                        {isVerified ? (
                          <Badge className="bg-teal-500/20 text-teal-300 border-none">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-white/5 text-gray-300 border border-white/10">
                            Not Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm mb-4 line-clamp-2 text-gray-300">
                        {skill.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Market Demand</span>
                          <span className="font-medium text-white">
                            {skill.demandScore}/100
                          </span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                            style={{ width: `${skill.demandScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                          Salary: +${skill.averageSalaryImpact.toLocaleString()}
                        </div>
                        <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          Growth: {skill.growthRate}%
                        </div>
                      </div>

                      <div className="flex justify-between">
                        {isVerified ? (
                          <button
                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all"
                            onClick={() => startAssessment(skill)}
                          >
                            Re-verify ({userSkill.level}/100)
                          </button>
                        ) : (
                          <button
                            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            onClick={() => startAssessment(skill)}
                          >
                            Verify Skill
                            <Zap className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredSkills.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-lg">
                  <AlertCircle className="h-16 w-16 text-gray-400 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    No Skills Found
                  </h3>
                  <p className="text-gray-300 text-center max-w-md mb-8">
                    We couldn't find any skills matching your search. Try
                    adjusting your search term or category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Global styles */}
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
