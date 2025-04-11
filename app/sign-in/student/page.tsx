"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { ChevronLeft, LogIn } from "lucide-react";
import Layout from "@/app/components/layout/Layout";

export default function SignInPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isSignedIn } = useUser();

  // Current date/time and user as provided
  const currentTime = "2025-04-05 17:10:07";
  const currentUser = "vkhare2909";

  useEffect(() => {
    if (isSignedIn) {
      router.push("/onboarding");
    }

    // Add a subtle background animation effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mouse-x", x.toString());
      document.documentElement.style.setProperty("--mouse-y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isSignedIn, router]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-slate-900 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl transform translate-x-[calc(var(--mouse-x, 0.5)*20px)] translate-y-[calc(var(--mouse-y, 0.5)*20px)]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-purple-500/10 to-teal-400/5 rounded-full blur-3xl transform translate-x-[calc(var(--mouse-x, 0.5)*-20px)] translate-y-[calc(var(--mouse-y, 0.5)*-20px)]"></div>
        </div>

        {/* Header with back button */}
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-200 hover:bg-slate-800/70 transition-colors"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">
                Welcome Back
              </h1>
              <p className="text-slate-400 mt-3 text-base">
                Sign in to your SkillBridge Pro account
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl">
              <SignIn
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white",
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-slate-100",
                    headerSubtitle: "text-slate-400",
                    socialButtonsBlockButton:
                      "border border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 text-white",
                    formFieldInput:
                      "bg-slate-900/70 border-slate-700 text-white",
                    footer: "text-slate-400",
                    formButtonReset: "text-blue-400 hover:text-blue-300",
                    accordionTriggerButton: "text-blue-400 hover:text-blue-300",
                  },
                }}
              />
            </div>

            <div className="text-center mt-10 space-y-3">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>

              {/* Display current date/time and user */}
              <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <span>{currentTime}</span>
                <span className="px-1">•</span>
                <span>{currentUser}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer section */}
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-1 text-slate-100">
                Trust & Security
              </h3>
              <p className="text-sm text-slate-400">
                Blockchain-verified credentials you can trust
              </p>
            </div>

            <div className="text-center p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-1 text-slate-100">
                Education Funding
              </h3>
              <p className="text-sm text-slate-400">
                Connect your skills to funding opportunities
              </p>
            </div>

            <div className="text-center p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-1 text-slate-100">
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
