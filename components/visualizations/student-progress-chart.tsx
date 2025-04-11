"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import { TrendingUp, Award, Star } from "lucide-react";

// Current timestamp and user for component metadata
const TIMESTAMP = "2025-04-05 23:28:03";
const CURRENT_USER = "vkhare2909";

interface StudentProgressChartProps {
  data: {
    months: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
}

// Define a proper type for ViewBox to fix the TypeScript error
interface ViewBoxType {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/60 rounded-lg p-3 shadow-xl text-sm">
        <p className="font-medium text-slate-300 mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-2 mb-1 last:mb-0"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-medium text-white">
              {entry.name === "Credit Score"
                ? entry.value
                : `${entry.value} Courses`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function StudentProgressChart({ data }: StudentProgressChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [achievementPoints, setAchievementPoints] = useState<
    { month: string; value: number; label: string }[]
  >([]);

  // Process data for the chart
  useEffect(() => {
    if (data) {
      const processedData = data.months.map((month, index) => {
        const result: any = { month };
        data.series.forEach((series) => {
          result[series.name] = series.data[index];
        });
        return result;
      });

      setChartData(processedData);

      // Add achievement points
      setAchievementPoints([
        { month: "Mar", value: 620, label: "First Certification" },
        { month: "Jun", value: 670, label: "Completed JavaScript Course" },
        { month: "Sep", value: 715, label: "Blockchain Project" },
        { month: "Dec", value: 760, label: "Machine Learning Milestone" },
      ]);

      setIsVisible(true);
    }
  }, [data]);

  return (
    <div ref={chartRef} className="relative w-full h-full">
      {/* Metadata comment with updated timestamp */}
      {/* Generated at: ${TIMESTAMP} for ${CURRENT_USER} */}

      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 w-1/3 h-1/3 rounded-full bg-blue-500/10 blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 rounded-full bg-indigo-500/10 blur-[60px]"></div>
      </div>

      {/* Chart title and info */}
      <div className="absolute top-0 left-0 p-2 z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium text-slate-400">
            Progress over 12 months
          </span>
        </div>
      </div>

      {/* Main chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
            onMouseMove={(e) => {
              if (e.activeLabel) {
                setHoveredMonth(e.activeLabel);
              }
            }}
            onMouseLeave={() => setHoveredMonth(null)}
          >
            <defs>
              <linearGradient
                id="creditScoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient
                id="coursesGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient
                id="creditScoreGradientBg"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              tickLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
            />
            <YAxis
              yAxisId="left"
              domain={[500, 900]}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              tickLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              tickCount={7}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 10]}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              tickLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              tickCount={6}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Courses line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Courses Completed"
              stroke="url(#coursesGradient)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#0d1117" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#06b6d4" }}
            />

            {/* Credit Score line with area and animation */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Credit Score"
              stroke="url(#creditScoreGradient)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#0d1117" }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: "#6366f1",
                filter: "url(#glow)",
              }}
              animationDuration={1500}
            />

            {/* Achievement markers with fixed TypeScript error */}
            {achievementPoints.map((point, index) => (
              <ReferenceLine
                key={index}
                yAxisId="left"
                x={point.month}
                stroke="rgba(99, 102, 241, 0.3)"
                strokeDasharray="3 3"
                isFront={true}
              >
                <Label
                  position="insideTopRight"
                  content={(props) => {
                    // Cast the viewBox to our defined type to fix TypeScript error
                    const viewBox = props.viewBox as ViewBoxType;
                    const isHovered = hoveredMonth === point.month;

                    return (
                      <g>
                        <foreignObject
                          x={viewBox.x - 10}
                          y={viewBox.y + 10}
                          width={isHovered ? 150 : 24}
                          height={isHovered ? 50 : 24}
                          style={{ overflow: "visible" }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                                isHovered
                                  ? "w-6 h-6 bg-indigo-600 ring-2 ring-indigo-400 ring-opacity-50"
                                  : "w-5 h-5 bg-indigo-700"
                              }`}
                            >
                              <Award
                                className={`${
                                  isHovered
                                    ? "h-4 w-4 text-white"
                                    : "h-3 w-3 text-indigo-300"
                                }`}
                              />
                            </div>
                            {isHovered && (
                              <div className="ml-2 bg-slate-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg border border-indigo-500/20">
                                {point.label}
                              </div>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }}
                />
              </ReferenceLine>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance indicator with updated timestamp */}
      <div className="absolute bottom-2 right-4 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
        <span className="text-slate-300">Top 15% performance growth</span>
      </div>

      {/* Timestamp watermark (hidden in UI but can be seen in source) */}
      <div className="absolute bottom-0 left-0 opacity-0 pointer-events-none text-[0px]">
        Generated: {TIMESTAMP} • User: {CURRENT_USER}
      </div>
    </div>
  );
}
