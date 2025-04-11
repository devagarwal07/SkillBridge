"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import LoadingSpinner from "../../components/ui/LoadingScreen";
import {
  BarChart,
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
  ChartLine,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  FileText,
  Star,
  MoreHorizontal,
  Wallet,
  ChevronRight,
  Award,
  Bell,
  Settings,
  ExternalLink,
  Sparkles,
  Laptop,
  LucideIcon,
  Lightbulb,
  Users,
  Target,
  Zap,
  Brain,
  ListChecks,
  Code,
  Lock,
  Layers,
  Cloud,
  Terminal,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StudentProgressChart } from "@/components/visualizations/student-progress-chart";
import { CareerMap } from "@/components/visualizations/career-map";
import { formatCurrency } from "@/lib/utils";
import Layout from "@/app/components/layout/Layout";
import LoadingScreen from "@/app/funding/apply/components/LoadingScreen";

// Current time and user - exact values as requested
const currentTime = "2025-04-05 23:15:20";
const currentUser = "vkhare2909";

// Mock data fetch - would be replaced with real API calls
const fetchStudentData = async () => {
  try {
    const response = await fetch("/data/students.json");
    const students = await response.json();
    return students[0]; // Return the first student for demo purposes
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
};

const fetchCoursesData = async () => {
  try {
    const response = await fetch("/data/courses.json");
    const courses = await response.json();
    return courses; // Return all courses
  } catch (error) {
    console.error("Error fetching courses data:", error);
    return [];
  }
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const loadData = async () => {
      const studentData = await fetchStudentData();
      const coursesData = await fetchCoursesData();

      setStudent(studentData);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter courses based on search and filters
    if (courses.length > 0) {
      let filtered = [...courses];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.provider.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          (course) => course.category === selectedCategory
        );
      }

      if (selectedSkill) {
        filtered = filtered.filter((course) =>
          course.skills.some(
            (skill: string) =>
              skill.toLowerCase() === selectedSkill.toLowerCase()
          )
        );
      }

      setFilteredCourses(filtered);
    }
  }, [searchQuery, selectedCategory, selectedSkill, courses]);

  // Statistics animation with GSAP
  useEffect(() => {
    if (!loading && statsRef.current) {
      const statValues = statsRef.current.querySelectorAll(".stat-value");

      gsap.fromTo(
        statValues,
        { textContent: 0 },
        {
          textContent: (i: number, target: HTMLElement) => {
            return target.getAttribute("data-value");
          },
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.2,
          onUpdate: function () {
            // Format numbers with commas
            statValues.forEach((stat) => {
              const value = parseInt(stat.textContent || "0");
              const format = stat.getAttribute("data-format");
              // @ts-ignore - textContent exists on HTMLElement
              if (format === "currency") {
                stat.textContent = formatCurrency(value);
              } else {
                stat.textContent = value.toLocaleString();
              }
            });
          },
        }
      );
    }
  }, [loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Calculate metrics
  const creditScore = student.educationCreditScore;
  const completedCourses = student?.completedCourses || 0; // Add safe access
  const totalFunding = student?.funding?.received || 0; // Add safe access
  // Add optional chaining and default empty array for milestones
  const remainingMilestones = (student?.funding?.milestones ?? []).filter(
    (m: any) => !m.completed
  ).length;

  // Course categories
  const courseCategories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  // Student skills
  const studentSkills = student.skills.map((skill: any) => skill.name);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 text-white">
        {/* User information display */}
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3 shadow-xl">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300 text-sm font-medium">
            {currentTime}
          </span>
          <div className="h-4 w-px bg-slate-700/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-300 text-sm font-medium">
              {currentUser}
            </span>
          </div>
        </div>

        {/* Top navigation bar */}

        {/* Background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[5%] w-[90%] h-[20%] rounded-full bg-blue-900/20 blur-[120px]"></div>
          <div className="absolute bottom-0 right-[10%] w-[80%] h-[15%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
          <div className="absolute top-[20%] right-[30%] w-[40%] h-[30%] rounded-full bg-purple-900/10 blur-[120px] opacity-70"></div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]"></div>

          {/* Noise texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto py-8 px-4 min-h-screen">
          {/* Welcome header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/60 shadow-xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  Welcome back, {student.name.split(" ")[0]}
                </h1>
                <p className="text-slate-400 mt-1">
                  Your learning dashboard has been updated with the latest
                  progress data
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  My Schedule
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20">
                  <Laptop className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </div>
            </div>

            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            >
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/20 rounded-xl overflow-hidden shadow-lg border border-slate-700/30 group hover:border-blue-500/30 transition-all duration-200">
                <div className="relative p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20">
                        <ChartLine className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Education Credit Score
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span className="stat-value" data-value={creditScore}>
                        0
                      </span>
                      <span className="text-lg ml-0.5">/900</span>
                    </span>
                    <div className="mt-2 text-xs text-blue-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+15 points from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/20 rounded-xl overflow-hidden shadow-lg border border-slate-700/30 group hover:border-indigo-500/30 transition-all duration-200">
                <div className="relative p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-600/0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Completed Courses
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span
                        className="stat-value"
                        data-value={completedCourses}
                      >
                        0
                      </span>
                      <span className="text-lg ml-0.5">Courses</span>
                    </span>
                    <div className="mt-2 text-xs text-indigo-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+2 this quarter</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/20 rounded-xl overflow-hidden shadow-lg border border-slate-700/30 group hover:border-purple-500/30 transition-all duration-200">
                <div className="relative p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Total Funding
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      $
                      <span
                        className="stat-value"
                        data-value={totalFunding}
                        data-format="currency"
                      >
                        0
                      </span>
                    </span>
                    <div className="mt-2 text-xs text-purple-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+$8,500 pending approval</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/20 rounded-xl overflow-hidden shadow-lg border border-slate-700/30 group hover:border-emerald-500/30 transition-all duration-200">
                <div className="relative p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-600/0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Remaining Milestones
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span
                        className="stat-value"
                        data-value={remainingMilestones}
                      >
                        0
                      </span>
                      <span className="text-lg ml-0.5">To Complete</span>
                    </span>
                    <div className="mt-2 text-xs text-emerald-400/80 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>Next due in 7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-500/20 text-blue-400">
                      <BarChart className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Learning Progress
                    </h2>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                    >
                      All Time
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      This Year
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      This Quarter
                    </Button>
                  </div>
                </div>

                <div className="h-80 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-inner">
                  <StudentProgressChart
                    data={{
                      months: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        {
                          name: "Credit Score",
                          data: [
                            580, 600, 620, 635, 650, 670, 685, 700, 715, 730,
                            745, 760,
                          ],
                        },
                        {
                          name: "Courses Completed",
                          data: [1, 1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9],
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 border-t border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-900/30 text-amber-400 border border-amber-500/20">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Upcoming Deadlines
                    </h2>
                  </div>
                  <Link
                    href="/student/schedule"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-amber-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-amber-900/30 text-amber-400 border border-amber-500/20 group-hover:bg-amber-900/40 group-hover:border-amber-500/40 transition-all duration-200">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-amber-300 transition-all duration-200">
                        Machine Learning Final Project
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Course: Advanced ML Techniques</span>
                        <span className="text-amber-400 font-medium">
                          Due in 3 days
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">25%</div>
                      <div className="w-20 bg-slate-700/50 h-1.5 rounded-full mt-1">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:bg-blue-900/40 group-hover:border-blue-500/40 transition-all duration-200">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-blue-300 transition-all duration-200">
                        Blockchain Certification Exam
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Credential: Blockchain Developer</span>
                        <span>May 15, 2025</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">90%</div>
                      <div className="w-20 bg-slate-700/50 h-1.5 rounded-full mt-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-emerald-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-900/40 group-hover:border-emerald-500/40 transition-all duration-200">
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-emerald-300 transition-all duration-200">
                        Funding Milestone: Portfolio Submission
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Milestone: 3 of 5</span>
                        <span>June 30, 2025</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">65%</div>
                      <div className="w-20 bg-slate-700/50 h-1.5 rounded-full mt-1">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skill Development Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                      <Brain className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Skill Development
                    </h2>
                  </div>
                  <Link href="/student/skills">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                    >
                      Detailed View
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {student.skills
                    .sort((a: any, b: any) => b.level - a.level)
                    .slice(0, 5)
                    .map((skill: any, index: number) => (
                      <div
                        key={skill.id}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700/50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-lg ${getSkillIconBg(
                                index
                              )} ${getSkillIconColor(index)}`}
                            >
                              {getSkillIcon(skill.name, 16)}
                            </div>
                            <span className="font-medium text-white">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-white">
                            Level {skill.level}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getSkillProgressColor(
                              index
                            )}`}
                            style={{ width: `${(skill.level / 10) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-slate-400">Beginner</span>
                          <span className="text-slate-400">Advanced</span>
                          <span className="text-slate-400">Expert</span>
                        </div>
                      </div>
                    ))}

                  <div className="pt-2">
                    <Link href="/student/skills/development">
                      <Button className="w-full border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white">
                        Explore More Skills
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Current Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Current Courses
                  </h2>
                </div>
                <Link href="/student/courses">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                  >
                    View All Courses
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 border-b border-slate-800/50 bg-slate-800/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search by course name, provider, or skill..."
                    className="pl-10 bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    size="sm"
                    className={
                      !selectedCategory
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white"
                    }
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </Button>

                  {courseCategories.map((category: string) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        selectedCategory === category
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white"
                      }
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(student?.currentCourses ?? []).map(
                  (
                    course: any,
                    index: number // Added safe access
                  ) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                      className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 border border-slate-700/50 hover:border-blue-500/30 transform hover:translate-y-[-5px] transition-all duration-300"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={
                            course.image ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80"
                          }
                          alt={course.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                        <div className="absolute top-0 right-0 bg-black/40 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-bl-lg border-l border-b border-white/10 flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getCourseStatusColor(
                              course.progress
                            )}`}
                          ></div>
                          {getCourseStatusText(course.progress)}
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="font-semibold group-hover:text-blue-300 transition-colors duration-200">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-300">
                            {course.provider}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-400">
                              Progress
                            </span>
                            <span className="text-sm font-medium text-white">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {course.skills
                            .slice(0, 3)
                            .map((skill: string, i: number) => (
                              <span
                                key={`${course.id}-${skill}`}
                                className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg ${
                                  i === 0
                                    ? "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                                    : i === 1
                                    ? "bg-indigo-900/30 text-indigo-400 border border-indigo-500/20"
                                    : "bg-purple-900/30 text-purple-400 border border-purple-500/20"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                              Next session:
                            </span>
                            <span className="text-white">
                              {course.nextSession}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Deadline:</span>
                            <span className="text-white">
                              {course.deadline}
                            </span>
                          </div>
                          <Link href={`/student/courses/${course.id}`}>
                            <Button
                              className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/30"
                              size="sm"
                            >
                              Continue Learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}

                {/* Course recommendation card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl overflow-hidden shadow-xl border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 rounded-xl bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 mb-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Discover New Courses
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Find courses that match your career goals and skill
                      development needs
                    </p>
                    <Link href="/student/courses/discover">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg">
                        Explore Courses
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Row: Learning Path and Funding */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20">
                      <ListChecks className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Learning Path
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Edit Path
                  </Button>
                </div>
              </div>
              // Update the line 993 that's causing the error with proper null
              checking:
              {/* Learning Path Section */}
              <div className="p-6 space-y-4">
                {student?.learningPath ? (
                  // If learningPath exists, map through it
                  student.learningPath.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] transition-all duration-200 cursor-pointer ${
                        item.completed
                          ? "hover:border-emerald-500/30"
                          : index ===
                            student.learningPath.findIndex(
                              (i: any) => !i.completed
                            )
                          ? "hover:border-blue-500/30"
                          : "hover:border-slate-600/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2.5 rounded-lg ${
                            item.completed
                              ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/20"
                              : index ===
                                student.learningPath.findIndex(
                                  (i: any) => !i.completed
                                )
                              ? "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                              : "bg-slate-700/30 text-slate-400 border border-slate-600/20"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            getPathIcon(item.type)
                          )}
                        </div>
                        <h3
                          className={`font-semibold ${
                            item.completed
                              ? "text-emerald-300"
                              : index ===
                                student.learningPath.findIndex(
                                  (i: any) => !i.completed
                                )
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p
                        className={`text-sm ml-11 ${
                          item.completed
                            ? "text-slate-400"
                            : index ===
                              student.learningPath.findIndex(
                                (i: any) => !i.completed
                              )
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        {item.description}
                      </p>
                      {item.completed ? (
                        <div className="flex justify-between mt-3 ml-11 text-sm text-emerald-400">
                          <span>Completed on {item.completedDate}</span>
                          {item.credential && (
                            <span className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5" />
                              {item.credential}
                            </span>
                          )}
                        </div>
                      ) : index ===
                        student.learningPath.findIndex(
                          (i: any) => !i.completed
                        ) ? (
                        <div className="mt-3 ml-11">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-800/70 hover:bg-slate-700 text-white border-slate-700 text-xs"
                          >
                            Start Now
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  // If learningPath doesn't exist, show a placeholder
                  <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700/50">
                    <div className="p-3 bg-slate-800/80 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                      <ListChecks className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Create Your Learning Path
                    </h3>
                    <p className="text-slate-400 max-w-xs mx-auto mb-4">
                      Define your educational journey with personalized
                      milestones and goals.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Learning Path
                    </Button>
                  </div>
                )}

                <div className="pt-2">
                  <Link href="/student/learning-path">
                    <Button className="w-full border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white">
                      View Complete Learning Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Funding Opportunities
                    </h2>
                  </div>
                  <Link href="/funding">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-5 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-medium text-white">
                        Current Funding
                      </h3>
                    </div>
                    <Link href="/student/funding/details">
                      <span className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                        Details
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded-lg border border-slate-700/50 p-3">
                      <div className="text-sm text-slate-400 mb-1">
                        Total Received
                      </div>
                      <div className="text-xl font-bold text-white">
                        ${formatCurrency(student.funding.received)}
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg border border-slate-700/50 p-3">
                      <div className="text-sm text-slate-400 mb-1">
                        Repayment Terms
                      </div>
                      <div className="text-xl font-bold text-white">
                        {student.funding.repaymentTerms}
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg border border-slate-700/50 p-3">
                      <div className="text-sm text-slate-400 mb-1">
                        Contract End
                      </div>
                      <div className="text-xl font-bold text-white">
                        {student.funding.contractEnd}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer">
                  <div className="relative h-40">
                    <Image
                      src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80"
                      alt="Tech Ventures Fund"
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold group-hover:text-indigo-300 transition-colors duration-200">
                        Tech Ventures Fund
                      </h3>
                      <p className="text-sm text-slate-300">
                        Specialized in technology education funding
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 bg-indigo-500/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                      98% Match to Your Profile
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">
                          Funding Available
                        </span>
                        <span className="text-sm font-medium text-white">
                          Up to $25,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">
                          Interest Rate
                        </span>
                        <span className="text-sm font-medium text-white">
                          7% fixed
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Repayment Terms
                        </span>
                        <span className="text-sm font-medium text-white">
                          Income-based
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-900/10"
                        size="sm"
                      >
                        Apply Now
                      </Button>
                      <Link href="/funding/opportunities/tech-ventures">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-700 bg-slate-700/40 hover:bg-slate-700 text-white"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:bg-blue-900/40 group-hover:border-blue-500/40 transition-all duration-200">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                        Scholarship Opportunity
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Tech Women Rising scholarship for female students pursuing
                      technology careers
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-white font-medium">$5,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-400">Deadline:</span>
                      <span className="text-white font-medium">
                        May 30, 2025
                      </span>
                    </div>
                    <Link href="/funding/scholarships/tech-women">
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300 p-0 mt-3 h-auto font-normal text-sm"
                      >
                        Check Eligibility
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-purple-500/30 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20 group-hover:bg-purple-900/40 group-hover:border-purple-500/40 transition-all duration-200">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-200">
                        Quick Grant
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Rapid approval microgrant for educational expenses and
                      certification fees
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-white font-medium">
                        Up to $1,500
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-400">Processing:</span>
                      <span className="text-white font-medium">48 hours</span>
                    </div>
                    <Link href="/funding/quick-grants">
                      <Button
                        variant="link"
                        className="text-purple-400 hover:text-purple-300 p-0 mt-3 h-auto font-normal text-sm"
                      >
                        Apply Now
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer with session info */}
        <footer className="fixed bottom-0 inset-x-0 z-30 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800/50 py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              <span className="font-medium text-slate-300">
                SkillBridgege Pro
              </span>{" "}
              • Student Dashboard
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

// Helper functions for icons and colors
function getSkillIcon(skillName: string, size: number): React.ReactNode {
  const skillIcons: Record<string, LucideIcon> = {
    "Machine Learning": Brain,
    Python: FileText,
    "Data Analysis": BarChart,
    JavaScript: FileText,
    React: Code,
    Blockchain: Lock,
    "UI/UX Design": Layers,
    "Cloud Computing": Cloud,
    DevOps: Terminal,
    "Mobile Development": Smartphone,
  };

  // Return the corresponding icon or a default icon
  const Icon = skillIcons[skillName] || FileText;
  return <Icon size={size} />;
}

function getSkillIconBg(index: number): string {
  const backgrounds = [
    "bg-blue-900/30 border-blue-500/20",
    "bg-indigo-900/30 border-indigo-500/20",
    "bg-purple-900/30 border-purple-500/20",
    "bg-emerald-900/30 border-emerald-500/20",
    "bg-amber-900/30 border-amber-500/20",
  ];
  return backgrounds[index % backgrounds.length];
}

function getSkillIconColor(index: number): string {
  const colors = [
    "text-blue-400",
    "text-indigo-400",
    "text-purple-400",
    "text-emerald-400",
    "text-amber-400",
  ];
  return colors[index % colors.length];
}

function getSkillProgressColor(index: number): string {
  const colors = [
    "bg-gradient-to-r from-blue-600 to-blue-400",
    "bg-gradient-to-r from-indigo-600 to-indigo-400",
    "bg-gradient-to-r from-purple-600 to-purple-400",
    "bg-gradient-to-r from-emerald-600 to-emerald-400",
    "bg-gradient-to-r from-amber-600 to-amber-400",
  ];
  return colors[index % colors.length];
}

function getCourseStatusColor(progress: number): string {
  if (progress >= 75) return "bg-emerald-400";
  if (progress >= 25) return "bg-blue-400";
  return "bg-amber-400";
}

function getCourseStatusText(progress: number): string {
  if (progress >= 75) return "Almost Complete";
  if (progress >= 25) return "In Progress";
  return "Just Started";
}

function getPathIcon(type: string): React.ReactNode {
  switch (type) {
    case "course":
      return <BookOpen className="h-5 w-5" />;
    case "certification":
      return <Award className="h-5 w-5" />;
    case "project":
      return <Laptop className="h-5 w-5" />;
    case "milestone":
      return <Target className="h-5 w-5" />;
    default:
      return <GraduationCap className="h-5 w-5" />;
  }
}
