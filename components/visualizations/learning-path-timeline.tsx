"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import gsap from "gsap";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  progress?: number;
  dueDate?: string;
  completedDate?: string;
  grade?: string;
}

interface LearningPathTimelineProps {
  completedCourses: Course[];
  currentCourses: Course[];
  careerObjectives: string[];
}

export function LearningPathTimeline({
  completedCourses,
  currentCourses,
  careerObjectives,
}: LearningPathTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    const timelineData = [
      ...completedCourses.map((course) => ({
        ...course,
        type: "completed",
        date: new Date(course.completedDate as string),
      })),
      ...currentCourses.map((course) => ({
        ...course,
        type: "current",
        date: new Date(course.dueDate as string),
      })),
      ...careerObjectives.map((objective, i) => ({
        id: `objective-${i}`,
        title: objective,
        type: "objective",
        date: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 90),
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(timelineData, (d) => d.date) || new Date(),
        d3.max(timelineData, (d) => d.date) || new Date(),
      ])
      .range([50, width - 50]);

    const timelineGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`);

    timelineGroup
      .append("line")
      .attr("x1", 30)
      .attr("x2", width - 30)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.3);

    const nodeGroups = timelineGroup
      .selectAll(".node")
      .data(timelineData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${xScale(d.date)}, 0)`)
      .style("opacity", 0); // Start invisible

    // Node circles
    nodeGroups
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d) => {
        switch (d.type) {
          case "completed":
            return "var(--accent)";
          case "current":
            return "var(--primary)";
          case "objective":
            return "var(--secondary)";
          default:
            return "var(--muted-foreground)";
        }
      });

    nodeGroups
      .append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", (d) => (d.type === "objective" ? -40 : 40))
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3);

    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "objective" ? "-50px" : "60px"))
      .text((d) => d.title)
      .attr("fill", "currentColor")
      .attr("font-size", 12)
      .each(function (d) {
        const text = d3.select(this);
        const words = d.title.split(/\s+/);
        interface Line extends Array<string> {}
        let line: Line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("dy");
        const x = 0;
        const dy = parseFloat(text.attr("dy"));
        let tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "px");

        for (let i = 0; i < words.length; i++) {
          line.push(words[i]);
          tspan.text(line.join(" "));

          if ((tspan.node()?.getComputedTextLength() as number) > 100) {
            line.pop();
            tspan.text(line.join(" "));
            line = [words[i]];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "px")
              .text(words[i]);
          }
        }
      });

    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "objective" ? "-75px" : "85px"))
      .text((d) => d.date.toLocaleDateString())
      .attr("fill", "var(--muted-foreground)")
      .attr("font-size", 10);

    // Type indicators
    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "5px")
      .text((d) => {
        switch (d.type) {
          case "completed":
            return "✓";
          case "current":
            return "➤";
          case "objective":
            return "★";
          default:
            return "";
        }
      })
      .attr("fill", "white")
      .attr("font-size", 10)
      .attr("font-weight", "bold");

    // Animate nodes appearing
    gsap.fromTo(
      nodeGroups.nodes(),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, [completedCourses, currentCourses, careerObjectives]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <svg ref={svgRef} width="100%" height="100%" />
    </motion.div>
  );
}
