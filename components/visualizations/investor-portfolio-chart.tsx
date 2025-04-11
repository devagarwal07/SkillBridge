"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import * as d3 from "d3";

interface PortfolioData {
  months: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface InvestorPortfolioChartProps {
  data: PortfolioData;
}

export function InvestorPortfolioChart({ data }: InvestorPortfolioChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.months)
      .range([0, innerWidth])
      .padding(0.3);

    const maxValue = d3.max(data.series.flatMap((s) => s.data)) || 0;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1]) // Add 10% padding at the top
      .range([innerHeight, 0]);

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.series.map((s) => s.name))
      .range(["var(--primary)", "var(--secondary)"]);

    // Create the chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1);

    // Add x-axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Style x-axis
    xAxis.selectAll("line").attr("stroke", "currentColor");
    xAxis.selectAll("path").attr("stroke", "currentColor");
    xAxis
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .style("text-anchor", "middle");

    // Add y-axis
    const yAxis = g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => `$${d3.format(",.0f")(d)}`)
    );

    // Style y-axis
    yAxis.selectAll("line").attr("stroke", "currentColor");
    yAxis.selectAll("path").attr("stroke", "currentColor");
    yAxis
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

    // Add y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text("Amount ($)");

    // Group bars by month
    const months = data.months;
    const barWidth = xScale.bandwidth() / data.series.length;

    // Add bars in groups
    data.series.forEach((series, seriesIndex) => {
      const bars = g
        .selectAll(`.bars-${seriesIndex}`)
        .data(series.data)
        .enter()
        .append("rect")
        .attr("class", `bars-${seriesIndex}`)
        .attr("x", (_, i) => (xScale(months[i]) || 0) + barWidth * seriesIndex)
        .attr("y", innerHeight)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", colorScale(series.name) as string)
        .attr("opacity", 0.8);

      // Animate bars
      bars
        .transition()
        .duration(1000)
        .delay((_, i) => i * 50)
        .attr("y", (d) => yScale(d))
        .attr("height", (d) => innerHeight - yScale(d));
    });

    // Add line for the returns series
    const returnsSeries = data.series.find((s) => s.name === "Returns");

    if (returnsSeries) {
      const line = d3
        .line<number>()
        .x((_, i) => (xScale(months[i]) || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);

      const path = g
        .append("path")
        .datum(returnsSeries.data)
        .attr("fill", "none")
        .attr("stroke", "var(--accent)")
        .attr("stroke-width", 3)
        .attr("d", line);

      // Get the total length of the path for animation
      const pathLength = path.node()?.getTotalLength() || 0;

      // Set up path animation
      path
        .attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Add dots on the line
      g.selectAll(".dot")
        .data(returnsSeries.data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (_, i) => (xScale(months[i]) || 0) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d))
        .attr("r", 0)
        .attr("fill", "var(--accent)")
        .transition()
        .delay((_, i) => 1500 + i * 100)
        .attr("r", 5);
    }

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - 20})`);

    data.series.forEach((series, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(${i * 150}, 0)`);

      legendItem
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale(series.name) as string)
        .attr("opacity", 0.8);

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", "currentColor")
        .attr("font-size", "12px")
        .text(series.name);
    });

    // Add hover effects and tooltips
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

    g.selectAll("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 1);

        const seriesName =
          (this as SVGRectElement)
            .getAttribute("class")
            ?.replace("bars-", "") || "0";
        const seriesIndex = parseInt(seriesName);
        const monthIndex = data.series[seriesIndex].data.indexOf(d as number);
        const month = data.months[monthIndex];

        tooltip
          .html(
            `
          <div>
            <strong>${data.series[seriesIndex].name}</strong>
            <div>${month}: $${d3.format(",")(d as number)}</div>
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
        d3.select(this).transition().duration(200).attr("opacity", 0.8);

        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data]);

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
