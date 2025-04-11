import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart } from "lucide-react";
import SparkleButton from "@/components/ui/SparkleButton";

export default function CallToAction() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-teal-600/20 blur-3xl" />

      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to Fund Your Education?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with investors who believe in your potential and are ready to
          back your educational journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SparkleButton
            href="/funding/apply"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
          >
            Apply for Funding
            <ArrowRight className="ml-2 h-5 w-5" />
          </SparkleButton>
          <Link href="/funding/calculator">
            <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center justify-center">
              Calculate Your Options
              <BarChart className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
