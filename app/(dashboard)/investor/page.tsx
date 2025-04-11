"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  BarChart,
  Users,
  DollarSign,
  Briefcase,
  TrendingUp,
  PieChart,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  GraduationCap,
  Star,
  MoreHorizontal,
  Wallet,
  ChevronRight,
  Award,
  Bell,
  Settings,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { InvestorPortfolioChart } from "@/components/visualizations/investor-portfolio-chart";
import { InvestmentMap } from "@/components/visualizations/investment-map";
import { formatCurrency } from "@/lib/utils";
import Layout from "@/app/components/layout/Layout";
import LoadingScreen from "@/app/funding/apply/components/LoadingScreen";

// Current time and user - exact values as requested
const currentTime = "2025-04-05 18:00:25";
const currentUser = "vkhare2909";

// Mock data fetch - would be replaced with real API calls
const fetchInvestorData = async () => {
  try {
    const response = await fetch("/data/investors.json");
    const investors = await response.json();
    return investors[0]; // Return the first investor for demo purposes
  } catch (error) {
    console.error("Error fetching investor data:", error);
    return null;
  }
};

const fetchStudentData = async () => {
  try {
    const response = await fetch("/data/students.json");
    const students = await response.json();
    return students; // Return all students
  } catch (error) {
    console.error("Error fetching student data:", error);
    return [];
  }
};

export default function InvestorDashboard() {
  const [investor, setInvestor] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [minCreditScore, setMinCreditScore] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("discover");

  useEffect(() => {
    const loadData = async () => {
      const investorData = await fetchInvestorData();
      const studentsData = await fetchStudentData();

      setInvestor(investorData);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setMinCreditScore(
        investorData?.requirements?.minimumEducationCreditScore || 0
      );
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter students based on search and filters
    if (students.length > 0) {
      let filtered = [...students];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            student.location.toLowerCase().includes(query) ||
            student.bio.toLowerCase().includes(query)
        );
      }

      if (minCreditScore > 0) {
        filtered = filtered.filter(
          (student) => student.educationCreditScore >= minCreditScore
        );
      }

      if (selectedField) {
        filtered = filtered.filter((student) =>
          student.bio.toLowerCase().includes(selectedField.toLowerCase())
        );
      }

      if (selectedSkill) {
        filtered = filtered.filter((student) =>
          student.skills.some(
            (skill: any) =>
              skill.name.toLowerCase() === selectedSkill.toLowerCase()
          )
        );
      }

      setFilteredStudents(filtered);
    }
  }, [searchQuery, selectedField, selectedSkill, minCreditScore, students]);

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
              // @ts-ignore - textContent exists on HTMLElement
              stat.textContent = value.toLocaleString();
            });
          },
        }
      );
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Calculate metrics
  const totalInvested = investor.totalInvested;
  const activeInvestments = investor.activeInvestments;
  const averageROI = investor.averageROI;
  const successRate = investor.successRate;

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
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/50 shadow-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                SkillBridge Pro
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className={
                    activeTab === "dashboard"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                  size="sm"
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === "discover" ? "default" : "ghost"}
                  className={
                    activeTab === "discover"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                  size="sm"
                  onClick={() => setActiveTab("discover")}
                >
                  Discover
                </Button>
                <Button
                  variant={activeTab === "portfolio" ? "default" : "ghost"}
                  className={
                    activeTab === "portfolio"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                  size="sm"
                  onClick={() => setActiveTab("portfolio")}
                >
                  Portfolio
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className={
                    activeTab === "analytics"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                  size="sm"
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-slate-800 mx-1"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">
                    {investor.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

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
                  Welcome back, {investor.name.split(" ")[0]}
                </h1>
                <p className="text-slate-400 mt-1">
                  Your investment dashboard has been updated with the latest
                  data
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Portfolio
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Invest Now
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
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Total Invested
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      $
                      <span
                        className="stat-value"
                        data-value={totalInvested / 1000}
                      >
                        0
                      </span>
                      <span className="text-lg ml-0.5">K</span>
                    </span>
                    <div className="mt-2 text-xs text-blue-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12.5% from last month</span>
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
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Active Investments
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span
                        className="stat-value"
                        data-value={activeInvestments}
                      >
                        0
                      </span>
                      <span className="text-lg ml-0.5">Students</span>
                    </span>
                    <div className="mt-2 text-xs text-indigo-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+3 new this month</span>
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
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        Average ROI
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span className="stat-value" data-value={averageROI}>
                        0
                      </span>
                      <span className="text-lg ml-0.5">%</span>
                    </span>
                    <div className="mt-2 text-xs text-purple-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+2.3% from last quarter</span>
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
                        Success Rate
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white flex items-baseline">
                      <span className="stat-value" data-value={successRate}>
                        0
                      </span>
                      <span className="text-lg ml-0.5">%</span>
                    </span>
                    <div className="mt-2 text-xs text-emerald-400/80 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+5.7% year to date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overview Card */}
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
                      Portfolio Performance
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
                  <InvestorPortfolioChart
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
                          name: "Investment",
                          data: [
                            150000, 180000, 210000, 240000, 270000, 300000,
                            330000, 370000, 420000, 490000, 510000, 520000,
                          ],
                        },
                        {
                          name: "Returns",
                          data: [
                            0, 0, 15000, 25000, 40000, 80000, 110000, 150000,
                            190000, 225000, 255000, 280000,
                          ],
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
                      Upcoming Milestones
                    </h2>
                  </div>
                  <Link
                    href="/investor/milestones"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-amber-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-amber-900/30 text-amber-400 border border-amber-500/20 group-hover:bg-amber-900/40 group-hover:border-amber-500/40 transition-all duration-200">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-amber-300 transition-all duration-200">
                        Machine Learning Certification Completion
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Student: Alex Johnson</span>
                        <span className="text-amber-400 font-medium">
                          3 days left
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">$5,000</div>
                      <div className="text-xs text-slate-400">
                        Milestone Value
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:bg-blue-900/40 group-hover:border-blue-500/40 transition-all duration-200">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-blue-300 transition-all duration-200">
                        Blockchain Certification Completion
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Student: Samantha Lee</span>
                        <span>Due: June 30, 2025</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">$8,000</div>
                      <div className="text-xs text-slate-400">
                        Milestone Value
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-emerald-500/30 transition-all duration-200 cursor-pointer">
                    <div className="p-2.5 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-900/40 group-hover:border-emerald-500/40 transition-all duration-200">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-emerald-300 transition-all duration-200">
                        Finance Internship Placement
                      </div>
                      <div className="text-sm text-slate-400 flex justify-between">
                        <span>Student: Samantha Lee</span>
                        <span>Due: August 15, 2025</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">$12,000</div>
                      <div className="text-xs text-slate-400">
                        Milestone Value
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Geographic Impact Card */}
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
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Geographic Impact
                    </h2>
                  </div>
                  <Link href="/investor/impact">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                    >
                      Detailed View
                    </Button>
                  </Link>
                </div>

                <div className="h-[300px] bg-slate-800/50 rounded-xl overflow-hidden p-4 border border-slate-700/50 mb-6 shadow-inner relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <InvestmentMap />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    Top Regions
                  </h3>

                  <div className="space-y-3">
                    <div className="group flex justify-between items-center p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:bg-blue-900/40 group-hover:border-blue-500/40 transition-all duration-200">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-blue-300 transition-all duration-200">
                            San Francisco Bay Area
                          </div>
                          <div className="text-xs text-slate-400">
                            California, USA
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium bg-blue-900/30 text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                        12 Students
                      </div>
                    </div>

                    <div className="group flex justify-between items-center p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-900/40 group-hover:border-indigo-500/40 transition-all duration-200">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-indigo-300 transition-all duration-200">
                            Greater Boston
                          </div>
                          <div className="text-xs text-slate-400">
                            Massachusetts, USA
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium bg-indigo-900/30 text-indigo-400 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
                        8 Students
                      </div>
                    </div>

                    <div className="group flex justify-between items-center p-4 rounded-xl bg-slate-800 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-purple-500/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20 group-hover:bg-purple-900/40 group-hover:border-purple-500/40 transition-all duration-200">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-purple-300 transition-all duration-200">
                            New York Metro
                          </div>
                          <div className="text-xs text-slate-400">
                            New York, USA
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium bg-purple-900/30 text-purple-400 px-2.5 py-1.5 rounded-lg border border-purple-500/20">
                        7 Students
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href="/investor/opportunities">
                      <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20">
                        Discover Regional Opportunities
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/proposals">
                      <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg mt-5 shadow-indigo-900/20 border border-indigo-500/20">
                        Proposal List
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Student Discovery Section */}
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
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Discover Promising Students
                  </h2>
                </div>
                <Link href="/investor/opportunities">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                  >
                    View All Opportunities
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 border-b border-slate-800/50 bg-slate-800/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search by name, location, or skills..."
                    className="pl-10 bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedField ? "default" : "outline"}
                    size="sm"
                    className={
                      !selectedField
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white"
                    }
                    onClick={() => setSelectedField(null)}
                  >
                    All Fields
                  </Button>

                  {investor.requirements.preferredFields.map(
                    (field: string) => (
                      <Button
                        key={field}
                        variant={
                          selectedField === field ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          selectedField === field
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white"
                        }
                        onClick={() => setSelectedField(field)}
                      >
                        {field}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 p-4 rounded-xl bg-slate-800/70 border border-slate-700/50">
                <div className="flex items-center gap-1">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">
                    Filters:
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">
                    Min Education Credit Score:
                  </span>
                  <div className="flex items-center gap-2 w-64">
                    <Input
                      type="range"
                      min="0"
                      max="900"
                      step="10"
                      value={minCreditScore}
                      onChange={(e) =>
                        setMinCreditScore(parseInt(e.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                    <span className="text-sm font-medium w-14 text-center bg-blue-900/30 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/20">
                      {minCreditScore}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">Skills:</span>
                  <select
                    value={selectedSkill || ""}
                    onChange={(e) => setSelectedSkill(e.target.value || null)}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-slate-800/70 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Any Skill</option>
                    {investor.requirements.preferredSkills.map(
                      (skill: string) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.slice(0, 6).map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 border border-slate-700/50 hover:border-blue-500/30 transform hover:translate-y-[-5px] transition-all duration-300"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
                      </div>
                      <div className="absolute top-0 right-0 bg-black/20 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-bl-lg border-l border-b border-white/10 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        Score: {student.educationCreditScore}
                      </div>
                      <div className="absolute -bottom-10 left-6">
                        <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border-4 border-slate-900 shadow-xl">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-10">
                      <div className="mb-4">
                        <h3 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors duration-200">
                          {student.name}
                        </h3>
                        <div className="flex items-center text-sm text-slate-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {student.location}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm text-slate-400">
                            Education Credit Score
                          </span>
                          <span className="text-sm font-medium text-white">
                            {student.educationCreditScore}
                            <span className="text-slate-500">/900</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{
                              width: `${
                                (student.educationCreditScore / 900) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {student.bio}
                      </p>

                      <div className="mb-5">
                        <div className="text-sm font-medium mb-2 text-white">
                          Top Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {student.skills
                            .sort((a: any, b: any) => b.level - a.level)
                            .slice(0, 3)
                            .map((skill: any, i: number) => (
                              <span
                                key={skill.id}
                                className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg ${
                                  i === 0
                                    ? "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                                    : i === 1
                                    ? "bg-indigo-900/30 text-indigo-400 border border-indigo-500/20"
                                    : "bg-purple-900/30 text-purple-400 border border-purple-500/20"
                                }`}
                              >
                                {skill.name} ({skill.level})
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/investor/student/${student.id}`}>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/30"
                            size="sm"
                          >
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/investor/invest/${student.id}`}>
                          <Button
                            className="w-full border-slate-700 bg-slate-700/40 hover:bg-slate-700 text-white"
                            variant="outline"
                            size="sm"
                          >
                            Invest
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="bg-slate-800/80 rounded-xl p-12 text-center border border-slate-700/50">
                  <Users className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No students found
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6">
                    We couldn't find any students matching your search criteria.
                    Try adjusting your filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedField(null);
                      setSelectedSkill(null);
                      setMinCreditScore(
                        investor?.requirements?.minimumEducationCreditScore || 0
                      );
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {filteredStudents.length > 6 && (
                <div className="mt-6 text-center">
                  <Link href="/investor/discover">
                    <Button
                      variant="outline"
                      className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white shadow-lg"
                    >
                      View All {filteredStudents.length} Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bottom Row: Analytics and Success Stories */}
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
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      ROI by Field
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Last 12 Months
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:bg-blue-900/40 group-hover:border-blue-500/40 transition-all duration-200">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                      Computer Science
                    </h3>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Average ROI</span>
                    <span className="text-sm font-medium text-blue-400">
                      24.5%
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"
                      style={{ transform: `scaleX(${24.5 / 30})` }}
                    ></div>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      style={{ width: `${(24.5 / 30) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>12 Investments</span>
                    <span>$320K Total</span>
                  </div>
                </div>

                <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-900/40 group-hover:border-indigo-500/40 transition-all duration-200">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200">
                      Data Science
                    </h3>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Average ROI</span>
                    <span className="text-sm font-medium text-indigo-400">
                      22.0%
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"
                      style={{ transform: `scaleX(${22 / 30})` }}
                    ></div>
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                      style={{ width: `${(22 / 30) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>8 Investments</span>
                    <span>$240K Total</span>
                  </div>
                </div>

                <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-purple-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20 group-hover:bg-purple-900/40 group-hover:border-purple-500/40 transition-all duration-200">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-200">
                      Engineering
                    </h3>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Average ROI</span>
                    <span className="text-sm font-medium text-purple-400">
                      19.8%
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"
                      style={{ transform: `scaleX(${19.8 / 30})` }}
                    ></div>
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                      style={{ width: `${(19.8 / 30) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>15 Investments</span>
                    <span>$380K Total</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/investor/analytics">
                    <Button className="w-full border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white">
                      View Detailed Analytics
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
              className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Recent Applications
                    </h2>
                  </div>
                  <Link href="/investor/applications">
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
                <div className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                  <div className="relative h-32">
                    <Image
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80"
                      alt="CS Student"
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-semibold group-hover:text-blue-300 transition-colors duration-200">
                        Tyler Williams
                      </h3>
                      <p className="text-xs text-slate-300">
                        CS Student • Chicago, IL
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md text-blue-400 text-xs px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                      Score: 760
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20">
                        Machine Learning
                      </span>
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                        Python
                      </span>
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/20">
                        Data Analysis
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-slate-400">
                          Amount Requested
                        </span>
                        <div className="font-semibold text-white">
                          ${formatCurrency(18000)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400">Applied</span>
                        <div className="text-sm text-amber-400">Yesterday</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/30"
                        size="sm"
                      >
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-700 bg-slate-700/40 hover:bg-slate-700 text-white"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer">
                  <div className="relative h-32">
                    <Image
                      src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80"
                      alt="Design Student"
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-semibold group-hover:text-indigo-300 transition-colors duration-200">
                        Megan Thompson
                      </h3>
                      <p className="text-xs text-slate-300">
                        UX Design • Seattle, WA
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md text-blue-400 text-xs px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                      Score: 725
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
                        UI/UX Design
                      </span>
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-pink-900/30 text-pink-400 border border-pink-500/20">
                        Figma
                      </span>
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                        User Research
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-slate-400">
                          Amount Requested
                        </span>
                        <div className="font-semibold text-white">
                          ${formatCurrency(12000)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400">Applied</span>
                        <div className="text-sm text-slate-300">3 days ago</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/30"
                        size="sm"
                      >
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-700 bg-slate-700/40 hover:bg-slate-700 text-white"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/investor/applications">
                    <Button className="w-full border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white">
                      View All Applications
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
                      <Award className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Success Stories
                    </h2>
                  </div>
                  <Link href="/investor/success-stories">
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
                <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-emerald-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="relative w-[52px] h-[52px] rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                          alt="David Nguyen"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full border-2 border-slate-800">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors duration-200">
                        David Nguyen
                      </h3>
                      <p className="text-xs text-slate-400">
                        Software Engineer at TechCorp
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-400 mb-4 italic">
                    "The investment allowed me to complete my bootcamp and land
                    a job within 3 months. My income increased by 70% and I was
                    able to repay the investment in just 1 year."
                  </p>

                  <div className="flex justify-between text-sm p-3 rounded-lg bg-slate-800/70 border border-slate-700/50">
                    <div className="flex flex-col">
                      <span className="text-slate-400">Investment</span>
                      <span className="font-medium text-white">$15,000</span>
                    </div>
                    <div className="w-px bg-slate-700/50"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-slate-400">ROI</span>
                      <span className="font-medium text-emerald-400">35%</span>
                    </div>
                  </div>
                </div>

                <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700/70 shadow-md transform hover:translate-y-[-2px] hover:border-emerald-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="relative w-[52px] h-[52px] rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                          alt="Sarah Johnson"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full border-2 border-slate-800">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors duration-200">
                        Sarah Johnson
                      </h3>
                      <p className="text-xs text-slate-400">
                        Data Scientist at Analytics Inc.
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-400 mb-4 italic">
                    "I was able to complete my data science certification and
                    transition to a new career. The milestone-based funding kept
                    me motivated and on track."
                  </p>

                  <div className="flex justify-between text-sm p-3 rounded-lg bg-slate-800/70 border border-slate-700/50">
                    <div className="flex flex-col">
                      <span className="text-slate-400">Investment</span>
                      <span className="font-medium text-white">$22,000</span>
                    </div>
                    <div className="w-px bg-slate-700/50"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-slate-400">ROI</span>
                      <span className="font-medium text-emerald-400">28%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/investor/success-stories">
                    <Button className="w-full border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-white">
                      View All Success Stories
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
                SkillBridge Pro
              </span>{" "}
              • Investment Dashboard
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1 rounded-lg border border-slate-700/50">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-300">{currentTime}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1 rounded-lg border border-slate-700/50">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                  {currentUser.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-300">{currentUser}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
