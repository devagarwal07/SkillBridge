"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import {
  MapPin,
  Briefcase,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Star,
  User,
  Users,
  Building,
  CheckCircle,
} from "lucide-react";

// Current timestamp and user for component metadata
const TIMESTAMP = "2025-04-05 23:22:35";
const CURRENT_USER = "vkhare2909";

type Node = {
  id: string;
  name: string;
  level: number;
  type: "role" | "skill" | "milestone";
  status: "current" | "completed" | "future" | "recommended";
  x?: number;
  y?: number;
  salary?: string;
  growth?: string;
  demand?: "High" | "Medium" | "Low";
  skills?: string[];
};

type Link = {
  source: string;
  target: string;
  type: "path" | "alternate" | "recommended";
};

interface CareerMapProps {
  data?: {
    nodes: Node[];
    links: Link[];
  };
}

export function CareerMap({ data }: CareerMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [simulationNodes, setSimulationNodes] = useState<Node[]>([]);
  const [simulationLinks, setSimulationLinks] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default example data if none provided
  const defaultData = {
    nodes: [
      {
        id: "current",
        name: "Junior Developer",
        level: 0,
        type: "role",
        status: "current",
        salary: "$70,000",
        growth: "15%",
        demand: "High",
        skills: ["JavaScript", "React", "Node.js"],
      },
      {
        id: "skill1",
        name: "React Advanced",
        level: 1,
        type: "skill",
        status: "recommended",
        skills: [
          "Component Design",
          "State Management",
          "Performance Optimization",
        ],
      },
      {
        id: "skill2",
        name: "Data Structures",
        level: 1,
        type: "skill",
        status: "future",
        skills: ["Arrays", "Trees", "Algorithms"],
      },
      {
        id: "milestone1",
        name: "Team Project",
        level: 1,
        type: "milestone",
        status: "future",
        skills: ["Collaboration", "Git", "Code Review"],
      },
      {
        id: "next1",
        name: "Mid-level Developer",
        level: 2,
        type: "role",
        status: "future",
        salary: "$95,000",
        growth: "12%",
        demand: "High",
        skills: ["System Design", "Testing", "CI/CD"],
      },
      {
        id: "next2",
        name: "Frontend Specialist",
        level: 2,
        type: "role",
        status: "recommended",
        salary: "$90,000",
        growth: "18%",
        demand: "High",
        skills: ["UX/UI", "Performance", "Accessibility"],
      },
      {
        id: "next3",
        name: "Backend Developer",
        level: 2,
        type: "role",
        status: "future",
        salary: "$100,000",
        growth: "10%",
        demand: "Medium",
        skills: ["Databases", "API Design", "Security"],
      },
      {
        id: "senior",
        name: "Senior Developer",
        level: 3,
        type: "role",
        status: "future",
        salary: "$130,000",
        growth: "8%",
        demand: "Medium",
        skills: ["Architecture", "Mentoring", "Project Management"],
      },
      {
        id: "lead",
        name: "Tech Lead",
        level: 4,
        type: "role",
        status: "future",
        salary: "$150,000",
        growth: "5%",
        demand: "Medium",
        skills: ["Leadership", "Planning", "Communication"],
      },
    ],
    links: [
      { source: "current", target: "skill1", type: "recommended" },
      { source: "current", target: "skill2", type: "path" },
      { source: "current", target: "milestone1", type: "path" },
      { source: "skill1", target: "next2", type: "recommended" },
      { source: "skill2", target: "next1", type: "path" },
      { source: "milestone1", target: "next1", type: "path" },
      { source: "milestone1", target: "next3", type: "alternate" },
      { source: "next1", target: "senior", type: "path" },
      { source: "next2", target: "senior", type: "path" },
      { source: "next3", target: "senior", type: "path" },
      { source: "senior", target: "lead", type: "path" },
    ],
  };

  // Initialize with data or default
  useEffect(() => {
    const mapData = data || defaultData;

    // Update nodes with layout positions
    const nodes = [...mapData.nodes].map((node) => ({
      ...node,
      x: undefined, // Will be set by simulation
      y: undefined, // Will be set by simulation
    })) as Node[];

    // Format links for D3 simulation
    const links = mapData.links.map((link) => ({
      ...link,
      source: link.source,
      target: link.target,
    }));

    setSimulationNodes(nodes);
    setSimulationLinks(links);
  }, [data]);

  // Handle window resize and initial dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Run D3 force simulation when dimensions or nodes/links change
  useEffect(() => {
    if (
      !svgRef.current ||
      dimensions.width === 0 ||
      simulationNodes.length === 0
    )
      return;

    // Create force simulation
    const simulation = d3
      .forceSimulation(simulationNodes as any)
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "x",
        d3
          .forceX()
          .x((d: any) => {
            // Position nodes based on level
            const levelWidth = dimensions.width / 5; // 5 levels
            return levelWidth * d.level + levelWidth / 2;
          })
          .strength(1)
      )
      .force("y", d3.forceY(dimensions.height / 2).strength(0.3))
      .force("collision", d3.forceCollide().radius(30))
      .on("tick", () => {
        // Update node positions after each simulation tick
        setSimulationNodes([...(simulation.nodes() as any)]);
      });

    // Run simulation for a fixed number of iterations
    simulation.alpha(1).restart();

    // Stop simulation after a few seconds to save CPU
    const timer = setTimeout(() => {
      simulation.stop();
    }, 3000);

    return () => {
      simulation.stop();
      clearTimeout(timer);
    };
  }, [dimensions, simulationNodes.length, simulationLinks.length]);

  const getNodeColor = (node: Node) => {
    if (node.status === "current") return "#60a5fa"; // blue-400
    if (node.status === "completed") return "#34d399"; // emerald-400
    if (node.status === "recommended") return "#c084fc"; // purple-400
    return "#94a3b8"; // slate-400
  };

  const getNodeIcon = (node: Node) => {
    switch (node.type) {
      case "role":
        return node.level < 3 ? User : node.level < 4 ? Users : Building;
      case "skill":
        return Star;
      case "milestone":
        return CheckCircle;
      default:
        return Briefcase;
    }
  };

  const getLinkColor = (link: Link) => {
    if (link.type === "recommended") return "#c084fc"; // purple-400
    if (link.type === "alternate") return "#94a3b8"; // slate-400
    return "#60a5fa"; // blue-400
  };

  const getLinkWidth = (link: Link) => {
    if (link.type === "recommended") return 3;
    if (link.type === "alternate") return 1;
    return 2;
  };

  const getLinkDash = (link: Link) => {
    if (link.type === "alternate") return "5,5";
    return "none";
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-950/80 rounded-xl"
    >
      {/* Metadata comment (hidden in UI) */}
      {/* Generated at: ${TIMESTAMP} for ${CURRENT_USER} */}

      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1/3 h-1/3 rounded-full bg-purple-900/10 blur-3xl"></div>
      </div>

      {/* Career path title */}
      <div className="absolute top-2 left-4 z-10 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-medium text-slate-300">
          Career Pathways
        </span>
      </div>

      {/* Map legend */}
      <div className="absolute top-2 right-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
          <span className="text-xs text-slate-400">Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
          <span className="text-xs text-slate-400">Recommended</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
          <span className="text-xs text-slate-400">Alternative</span>
        </div>
      </div>

      {/* Main SVG visualization */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <defs>
          <marker
            id="arrowhead-path"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
          </marker>
          <marker
            id="arrowhead-recommended"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#c084fc" />
          </marker>
          <marker
            id="arrowhead-alternate"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>

          {/* Glowing filter for current position */}
          <filter
            id="glow-current"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Glowing filter for recommended nodes */}
          <filter
            id="glow-recommended"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradient for path links */}
          <linearGradient
            id="link-path-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* Gradient for recommended links */}
          <linearGradient
            id="link-recommended-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Links */}
        <g className="links">
          {simulationLinks.map((link, i) => {
            const sourceNode =
              simulationNodes.find((n) => n.id === link.source) ||
              simulationNodes.find(
                (n) =>
                  n.id ===
                  (typeof link.source === "object"
                    ? link.source.id
                    : link.source)
              );
            const targetNode =
              simulationNodes.find((n) => n.id === link.target) ||
              simulationNodes.find(
                (n) =>
                  n.id ===
                  (typeof link.target === "object"
                    ? link.target.id
                    : link.target)
              );

            if (!sourceNode || !targetNode || !sourceNode.x || !targetNode.x)
              return null;

            return (
              <motion.path
                key={`link-${i}`}
                d={`M${sourceNode.x},${sourceNode.y} L${targetNode.x},${targetNode.y}`}
                stroke={getLinkColor(link)}
                strokeWidth={getLinkWidth(link)}
                strokeDasharray={getLinkDash(link)}
                opacity={0.6}
                markerEnd={`url(#arrowhead-${link.type})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {simulationNodes.map((node, i) => {
            if (!node.x) return null;

            const IconComponent = getNodeIcon(node);
            const isCurrentOrRecommended =
              node.status === "current" || node.status === "recommended";
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedNode(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node glow effect */}
                {isCurrentOrRecommended && (
                  <circle
                    r={22}
                    fill={getNodeColor(node)}
                    opacity={0.2}
                    filter={`url(#glow-${
                      node.status === "current" ? "current" : "recommended"
                    })`}
                  >
                    <animate
                      attributeName="r"
                      values="22;24;22"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.4;0.2"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Node circle */}
                <motion.circle
                  r={isSelected || isHovered ? 20 : 18}
                  fill={`${getNodeColor(node)}${
                    isHovered || isSelected ? "" : "80"
                  }`}
                  stroke={
                    isSelected
                      ? "white"
                      : isHovered
                      ? getNodeColor(node)
                      : "transparent"
                  }
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: i * 0.05 + 0.2,
                  }}
                />

                {/* Node icon */}
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: i * 0.05 + 0.4,
                  }}
                >
                  <foreignObject x="-10" y="-10" width="20" height="20">
                    <div className="flex items-center justify-center w-full h-full">
                      <IconComponent
                        className="h-4 w-4 text-white"
                        style={{ strokeWidth: 2.5 }}
                      />
                    </div>
                  </foreignObject>
                </motion.g>

                {/* Node label */}
                <g transform="translate(0, 30)">
                  <foreignObject
                    x={-80}
                    y={0}
                    width={160}
                    height={30}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      className={`text-center text-xs px-2 py-1 rounded-md transition-all duration-300 ${
                        isSelected || isHovered
                          ? "font-medium text-white bg-slate-800/90 backdrop-blur-sm border border-slate-700/50"
                          : "text-slate-300"
                      }`}
                    >
                      {node.name}
                    </div>
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Node details panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 right-4 w-64 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: `${getNodeColor(selectedNode)}40`,
                color: getNodeColor(selectedNode),
              }}
            >
              {React.createElement(getNodeIcon(selectedNode), {
                className: "h-5 w-5",
              })}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{selectedNode.name}</h3>
              <div className="text-xs text-slate-400 capitalize">
                {selectedNode.type}
              </div>
            </div>
          </div>

          {selectedNode.type === "role" && (
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Salary Range
                </span>
                <span className="text-white">{selectedNode.salary}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Growth
                </span>
                <span className="text-white">{selectedNode.growth}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Demand
                </span>
                <span
                  className={
                    selectedNode.demand === "High"
                      ? "text-emerald-400"
                      : selectedNode.demand === "Medium"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }
                >
                  {selectedNode.demand}
                </span>
              </div>
            </div>
          )}

          {selectedNode.skills && (
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-2">
                {selectedNode.type === "skill" ? "Topics" : "Required Skills"}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md border border-slate-600/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedNode.status === "recommended" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 pt-3 border-t border-slate-700/50"
            >
              <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                Add to my learning path
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Current position indicator */}
      <div className="absolute bottom-4 left-4 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
        <span className="text-slate-300">Current Position</span>
      </div>
    </div>
  );
}
