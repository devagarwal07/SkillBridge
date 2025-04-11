import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, User, File } from "lucide-react";
import SparkleButton from "@/components/ui/SparkleButton";

type SuccessScreenProps = {
  formData: any;
  currentTime: string;
};

export default function SuccessScreen({
  formData,
  currentTime,
}: SuccessScreenProps) {
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

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-8 max-w-2xl w-full text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">
            Application Submitted!
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Your funding application has been successfully submitted. You will
            receive a confirmation email shortly.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <div className="text-left mb-4">
            <h3 className="font-semibold mb-2 text-white">
              Application Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Application ID:</span>
                <span className="font-medium text-white">
                  APP-{Math.floor(Math.random() * 100000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Submitted:</span>
                <span className="font-medium text-white">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requested Amount:</span>
                <span className="font-medium text-white">
                  ${formData.funding.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Preferred Funding Model:</span>
                <span className="font-medium text-white">
                  {formData.funding.preferredModel}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-white text-left">
              Next Steps
            </h3>
            <ul className="space-y-2 text-sm text-left">
              <li className="flex items-start gap-2 text-gray-300">
                <Clock className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <span>
                  Your application will be reviewed within 3-5 business days.
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <User className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>
                  You may be contacted for an interview or additional
                  information.
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <span>
                  Once approved, you'll receive funding offers to review.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <button className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all">
              Go to Dashboard
            </button>
          </Link>
          <div className="flex-1">
            <SparkleButton
              href="/funding"
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              View Funding Options
            </SparkleButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
