"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

interface SkillData {
  name: string;
  level: number;
}

interface SkillGapChartProps {
  skills: SkillData[]; // Required skills
  talentPool: SkillData[]; // Available talent skills
}

export function SkillGapChart({ skills, talentPool }: SkillGapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !skills || !talentPool) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const requiredSkillsMap = new Map<string, number>();
    const availableSkillsMap = new Map<
      string,
      { total: number; count: number }
    >();

    skills.forEach((skill) => {
      requiredSkillsMap.set(
        skill.name,
        Math.max(requiredSkillsMap.get(skill.name) || 0, skill.level)
      );
    });

    talentPool.forEach((skill) => {
      const existing = availableSkillsMap.get(skill.name) || {
        total: 0,
        count: 0,
      };
      availableSkillsMap.set(skill.name, {
        total: existing.total + skill.level,
        count: existing.count + 1,
      });
    });

    const chartData = Array.from(requiredSkillsMap.entries())
      .map(([name, required]) => {
        const available = availableSkillsMap.get(name);
        const avgAvailable = available ? available.total / available.count : 0;
        const gap = Math.max(0, required - avgAvailable);

        return {
          name,
          required,
          available: avgAvailable,
          gap,
        };
      })
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 7);

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const yScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(xScale.ticks(5))
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1);

    const xAxis = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));

    xAxis.selectAll("line").attr("stroke", "currentColor");
    xAxis.selectAll("path").attr("stroke", "currentColor");
    xAxis
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text("Skill Level (0-100)");

    const yAxis = g.append("g").call(d3.axisLeft(yScale));

    yAxis.selectAll("line").attr("stroke", "currentColor");
    yAxis.selectAll("path").attr("stroke", "currentColor");
    yAxis
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

    const requiredBars = g
      .selectAll(".required-bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "required-bar")
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 4)
      .attr("height", yScale.bandwidth() / 2)
      .attr("x", 0)
      .attr("width", 0)
      .attr("fill", "var(--primary)")
      .attr("opacity", 0.7);

    requiredBars
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("width", (d) => xScale(d.required));

    const availableBars = g
      .selectAll(".available-bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "available-bar")
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 4)
      .attr("height", yScale.bandwidth() / 2)
      .attr("x", 0)
      .attr("width", 0)
      .attr("fill", (d) =>
        d.available < d.required ? "var(--destructive)" : "var(--accent)"
      )
      .attr("opacity", 0.7);

    availableBars
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr("width", (d) => xScale(d.available));

    const gapHighlights = g
      .selectAll(".gap-highlight")
      .data(chartData.filter((d) => d.gap > 0))
      .enter()
      .append("rect")
      .attr("class", "gap-highlight")
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 4)
      .attr("height", yScale.bandwidth() / 2)
      .attr("x", (d) => xScale(d.available))
      .attr("width", (d) => xScale(d.gap))
      .attr("fill", "url(#gap-pattern)")
      .attr("opacity", 0);

    const pattern = svg
      .append("defs")
      .append("pattern")
      .attr("id", "gap-pattern")
      .attr("width", 6)
      .attr("height", 6)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(45)");

    pattern
      .append("rect")
      .attr("width", 6)
      .attr("height", 6)
      .attr("fill", "var(--destructive)")
      .attr("opacity", 0.15);

    pattern
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 6)
      .attr("stroke", "var(--destructive)")
      .attr("stroke-width", 2)
      .attr("opacity", 0.3);

    gapHighlights
      .transition()
      .duration(600)
      .delay((_, i) => i * 100 + 1000)
      .attr("opacity", 1);

    g.selectAll(".required-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "required-label")
      .attr("x", (d) => xScale(d.required) + 5)
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "currentColor")
      .attr("font-size", "10px")
      .attr("opacity", 0)
      .text((d) => `Required: ${Math.round(d.required)}`)
      .transition()
      .duration(500)
      .delay((_, i) => i * 100 + 800)
      .attr("opacity", 1);

    g.selectAll(".available-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "available-label")
      .attr("x", (d) => xScale(d.available) - 5)
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "currentColor")
      .attr("font-size", "10px")
      .attr("opacity", 0)
      .text((d) => `Available: ${Math.round(d.available)}`)
      .transition()
      .duration(500)
      .delay((_, i) => i * 100 + 1200)
      .attr("opacity", 1);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "var(--popover)")
      .style("color", "var(--popover-foreground)")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid var(--border)");

    gapHighlights
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 0.9);

        tooltip
          .html(
            `
          <div>
            <strong>${d.name} Skill Gap</strong>
            <div>Required: ${Math.round(d.required)}</div>
            <div>Available: ${Math.round(d.available)}</div>
            <div>Gap: ${Math.round(d.gap)} points</div>
          </div>
        `
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px")
          .transition()
          .duration(200)
          .style("opacity", 0.9);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);

        tooltip.transition().duration(200).style("opacity", 0);
      });

    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - 20})`);

    // Required skills legend item
    const requiredLegend = legend
      .append("g")
      .attr("transform", "translate(0, 0)");

    requiredLegend
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "var(--primary)")
      .attr("opacity", 0.7);

    requiredLegend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text("Required Level");

    const availableLegend = legend
      .append("g")
      .attr("transform", `translate(${innerWidth / 3}, 0)`);

    availableLegend
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "var(--accent)")
      .attr("opacity", 0.7);

    availableLegend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text("Available Talent");

    const gapLegend = legend
      .append("g")
      .attr("transform", `translate(${(innerWidth * 2) / 3}, 0)`);

    gapLegend
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "url(#gap-pattern)");

    gapLegend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text("Skill Gap");

    return () => {
      tooltip.remove();
    };
  }, [skills, talentPool]);

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
