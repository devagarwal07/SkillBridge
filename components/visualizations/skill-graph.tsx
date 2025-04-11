"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import anime from "animejs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

interface Skill {
  id: string;
  name: string;
  level: number;
  lastVerified: string;
  endorsements: number;
}

interface ProcessedSkill {
  id: string;
  name: string;
  level: number;
  lastVerified: string;
  endorsements: number;
  colorMain: string;
  colorLight: string;
  colorDark: string;
  category?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  radius: number;
  suggested?: boolean;
  fromSkill?: string;
  description?: string;
  // For cluster layout
  clusterX?: number;
  clusterY?: number;
  angle?: number;
  distance?: number;
}

interface Link {
  source: string | ProcessedSkill;
  target: string | ProcessedSkill;
  strength: number;
  type: "core" | "suggested";
}

interface GraphData {
  nodes: ProcessedSkill[];
  links: Link[];
}

export function SkillGraph({ skills }: { skills: Skill[] }) {
  const graphRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<ProcessedSkill | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<ProcessedSkill | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { theme } = useTheme();
  const [graphBounds, setGraphBounds] = useState({ width: 800, height: 600 });

  // Current user and time information - updated as requested
  const currentTime = "2025-03-28 12:44:34";
  const currentUser = "vkhare2909";

  // Color palette from the previous visualization
  const colorPalette = useMemo(
    () => [
      { main: "#38bdf8", light: "#7dd3fc", dark: "#0284c7" }, // Sky
      { main: "#818cf8", light: "#a5b4fc", dark: "#4f46e5" }, // Indigo
      { main: "#c084fc", light: "#d8b4fe", dark: "#9333ea" }, // Purple
      { main: "#2dd4bf", light: "#5eead4", dark: "#0d9488" }, // Teal
      { main: "#fb7185", light: "#fda4af", dark: "#e11d48" }, // Rose
      { main: "#fcd34d", light: "#fde68a", dark: "#d97706" }, // Amber
    ],
    []
  );

  // Group skills by category or create categories
  const groupedSkills = useMemo(() => {
    const categories: { [key: string]: Skill[] } = {};

    // Try to derive categories by analyzing skill names
    skills.forEach((skill) => {
      const keywords = [
        "Frontend",
        "Backend",
        "Design",
        "DevOps",
        "AI",
        "Data",
        "Mobile",
        "Cloud",
        "Security",
      ];
      let matched = false;

      for (const keyword of keywords) {
        if (
          skill.name.includes(keyword) ||
          skillMatchesCategory(skill.name, keyword)
        ) {
          categories[keyword] = categories[keyword] || [];
          categories[keyword].push(skill);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Group by skill level as fallback
        const levelCategory =
          skill.level > 75
            ? "Advanced"
            : skill.level > 50
            ? "Intermediate"
            : "Beginner";
        categories[levelCategory] = categories[levelCategory] || [];
        categories[levelCategory].push(skill);
      }
    });

    return categories;
  }, [skills]);

  // Helper function to match skills to categories
  function skillMatchesCategory(skillName: string, category: string): boolean {
    const categoryKeywords: { [key: string]: string[] } = {
      Frontend: [
        "react",
        "vue",
        "angular",
        "html",
        "css",
        "javascript",
        "ui",
        "interface",
        "web",
      ],
      Backend: [
        "node",
        "express",
        "php",
        "java",
        "python",
        "api",
        "server",
        "database",
      ],
      Design: [
        "ux",
        "ui",
        "figma",
        "sketch",
        "adobe",
        "photoshop",
        "illustrator",
      ],
      DevOps: [
        "docker",
        "kubernetes",
        "ci/cd",
        "pipeline",
        "aws",
        "azure",
        "deployment",
      ],
      AI: [
        "machine learning",
        "deep learning",
        "neural",
        "nlp",
        "vision",
        "tensorflow",
        "pytorch",
      ],
      Data: [
        "sql",
        "nosql",
        "analytics",
        "visualization",
        "etl",
        "warehouse",
        "hadoop",
      ],
      Mobile: ["android", "ios", "flutter", "react native", "swift", "kotlin"],
      Cloud: ["aws", "azure", "gcp", "serverless", "lambda", "s3", "ec2"],
      Security: [
        "authentication",
        "authorization",
        "encryption",
        "firewall",
        "penetration",
      ],
    };

    const keywords = categoryKeywords[category] || [];
    return keywords.some((keyword) =>
      skillName.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Process skills for visualization with initial cluster positioning
  const processedNodes = useMemo(() => {
    let nodes: ProcessedSkill[] = [];
    let categoryIndex = 0;

    // Calculate the center point for the mind map
    const centerX = 0;
    const centerY = 0;

    // Get the categories for radial arrangement
    const categories = Object.keys(groupedSkills);
    const categoryCount = categories.length;

    // Process grouped skills with structured layout
    Object.entries(groupedSkills).forEach(
      ([category, categorySkills], cidx) => {
        // Calculate the angle for this category in the circle
        const categoryAngle = (cidx * (2 * Math.PI)) / categoryCount;

        // Category center point - place categories in a circle around the center
        const categoryRadius = 250; // Distance from center
        const categoryX = centerX + categoryRadius * Math.cos(categoryAngle);
        const categoryY = centerY + categoryRadius * Math.sin(categoryAngle);

        // Process skills in this category
        categorySkills.forEach((skill, skillIndex) => {
          const colorIndex = categoryIndex % colorPalette.length;
          const colors = colorPalette[colorIndex];

          // Calculate position within the cluster
          // Arrange skills in a smaller circle or grid around the category center
          const skillCount = categorySkills.length;
          const skillAngle =
            categoryAngle + (skillIndex - skillCount / 2) * (Math.PI / 12); // Spread skills in an arc

          // Adjust distance based on level (higher level = closer to center)
          const distanceFromCategory = 60 + (100 - skill.level) / 5;

          const skillX =
            categoryX + distanceFromCategory * Math.cos(skillAngle);
          const skillY =
            categoryY + distanceFromCategory * Math.sin(skillAngle);

          nodes.push({
            ...skill,
            colorMain: colors.main,
            colorLight: colors.light,
            colorDark: colors.dark,
            radius: 10 + (skill.level / 100) * 10, // Smaller radius for cleaner look
            suggested: false,
            category,
            // Store the target coordinates for this node
            x: skillX,
            y: skillY,
            // Store cluster info for forces
            clusterX: categoryX,
            clusterY: categoryY,
            angle: skillAngle,
            distance: distanceFromCategory,
          });
        });

        categoryIndex++;
      }
    );

    return nodes;
  }, [groupedSkills, colorPalette]);

  // Generate more structured links between skills
  const processedLinks = useMemo(() => {
    const links: Link[] = [];

    // Create a central hub node for each category (virtual node)
    const categoryCenters: { [key: string]: { x: number; y: number } } = {};
    Object.keys(groupedSkills).forEach((category) => {
      const categoryNodes = processedNodes.filter(
        (n) => n.category === category
      );
      if (categoryNodes.length > 0) {
        // Find the average position of the first node in each category
        categoryCenters[category] = {
          x: categoryNodes[0].clusterX || 0,
          y: categoryNodes[0].clusterY || 0,
        };
      }
    });

    // Generate hierarchical links - each skill connects to its category center
    Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
      const categoryNodes = processedNodes.filter(
        (n) => n.category === category
      );

      // Connect nodes within same category with a more structured pattern
      for (let i = 0; i < categoryNodes.length; i++) {
        if (i > 0) {
          // Connect to previous node in same category (creates a chain)
          links.push({
            source: categoryNodes[i - 1].id,
            target: categoryNodes[i].id,
            strength: 0.7, // Stronger connections within category
            type: "core",
          });
        }
      }

      // Add some cross-category links for related skills
      for (let i = 0; i < processedNodes.length; i++) {
        for (let j = i + 1; j < processedNodes.length; j++) {
          // Only connect if they're in different categories but related
          if (
            processedNodes[i].category !== processedNodes[j].category &&
            areSkillsRelated(processedNodes[i].name, processedNodes[j].name)
          ) {
            links.push({
              source: processedNodes[i].id,
              target: processedNodes[j].id,
              strength: 0.15, // Weaker cross-category connections
              type: "core",
            });
          }
        }
      }
    });

    return links;
  }, [processedNodes, groupedSkills]);

  // Initialize graph data
  useEffect(() => {
    if (processedNodes.length > 0 && !isInitialized) {
      setData({
        nodes: processedNodes,
        links: processedLinks,
      });
      setIsInitialized(true);
    }
  }, [processedNodes, processedLinks, isInitialized]);

  // Update graph bounds when the container resizes
  useEffect(() => {
    if (graphRef.current) {
      const updateBounds = () => {
        const { width, height } = graphRef.current!.getBoundingClientRect();
        setGraphBounds({ width, height });
      };

      updateBounds();
      window.addEventListener("resize", updateBounds);

      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  // Check if two skills are related
  function areSkillsRelated(skillA: string, skillB: string): boolean {
    // Basic algorithm to check skill relatedness
    const wordMapA = new Set(skillA.toLowerCase().split(/[\s\-_.,;:]/));
    const wordMapB = new Set(skillB.toLowerCase().split(/[\s\-_.,;:]/));

    // Check for common words
    let commonWords = 0;
    wordMapA.forEach((word) => {
      if (wordMapB.has(word) && word.length > 2) commonWords++;
    });

    return (
      commonWords > 0 || skillA.includes(skillB) || skillB.includes(skillA)
    );
  }

  // Simulate Gemini API to generate suggested skills
  const generateSkillSuggestions = async () => {
    setIsGenerating(true);

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // The actual suggestions would come from Gemini API
      // For now, we'll simulate it with generated suggestions
      const suggestedSkills = generateMockSuggestions();

      // Add the suggested skills to the graph
      setData((prevData) => {
        // Create new nodes
        const newNodes = [...prevData.nodes];
        const newLinks: Link[] = [...prevData.links];

        suggestedSkills.forEach((suggestion) => {
          // Check if the skill already exists to avoid duplicates
          if (
            !newNodes.some(
              (node) =>
                node.name.toLowerCase() === suggestion.name.toLowerCase()
            )
          ) {
            // Find parent node to place suggestion near it
            const parentNode = newNodes.find(
              (n) => n.id === suggestion.fromSkill
            );
            if (parentNode) {
              // Position the suggestion near its parent node
              const angle =
                (parentNode.angle || 0) + (Math.random() * 0.5 - 0.25);
              const distance = (parentNode.distance || 100) + 30;
              const categoryX = parentNode.clusterX || 0;
              const categoryY = parentNode.clusterY || 0;

              suggestion.x = categoryX + distance * Math.cos(angle);
              suggestion.y = categoryY + distance * Math.sin(angle);
              suggestion.clusterX = categoryX;
              suggestion.clusterY = categoryY;
              suggestion.angle = angle;
              suggestion.distance = distance;
            }

            // Add the suggestion as a new node
            newNodes.push(suggestion);

            // Add a link to the related skill
            newLinks.push({
              source: suggestion.fromSkill!,
              target: suggestion.id,
              strength: 0.5,
              type: "suggested",
            });
          }
        });

        return {
          nodes: newNodes,
          links: newLinks,
        };
      });

      // Create a ripple effect animation for each new suggestion
      setTimeout(() => {
        suggestedSkills.forEach((skill) => {
          if (graphRef.current) {
            const node = d3
              .select(graphRef.current)
              .select(`.node-${skill.id}`);
            if (!node.empty()) {
              const nodeElement = node.node() as SVGElement;
              const nodeRect = nodeElement.getBoundingClientRect();
              const graphRect = graphRef.current.getBoundingClientRect();

              // Calculate relative position
              const x = nodeRect.left - graphRect.left + nodeRect.width / 2;
              const y = nodeRect.top - graphRect.top + nodeRect.height / 2;

              createRipple(x, y, skill.colorLight);
            }
          }
        });
      }, 500);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to create a ripple animation
  const createRipple = (x: number, y: number, color: string) => {
    if (!graphRef.current) return;

    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.background = `radial-gradient(circle, ${color}40 0%, transparent 70%)`;
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.borderRadius = "50%";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "10";

    graphRef.current.parentElement?.appendChild(ripple);

    anime({
      targets: ripple,
      width: ["0px", "200px"],
      height: ["0px", "200px"],
      opacity: [0.6, 0],
      easing: "easeOutExpo",
      duration: 1500,
      complete: () => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      },
    });
  };

  // Mock function to generate skill suggestions (would be replaced by Gemini API)
  const generateMockSuggestions = () => {
    const suggestions: ProcessedSkill[] = [];
    const usedNodes = new Set<string>();

    // Get 3 random skills to create suggestions for
    const nodesToUse = data.nodes.filter((node) => !node.suggested);
    const shuffled = [...nodesToUse].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(shuffled.length, 3));

    selected.forEach((node) => {
      // Generate suggestions for this node
      const suggestedSkillsForNode = getSuggestedSkillsForNode(node);

      suggestedSkillsForNode.forEach((skill) => {
        // Only add if we haven't already suggested this
        if (!usedNodes.has(skill.name)) {
          suggestions.push(skill);
          usedNodes.add(skill.name);
        }
      });
    });

    return suggestions;
  };

  // Generate relevant skill suggestions based on a skill
  const getSuggestedSkillsForNode = (node: ProcessedSkill) => {
    // This would be the Gemini API call in a real implementation
    const suggestions: ProcessedSkill[] = [];

    // Common skill pairings by category
    const skillSuggestions: { [key: string]: string[] } = {
      Frontend: [
        "React Testing Library",
        "Storybook",
        "Webpack",
        "Vite",
        "Next.js",
        "Gatsby",
        "Tailwind CSS",
      ],
      Backend: [
        "Redis",
        "GraphQL",
        "gRPC",
        "Kafka",
        "RabbitMQ",
        "Prisma",
        "TypeORM",
      ],
      Design: [
        "User Research",
        "Design Systems",
        "Prototyping",
        "Wireframing",
        "Motion Design",
        "Color Theory",
      ],
      DevOps: [
        "Terraform",
        "Ansible",
        "Prometheus",
        "Grafana",
        "Jenkins",
        "GitHub Actions",
        "CircleCI",
      ],
      AI: [
        "Hugging Face",
        "Scikit-learn",
        "Computer Vision",
        "Reinforcement Learning",
        "LangChain",
        "MLOps",
      ],
      Data: [
        "Tableau",
        "Power BI",
        "dbt",
        "Snowflake",
        "Apache Spark",
        "Pandas",
        "Data Governance",
      ],
      Mobile: [
        "Mobile UX Design",
        "Firebase",
        "PWA",
        "Offline-first Design",
        "App Store Optimization",
      ],
      Cloud: [
        "Microservices",
        "Serverless Architecture",
        "CDN",
        "Cloud Security",
        "Multi-cloud Strategy",
      ],
      Advanced: [
        "System Design",
        "Architecture Patterns",
        "Performance Optimization",
        "Scalability",
      ],
      Intermediate: ["Testing", "Documentation", "Code Review", "Refactoring"],
      Beginner: [
        "Best Practices",
        "Clean Code",
        "Version Control",
        "Problem Solving",
      ],
    };

    // Get suggestions based on category
    const category = node.category || "Beginner";
    const potentialSuggestions = skillSuggestions[category] || [];

    // Also check for name-based matches
    const specificSuggestions: string[] = [];
    if (node.name.includes("React"))
      specificSuggestions.push("Redux", "React Router", "React Query");
    if (node.name.includes("Node"))
      specificSuggestions.push("Express.js", "Nest.js", "Socket.io");
    if (node.name.includes("Python"))
      specificSuggestions.push("Django", "FastAPI", "NumPy");
    if (node.name.includes("Java"))
      specificSuggestions.push("Spring Boot", "Hibernate", "JUnit");
    if (node.name.includes("CSS"))
      specificSuggestions.push("Sass", "CSS-in-JS", "CSS Modules");
    if (node.name.includes("AWS"))
      specificSuggestions.push("S3", "Lambda", "EC2", "DynamoDB");

    // Get 1-2 suggestions
    const allSuggestions = [...potentialSuggestions, ...specificSuggestions];
    const shuffled = [...new Set(allSuggestions)].sort(
      () => 0.5 - Math.random()
    );
    const selected = shuffled.slice(0, Math.min(2, shuffled.length));

    selected.forEach((suggestionName, idx) => {
      // Don't suggest skills that already exist
      if (
        data.nodes.some(
          (n) => n.name.toLowerCase() === suggestionName.toLowerCase()
        )
      ) {
        return;
      }

      // Create new suggested skill
      const colorIndex = (data.nodes.length + idx) % colorPalette.length;
      const colors = colorPalette[colorIndex];

      suggestions.push({
        id: `suggested-${node.id}-${idx}`,
        name: suggestionName,
        level: Math.min(node.level + Math.floor(Math.random() * 10) - 5, 100),
        lastVerified: new Date().toISOString(),
        endorsements: 0,
        colorMain: colors.main,
        colorLight: colors.light,
        colorDark: colors.dark,
        radius: 8, // Smaller than normal skills
        category: node.category,
        suggested: true,
        fromSkill: node.id,
        description: `Suggested based on your skill in ${node.name}`,
      });
    });

    return suggestions;
  };

  // Initialize the force graph with structured layout
  useEffect(() => {
    if (!graphRef.current || !data.nodes.length) return;

    const width = graphRef.current.clientWidth || 800;
    const height = graphRef.current.clientHeight || 600;

    // Clear previous contents
    const svg = d3.select(graphRef.current);
    svg.selectAll("*").remove();

    // Prepare SVG with defs for gradients
    const defs = svg.append("defs");

    // Create gradients for each node
    data.nodes.forEach((node) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `gradient-${node.id}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "25%")
        .attr("fy", "25%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", node.colorLight)
        .attr("stop-opacity", node.suggested ? 0.8 : 1);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", node.colorMain)
        .attr("stop-opacity", node.suggested ? 0.7 : 0.8);
    });

    // Filter for glow effect
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("width", "300%")
      .attr("height", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create marker for arrows on suggested links
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ffffff");

    // Create container for zoom/pan
    const container = svg.append("g").attr("class", "container");

    // Add category backgrounds for better visual grouping
    const categories = Array.from(new Set(data.nodes.map((n) => n.category)));
    const categoryGroups = container
      .append("g")
      .attr("class", "category-groups")
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", (d) => `category-group-${d}`);

    // Add category labels
    categoryGroups
      .append("text")
      .attr("class", "category-label")
      .text((d) => d)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .attr("text-anchor", "middle")
      .attr("dy", "-20px");

    // Add category background
    categoryGroups
      .append("circle")
      .attr("class", "category-background")
      .attr("r", 130)
      .attr("fill", (d, i) => {
        // Get color from the first node in this category
        const firstNode = data.nodes.find((n) => n.category === d);
        return firstNode
          ? `${firstNode.colorMain}10`
          : "rgba(255, 255, 255, 0.03)";
      })
      .attr("stroke", (d, i) => {
        const firstNode = data.nodes.find((n) => n.category === d);
        return firstNode
          ? `${firstNode.colorMain}30`
          : "rgba(255, 255, 255, 0.1)";
      })
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 2])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8)
    );

    // Create links with curved paths
    const linkElements = container
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(data.links)
      .enter()
      .append("path")
      .attr(
        "class",
        (d) => `link ${d.type === "suggested" ? "suggested-link" : "core-link"}`
      )
      .attr("stroke", (d) =>
        d.type === "suggested" ? "#ffffff" : "rgba(255, 255, 255, 0.2)"
      )
      .attr("stroke-width", (d) => (d.type === "suggested" ? 1.5 : 0.8))
      .attr("stroke-dasharray", (d) => (d.type === "suggested" ? "3,3" : null))
      .attr("opacity", (d) => (d.type === "suggested" ? 0.6 : 0.3))
      .attr("fill", "none")
      .attr("marker-end", (d) =>
        d.type === "suggested" ? "url(#arrowhead)" : null
      );

    // Create nodes
    const nodeElements = container
      .append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", (d) => `node node-${d.id}`)
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, ProcessedSkill>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
        d3.select(event.currentTarget).raise(); // Bring to front
      })
      .on("mouseover", (event, d) => {
        setHoveredNode(d);

        // Highlight node
        d3.select(event.currentTarget)
          .select("circle.node-circle")
          .transition()
          .duration(300)
          .attr("r", d.radius + 3)
          .attr("filter", "url(#glow)");

        // Highlight connections
        const connectedNodeIds = new Set();
        data.links.forEach((link) => {
          const sourceId =
            typeof link.source === "string" ? link.source : link.source.id;
          const targetId =
            typeof link.target === "string" ? link.target : link.target.id;

          if (sourceId === d.id) connectedNodeIds.add(targetId);
          if (targetId === d.id) connectedNodeIds.add(sourceId);
        });

        // Highlight connected nodes
        d3.selectAll(".node")
          .filter(function (n: any) {
            return connectedNodeIds.has(n.id);
          })
          .select("circle.node-circle")
          .transition()
          .duration(300)
          .attr("r", (n: any) => n.radius + 2)
          .attr("filter", "url(#glow)");

        // Highlight related links
        d3.selectAll("path.link")
          .filter(function (l: any) {
            const sourceId =
              typeof l.source === "string" ? l.source : l.source.id;
            const targetId =
              typeof l.target === "string" ? l.target : l.target.id;
            return sourceId === d.id || targetId === d.id;
          })
          .transition()
          .duration(300)
          .attr("stroke", (l) => {
            const nodeColor = d.colorMain;
            return l.type === "suggested" ? nodeColor : nodeColor + "80";
          })
          .attr("stroke-width", (l) => (l.type === "suggested" ? 2 : 1.5))
          .attr("opacity", 0.8);
      })
      .on("mouseout", (event, d) => {
        setHoveredNode(null);

        // Reset highlight if not selected
        if (!selectedNode || selectedNode.id !== d.id) {
          d3.select(event.currentTarget)
            .select("circle.node-circle")
            .transition()
            .duration(300)
            .attr("r", d.radius)
            .attr("filter", d.suggested ? "url(#glow)" : null);
        }

        // Reset all links
        d3.selectAll("path.link")
          .transition()
          .duration(300)
          .attr("stroke", (l) =>
            l.type === "suggested" ? "#ffffff" : "rgba(255, 255, 255, 0.2)"
          )
          .attr("stroke-width", (l) => (l.type === "suggested" ? 1.5 : 0.8))
          .attr("opacity", (l) => (l.type === "suggested" ? 0.6 : 0.3));

        // Reset all other nodes
        d3.selectAll(".node")
          .filter(function (n: any) {
            return n.id !== d.id && (!selectedNode || n.id !== selectedNode.id);
          })
          .select("circle.node-circle")
          .transition()
          .duration(300)
          .attr("r", (n: any) => n.radius)
          .attr("filter", (n: any) => (n.suggested ? "url(#glow)" : null));
      });

    // Node circles
    nodeElements
      .append("circle")
      .attr("class", "node-circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => `url(#gradient-${d.id})`)
      .attr("filter", (d) => (d.suggested ? "url(#glow)" : null))
      .attr("stroke", (d) => d.colorDark)
      .attr("stroke-width", (d) => (d.suggested ? 1.5 : 1))
      .attr("stroke-dasharray", (d) => (d.suggested ? "2,2" : null));

    // Sparkle indicator for suggested skills
    nodeElements
      .filter((d) => d.suggested)
      .append("text")
      .attr("class", "sparkle")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#ffffff")
      .text("✨");

    // Node labels
    nodeElements
      .append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("dy", (d) => d.radius + 12)
      .attr("font-family", "sans-serif")
      .attr("font-size", (d) => 11 + (d.level / 100) * 2)
      .attr("fill", "white")
      .attr("stroke", "rgba(0, 0, 0, 0.5)")
      .attr("stroke-width", 2)
      .attr("paint-order", "stroke")
      .text((d) => d.name);

    // Node level indicators
    nodeElements
      .append("text")
      .attr("class", "node-level")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-family", "sans-serif")
      .attr("font-size", 9)
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text((d) => d.level);

    // Initialize with a more structured force simulation
    const simulation = d3
      .forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .alpha(0.3)
      .alphaDecay(0.02) // Slower decay for smoother movement
      .velocityDecay(0.4) // Add more friction
      .force("charge", d3.forceManyBody().strength(-50)) // Weaker repulsion
      .force("center", d3.forceCenter(0, 0).strength(0.05)) // Weak centering force
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance((d) => ((d as Link).type === "suggested" ? 80 : 50))
          .strength((d) => (d as Link).strength)
      )
      .force(
        "collide",
        d3.forceCollide().radius((d: any) => (d as ProcessedSkill).radius * 1.8)
      )
      // Add a custom force to pull nodes toward their cluster position
      .force("clusterPosition", (alpha) => {
        for (let i = 0; i < data.nodes.length; i++) {
          const d = data.nodes[i];
          // Pull each node toward its predefined position
          const targetX = d.x || 0;
          const targetY = d.y || 0;

          // Apply force toward target position
          d.vx = d.vx || 0;
          d.vy = d.vy || 0;
          d.vx += (targetX - (d.x || 0)) * alpha * 0.3;
          d.vy += (targetY - (d.y || 0)) * alpha * 0.3;
        }
      })
      // Add boundary force to keep nodes within visible area
      .force("boundary", (alpha) => {
        const padding = 50;
        const radius = Math.min(width, height) / 2;

        for (let i = 0; i < data.nodes.length; i++) {
          const d = data.nodes[i];
          const x = d.x || 0;
          const y = d.y || 0;
          const r = Math.sqrt(x * x + y * y);

          if (r > radius - padding) {
            // If node is outside boundary, push it back
            const angle = Math.atan2(y, x);
            const targetX = (radius - padding) * Math.cos(angle);
            const targetY = (radius - padding) * Math.sin(angle);

            d.vx = d.vx || 0;
            d.vy = d.vy || 0;
            d.vx += (targetX - x) * alpha;
            d.vy += (targetY - y) * alpha;
          }
        }
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      // Update category group positions
      categoryGroups.attr("transform", (d) => {
        // Find the first node in this category to get position
        const categoryNode = data.nodes.find((n) => n.category === d);
        if (
          categoryNode &&
          categoryNode.clusterX !== undefined &&
          categoryNode.clusterY !== undefined
        ) {
          return `translate(${categoryNode.clusterX},${categoryNode.clusterY})`;
        }
        return "translate(0,0)";
      });

      // Update link positions with curved paths
      linkElements.attr("d", (d: any) => {
        const source = d.source as ProcessedSkill;
        const target = d.target as ProcessedSkill;

        // Calculate midpoint for the curve
        const midX = (source.x! + target.x!) / 2;
        const midY = (source.y! + target.y!) / 2;

        // Add curvature perpendicular to the line
        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const norm = Math.sqrt(dx * dx + dy * dy);
        const curveFactor = 0.2; // Controls how much curve

        let cpx = midX + curveFactor * -dy;
        let cpy = midY + curveFactor * dx;

        // For suggested links, use a straighter path
        if (d.type === "suggested") {
          cpx = midX;
          cpy = midY;
        }

        // Create a curved path
        return `M${source.x},${source.y} Q${cpx},${cpy} ${target.x},${target.y}`;
      });

      // Update node positions
      nodeElements.attr(
        "transform",
        (d) => `translate(${d.x || 0},${d.y || 0})`
      );
    });

    // Drag functions
    function dragstarted(
      event: d3.D3DragEvent<SVGGElement, ProcessedSkill, ProcessedSkill>,
      d: ProcessedSkill
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, ProcessedSkill, ProcessedSkill>,
      d: ProcessedSkill
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGGElement, ProcessedSkill, ProcessedSkill>,
      d: ProcessedSkill
    ) {
      if (!event.active) simulation.alphaTarget(0);

      // For suggested nodes, let them return to their position
      if (d.suggested) {
        d.fx = null;
        d.fy = null;
      } else {
        // Core nodes maintain their position
        // but we update their cluster position
        d.clusterX = d.x;
        d.clusterY = d.y;
      }
    }

    // Clean up simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [data, selectedNode, graphBounds]);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik01NCAxMCBDNTQgNy43OTA4NjEgNTYuNzkwODYgNSA1OSA1IEM1OS41NTIyOCA1IDYwIDQuNTUyMjg1IDYwIDQgQzYwIDMuNDQ3NzE1IDU5LjU1MjI4IDMgNTkgMyBDNTUuNjg2MjkgMyA1MiA2LjY4NjI5MSA1MiAxMCBDNTIgMTAuNTUyMyA1Mi40NDc3MiAxMSA1MyAxMSBDNTMuNTUyMyAxMSA1NCAxMC41NTIzIDU0IDEwIFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbC1vcGFjaXR5PSIxIiBzdHJva2U9Im5vbmUiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik05IDUwIEM5IDQ3Ljc5MDkgMTEuNzkwOSA0NSAxNCA0NSBDMTQuNTUyMyA0NSAxNSA0NC41NTIzIDE1IDQ0IEMxNSA0My40NDc3IDE0LjU1MjMgNDMgMTQgNDMgQzEwLjY4NjMgNDMgNyA0Ni42ODYzIDcgNTAgQzcgNTAuNTUyMyA3LjQ0NzcyIDUxIDggNTEgQzguNTUyMjkgNTEgOSA1MC41NTIzIDkgNTAgWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAxNSkiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbC1vcGFjaXR5PSIxIiBzdHJva2U9Im5vbmUiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik05IDI4IEM5IDI1Ljc5MDkgMTEuNzkwOSAyMyAxNCAyMyBDMTQuNTUyMyAyMyAxNSAyMi41NTIzIDE1IDIyIEMxNSAyMS40NDc3IDE0LjU1MjMgMjEgMTQgMjEgQzEwLjY4NjMgMjEgNyAyNC42ODYzIDcgMjggQzcgMjguNTUyMyA3LjQ0NzcyIDI5IDggMjkgQzguNTUyMjkgMjkgOSAyOC41NTIzIDkgMjggWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZT0ibm9uZSI+PC9wYXRoPgogICAgPHBhdGggZD0iTTMxIDUwIEMzMSA0Ny43OTA5IDMzLjc5MDkgNDUgMzYgNDUgQzM2LjU1MjMgNDUgMzcgNDQuNTUyMyAzNyA0NCBDMzcgNDMuNDQ3NyAzNi41NTIzIDQzIDM2IDQzIEMzMi42ODYzIDQzIDI5IDQ2LjY4NjMgMjkgNTAgQzI5IDUwLjU1MjMgMjkuNDQ3NyA1MSAzMCA1MSBDMzAuNTUyMyA1MSAzMSA1MC41NTIzIDMxIDUwIFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbC1vcGFjaXR5PSIxIiBzdHJva2U9Im5vbmUiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik0yNCAxNSBDMjQgMTIuNzkwOSAyNi43OTA5IDEwIDI5IDEwIEMyOS41NTIzIDEwIDMwIDkuNTUyMjkgMzAgOSBDMzAgOC40NDc3MSAyOS41NTIzIDggMjkgOCBDMjUuNjg2MyA4IDIyIDExLjY4NjMgMjIgMTUgQzIyIDE1LjU1MjMgMjIuNDQ3NyAxNiAyMyAxNiBDMjMuNTUyMyAxNiAyNCAxNS41NTIzIDI0IDE1IFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbC1vcGFjaXR5PSIxIiBzdHJva2U9Im5vbmUiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik01NCAzMCBDNTQgMjcuNzkwOSA1Ni43OTA5IDI1IDU5IDI1IEM1OS41NTIzIDI1IDYwIDI0LjU1MjMgNjAgMjQgQzYwIDIzLjQ0NzcgNTkuNTUyMyAyMyA1OSAyMyBDNTUuNjg2MyAyMyA1MiAyNi42ODYzIDUyIDMwIEM1MiAzMC41NTIzIDUyLjQ0NzcgMzEgNTMgMzEgQzUzLjU1MjMgMzEgNTQgMzAuNTUyMyA1NCAzMCBaIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGwtb3BhY2l0eT0iMSIgc3Ryb2tlPSJub25lIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-10"></div>

      {/* User info overlay with updated time and user */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-4 py-2 rounded-full bg-black/40 text-white/90 text-sm font-medium border border-white/10 inline-flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          {currentTime} • {currentUser}
        </span>
      </div>

      {/* Main graph */}
      <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
        <svg
          ref={graphRef}
          className="w-full h-full"
          style={{ background: "transparent" }}
        />

        {/* Suggest new skills button */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            onClick={generateSkillSuggestions}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border border-indigo-400/30"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Suggest New Skills"}
          </Button>
        </div>

        {/* Info panel for selected skill */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white max-w-xs z-20"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedNode.colorMain }}
                />
                <h3 className="text-lg font-bold">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-3">
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Level:</span>
                  <span className="font-semibold">{selectedNode.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedNode.level}%`,
                      background: `linear-gradient(to right, ${selectedNode.colorLight}, ${selectedNode.colorMain})`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-3">
                <div>
                  <span className="text-white/60">Category:</span>
                  <div className="font-medium">
                    {selectedNode.category || "General"}
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Endorsements:</span>
                  <div className="font-medium">{selectedNode.endorsements}</div>
                </div>
                {!selectedNode.suggested && (
                  <div className="col-span-2">
                    <span className="text-white/60">Last Verified:</span>
                    <div className="font-medium">
                      {new Date(selectedNode.lastVerified).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {selectedNode.suggested && (
                <div className="mt-1 p-2 bg-indigo-500/20 rounded border border-indigo-400/30 text-sm">
                  <div className="flex items-center gap-1 text-indigo-300 font-medium mb-1">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Suggested Skill</span>
                  </div>
                  <p className="text-white/80 text-xs">
                    {selectedNode.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tooltip for hovering */}
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-30 transition-opacity duration-200"
          style={{
            opacity: hoveredNode && !selectedNode ? 1 : 0,
            left: tooltipRef.current ? tooltipRef.current.offsetLeft : 0,
            top: tooltipRef.current ? tooltipRef.current.offsetTop : 0,
          }}
        >
          {hoveredNode && !selectedNode && (
            <div className="bg-black/80 backdrop-blur-sm p-2 rounded text-white text-sm white-space-nowrap shadow-lg border border-white/10">
              <div className="font-medium">{hoveredNode.name}</div>
              <div className="text-xs text-white/70">
                Level: {hoveredNode.level}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 text-gray-400 text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md z-10">
        <span>
          Drag nodes to arrange • Click to select • Use the "Suggest New Skills"
          button for AI recommendations
        </span>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          transform-origin: center;
          pointer-events: none;
          z-index: 20;
        }

        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.7;
          }
        }

        .node-circle {
          transition: all 0.3s ease;
        }

        .sparkle {
          animation: pulse 2s infinite;
        }

        path.link {
          transition: all 0.3s ease;
        }

        .category-background {
          transition: all 0.5s ease;
        }

        .category-label {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
