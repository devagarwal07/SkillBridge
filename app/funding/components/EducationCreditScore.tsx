import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Briefcase,
  Calendar,
  TrendingUp,
  Shield,
  Clock,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Current user information from the system
const currentTime = "2025-04-05 19:17:39";
const currentUser = "vkhare2909";

type EducationCreditScoreProps = {
  userData: any;
};

const EducationCreditScore = forwardRef<
  HTMLDivElement,
  EducationCreditScoreProps
>(({ userData }, ref) => {
  // Function to determine score rating and color
  const getScoreRating = (score: number) => {
    const percentage = (score / 900) * 100;

    if (percentage >= 80)
      return { rating: "Excellent", color: "from-green-400 to-emerald-500" };
    if (percentage >= 65)
      return { rating: "Good", color: "from-blue-400 to-cyan-500" };
    if (percentage >= 50)
      return { rating: "Fair", color: "from-amber-400 to-yellow-500" };
    return { rating: "Needs Improvement", color: "from-rose-400 to-pink-500" };
  };

  const { rating, color } = getScoreRating(userData.educationCreditScore);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl p-6 mb-10"
    >
      {/* Header with user information */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-3">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Education Credit Score
          </h2>
        </div>

        <div className="flex items-center text-sm text-slate-400 bg-slate-800/70 backdrop-blur-sm rounded-full px-3 py-1.5 border border-slate-700/50">
          <Clock className="h-3.5 w-3.5 mr-2 text-indigo-400" />
          <span className="mr-2">{currentTime}</span>
          <span className="mx-2 text-slate-600">|</span>
          <User className="h-3.5 w-3.5 mr-2 text-indigo-400" />
          <span>{currentUser}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 rounded-xl p-5 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#credit-score-gradient-${userData.id || "main"})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="282.74"
                initial={{ strokeDashoffset: 282.74 }}
                animate={{
                  strokeDashoffset:
                    282.74 * (1 - userData.educationCreditScore / 900),
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                <span
                  className="stat-value"
                  data-value={userData.educationCreditScore}
                >
                  {userData.educationCreditScore}
                </span>
              </span>
              <span className="text-slate-400 mt-1">out of 900</span>
              <span
                className={`text-sm mt-2 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white font-medium`}
              >
                {rating}
              </span>
            </div>

            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id={`credit-score-gradient-${userData.id || "main"}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" style={{ stopColor: "#818cf8" }} />
                  <stop offset="50%" style={{ stopColor: "#c084fc" }} />
                  <stop offset="100%" style={{ stopColor: "#38bdf8" }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 hover:bg-slate-800/70 hover:border-indigo-500/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                  <DollarSign className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white">Funding Received</h3>
              </div>
              <div className="text-2xl font-bold mb-1 text-white">
                $
                <span
                  className="stat-value"
                  data-value={userData.funding.received}
                  data-format="currency"
                >
                  {formatCurrency(userData.funding.received)}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Total funding secured to date
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white">Active Contracts</h3>
              </div>
              <div className="text-2xl font-bold mb-1 text-white">
                <span
                  className="stat-value"
                  data-value={userData.funding.activeContracts.length}
                >
                  {userData.funding.activeContracts.length}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Funding agreements in progress
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 hover:bg-slate-800/70 hover:border-blue-500/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">
                  Pending Applications
                </h3>
              </div>
              <div className="text-2xl font-bold mb-1 text-white">
                <span
                  className="stat-value"
                  data-value={userData.funding.pendingApplications.length}
                >
                  {userData.funding.pendingApplications.length}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Applications under review
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 hover:bg-slate-800/70 hover:border-emerald-500/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white">Eligibility Rating</h3>
              </div>
              <div className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                High
              </div>
              <p className="text-sm text-slate-400">
                Based on your score and skills
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-4 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 text-sm text-slate-400">
              <p>
                Your Education Credit Score is calculated based on your academic
                performance, verified credentials, and completion of educational
                milestones. A higher score increases your eligibility for
                premium funding options and lower interest rates. Currently,
                with your score of{" "}
                <span className="text-white font-medium">
                  {userData.educationCreditScore}
                </span>
                , you qualify for{" "}
                <span className="text-white font-medium">
                  {userData.funding.eligiblePrograms}
                </span>{" "}
                funding programs.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:col-span-1"
            >
              <a
                href="/score/improve"
                className="h-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-500/30 transition-all duration-300"
              >
                Improve Score
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

EducationCreditScore.displayName = "EducationCreditScore";
export default EducationCreditScore;
