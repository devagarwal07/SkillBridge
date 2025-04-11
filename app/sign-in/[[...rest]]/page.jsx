"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, BarChart, Sparkles } from "lucide-react";
import Link from "next/link";
import Layout from "../../components/layout/Layout";
export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [activeCard, setActiveCard] = useState(null);

  // Using the provided values
  const currentTime = "2025-04-05 17:08:34";
  const currentUser = "vkhare2909";

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mouse-x", x.toString());
      document.documentElement.style.setProperty("--mouse-y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-slate-950 relative">
        {/* Background gradients using standard Tailwind */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl transform -z-10"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-teal-500/10 to-emerald-500/5 rounded-full blur-3xl transform -z-10"></div>

          {/* Animated blobs with standard Tailwind */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl transform -z-10"
            style={{
              transform: `translate(calc(var(--mouse-x, 0.5) * -30px), calc(var(--mouse-y, 0.5) * -30px))`,
              transition: "transform 0.2s ease-out",
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl transform -z-10"
            style={{
              transform: `translate(calc(var(--mouse-x, 0.5) * 30px), calc(var(--mouse-y, 0.5) * 30px))`,
              transition: "transform 0.2s ease-out",
            }}
          ></div>
        </div>

        {/* Header section */}
        <div className="container mx-auto px-4 py-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800/80 backdrop-blur-sm transition-all duration-200"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-teal-400">
              Welcome to SkillBridge Pro
            </h1>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Select how you would like to sign in to access your account and
              continue your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Student Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveCard("student")}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl h-72 flex flex-col items-center justify-center p-8 cursor-pointer backdrop-blur-sm hover:border-blue-500/30 hover:shadow-blue-500/5 transition-all duration-300"
                onClick={() => router.push("/sign-in/student")}
              >
                {/* Spotlight effect with standard tailwind */}
                <div
                  className={`absolute inset-0 opacity-0 transition duration-300 ${
                    activeCard === "student" ? "opacity-100" : ""
                  }`}
                  style={{
                    background:
                      "radial-gradient(600px circle at center, rgba(0, 149, 255, 0.15), transparent 40%)",
                  }}
                />

                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Student</h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Access your education profile, verify skills, and explore
                    career pathways
                  </p>
                  <div className="pt-4">
                    <span className="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm inline-flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Student Portal
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Investor Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveCard("investor")}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl h-72 flex flex-col items-center justify-center p-8 cursor-pointer backdrop-blur-sm hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all duration-300"
                onClick={() => router.push("/sign-in/investor")}
              >
                {/* Spotlight effect with standard tailwind */}
                <div
                  className={`absolute inset-0 opacity-0 transition duration-300 ${
                    activeCard === "investor" ? "opacity-100" : ""
                  }`}
                  style={{
                    background:
                      "radial-gradient(600px circle at center, rgba(20, 184, 166, 0.15), transparent 40%)",
                  }}
                />

                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="h-8 w-8 text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Investor</h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Discover promising talent and manage your education
                    investments
                  </p>
                  <div className="pt-4">
                    <span className="px-4 py-2 bg-teal-500/10 text-teal-300 rounded-full text-sm inline-flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Investor Dashboard
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sign up link */}
          <div className="mt-10 text-center">
            <p className="text-slate-400">
              Don't have an account yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>

            {/* User info footer */}
            <p className="mt-4 text-xs text-slate-500">
              {currentTime} · {currentUser}
            </p>
          </div>
        </div>

        {/* Footer section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Trust & Security
              </h3>
              <p className="text-sm text-slate-400">
                Blockchain-verified credentials you can trust
              </p>
            </div>

            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Education Funding
              </h3>
              <p className="text-sm text-slate-400">
                Connect your skills to funding opportunities
              </p>
            </div>

            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Career Growth
              </h3>
              <p className="text-sm text-slate-400">
                Chart your path to professional success
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
