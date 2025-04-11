"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, MouseEventHandler } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, BarChart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";

// Current date/time and user provided in the request
const currentTime = "2025-04-05 17:11:41";
const currentUser = "vkhare2909";

type CardProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  title: string;
  color: "blue" | "green";
  icon: React.ReactNode;
  description: string;
};

export default function SignInSelectionPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.documentElement.style.setProperty("--mouse-x", x.toString());
    document.documentElement.style.setProperty("--mouse-y", y.toString());
  };

  return (
    <Layout>
      <div
        className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-3xl transform"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-3xl transform"></div>
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl transform"
            style={{
              transform: `translate(calc(var(--mouse-x, 0.5) * -30px), calc(var(--mouse-y, 0.5) * -30px))`,
              transition: "transform 0.3s ease-out",
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl transform"
            style={{
              transform: `translate(calc(var(--mouse-x, 0.5) * 30px), calc(var(--mouse-y, 0.5) * 30px))`,
              transition: "transform 0.3s ease-out",
            }}
          ></div>
        </div>

        {/* Header with back button */}
        <div className="container mx-auto px-4 py-6 z-10">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all duration-300"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400">
              Welcome to SkillBridge Pro
            </h1>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Select how you would like to sign in to access your personalized
              dashboard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <SelectionCard
              title="Student"
              color="blue"
              icon={<GraduationCap className="h-8 w-8 text-blue-400" />}
              description="Access your education profile, skills, and career planning tools"
              onClick={() => router.push("/sign-up/student")}
            />
            <SelectionCard
              title="Investor"
              color="green"
              icon={<BarChart className="h-8 w-8 text-emerald-400" />}
              description="Discover promising talent and manage your education investments"
              onClick={() => router.push("/sign-up/investor")}
            />
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-400">
              Don't have an account yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Sign up
              </Link>
            </p>

            {/* Display provided user information */}
            <p className="mt-4 text-xs text-slate-500">
              {currentTime} · {currentUser}
            </p>
          </div>
        </div>

        {/* Footer section */}
        <div className="container mx-auto px-4 py-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-slate-100">
                Trust & Security
              </h3>
              <p className="text-sm text-slate-400">
                Blockchain-verified credentials you can trust
              </p>
            </div>

            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1 text-slate-100">
                Education Funding
              </h3>
              <p className="text-sm text-slate-400">
                Connect your skills to funding opportunities
              </p>
            </div>

            <div className="text-center p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
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

function SelectionCard({
  title,
  color,
  icon,
  description,
  onClick,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Set appropriate Tailwind classes based on the color prop
  const bgColor = color === "blue" ? "bg-blue-500/20" : "bg-emerald-500/20";
  const textColor = color === "blue" ? "text-blue-400" : "text-emerald-400";
  const borderHoverColor =
    color === "blue"
      ? "hover:border-blue-500/30"
      : "hover:border-emerald-500/30";
  const shadowHoverColor =
    color === "blue"
      ? "hover:shadow-blue-500/10"
      : "hover:shadow-emerald-500/10";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl h-64 flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 ${borderHoverColor} ${shadowHoverColor}`}
        onClick={onClick}
      >
        {/* Spotlight effect with standard Tailwind */}
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : ""
          }`}
          style={{
            background:
              color === "blue"
                ? "radial-gradient(600px circle at center, rgba(59, 130, 246, 0.15), transparent 40%)"
                : "radial-gradient(600px circle at center, rgba(16, 185, 129, 0.15), transparent 40%)",
          }}
        />

        <div className="relative z-10 text-center space-y-4">
          <div
            className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            {description}
          </p>
          <div className="pt-4">
            <span
              className={`px-4 py-2 ${bgColor} ${textColor} rounded-full text-sm inline-flex items-center gap-1`}
            >
              Continue
              <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
