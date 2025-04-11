"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  description: string;
  color?: "blue" | "purple" | "emerald" | "amber";
}

export default function ProgressCard({
  title,
  value,
  maxValue,
  icon,
  description,
  color = "blue",
}: ProgressCardProps) {
  const percentage = Math.round((value / maxValue) * 100);

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      progress: "bg-blue-500",
      text: "text-blue-300",
    },
    purple: {
      bg: "bg-purple-500/20",
      border: "border-purple-500/30",
      progress: "bg-purple-500",
      text: "text-purple-300",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      progress: "bg-emerald-500",
      text: "text-emerald-300",
    },
    amber: {
      bg: "bg-amber-500/20",
      border: "border-amber-500/30",
      progress: "bg-amber-500",
      text: "text-amber-300",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <span className={`text-2xl font-bold ${colors.text}`}>{value}</span>
        <span className="text-gray-400">of {maxValue}</span>
      </div>

      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${colors.progress}`}
        ></motion.div>
      </div>

      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
}
