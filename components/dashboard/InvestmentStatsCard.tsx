"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface InvestmentStatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  description: string;
  prefix?: string;
  suffix?: string;
  color?: "blue" | "purple" | "emerald" | "amber";
}

export default function InvestmentStatsCard({
  title,
  value,
  icon,
  trend,
  description,
  prefix = "",
  suffix = "",
  color = "blue",
}: InvestmentStatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      text: "text-blue-300",
    },
    purple: {
      bg: "bg-purple-500/20",
      border: "border-purple-500/30",
      text: "text-purple-300",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-300",
    },
    amber: {
      bg: "bg-amber-500/20",
      border: "border-amber-500/30",
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

      <div className="mb-2 flex justify-between items-end">
        <div className="flex items-baseline">
          {prefix && (
            <span className={`text-xl ${colors.text} mr-1`}>{prefix}</span>
          )}
          <span className="text-3xl font-bold">{value.toLocaleString()}</span>
          {suffix && (
            <span className={`text-xl ${colors.text} ml-1`}>{suffix}</span>
          )}
        </div>

        <div
          className={`flex items-center ${
            trend >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1 text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </motion.div>
  );
}
