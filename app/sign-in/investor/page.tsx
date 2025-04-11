"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Layout from "@/app/components/layout/Layout";

export default function SignInPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isSignedIn } = useUser();

  // Updated timestamp and user login as requested
  const currentTime = "2025-04-05 17:06:40";
  const currentUser = "vkhare2909";

  useEffect(() => {
    if (isSignedIn) {
      router.push("/onboarding/investor");
    }
  }, [isSignedIn, router]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container py-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-colors"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
            Back to Home
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
                Welcome Back
              </h1>
              <p className="text-gray-400 mt-3 text-base">
                Sign in to your SkillBridge Pro account
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl">
              <SignIn
                redirectUrl="/investor"
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white",
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton:
                      "border border-slate-700 bg-slate-800/80 hover:bg-slate-800",
                    formFieldInput: "bg-slate-900/80 border-slate-700",
                    footer: "text-gray-400",
                    formButtonReset: "text-blue-400 hover:text-blue-300",
                    accordionTriggerButton: "text-blue-400 hover:text-blue-300",
                  },
                }}
              />
            </div>

            <div className="text-center mt-10 space-y-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>

              {/* Display timestamp and user info */}
              <p className="text-xs text-gray-500">
                {currentTime} · {currentUser}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer with visual elements */}
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-slate-800/40 border border-slate-700/30 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Trust & Security
              </h3>
              <p className="text-sm text-gray-400">
                Blockchain-verified credentials you can trust
              </p>
            </div>

            <div className="text-center p-5 bg-slate-800/40 border border-slate-700/30 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Education Funding
              </h3>
              <p className="text-sm text-gray-400">
                Connect your skills to funding opportunities
              </p>
            </div>

            <div className="text-center p-5 bg-slate-800/40 border border-slate-700/30 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Career Growth
              </h3>
              <p className="text-sm text-gray-400">
                Chart your path to professional success
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
