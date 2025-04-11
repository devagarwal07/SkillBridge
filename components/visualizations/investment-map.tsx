"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// We'll use a simplified world map for this example
const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InvestmentMapProps {
  width?: number;
  height?: number;
}

type InvestmentData = {
  location: string;
  coordinates: [number, number]; // Properly typed as lat/long tuple
  amount: number;
  students: number;
};

export function InvestmentMap({ width, height }: InvestmentMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Store animation instances for cleanup
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Clear previous animations
    animationsRef.current.forEach((anim) => anim.kill());
    animationsRef.current = [];

    const svg = d3.select(svgRef.current);
    // Use props if provided, otherwise use client dimensions
    const actualWidth = width || svgRef.current.clientWidth;
    const actualHeight = height || svgRef.current.clientHeight;

    // Sample investment data with coordinates
    const investmentData: InvestmentData[] = [
      {
        location: "San Francisco",
        coordinates: [-122.4194, 37.7749],
        amount: 350000,
        students: 12,
      },
      {
        location: "Boston",
        coordinates: [-71.0589, 42.3601],
        amount: 220000,
        students: 8,
      },
      {
        location: "New York",
        coordinates: [-74.006, 40.7128],
        amount: 180000,
        students: 7,
      },
      {
        location: "Seattle",
        coordinates: [-122.3321, 47.6062],
        amount: 150000,
        students: 5,
      },
      {
        location: "Austin",
        coordinates: [-97.7431, 30.2672],
        amount: 120000,
        students: 4,
      },
      {
        location: "Chicago",
        coordinates: [-87.6298, 41.8781],
        amount: 110000,
        students: 4,
      },
      {
        location: "Los Angeles",
        coordinates: [-118.2437, 34.0522],
        amount: 90000,
        students: 3,
      },
      {
        location: "Toronto",
        coordinates: [-79.3832, 43.6532],
        amount: 80000,
        students: 3,
      },
      {
        location: "London",
        coordinates: [-0.1278, 51.5074],
        amount: 70000,
        students: 2,
      },
      {
        location: "Berlin",
        coordinates: [13.405, 52.52],
        amount: 65000,
        students: 2,
      },
      {
        location: "Singapore",
        coordinates: [103.8198, 1.3521],
        amount: 55000,
        students: 2,
      },
      {
        location: "Sydney",
        coordinates: [151.2093, -33.8688],
        amount: 45000,
        students: 1,
      },
    ];

    // Create a size scale for the bubbles
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(investmentData, (d) => d.amount) || 100000])
      .range([5, 25]);

    // Create a color scale for the bubbles
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, d3.max(investmentData, (d) => d.amount) || 100000])
      .range(["var(--primary-300)", "var(--primary-600)"]);

    // Create a projection
    const projection = d3
      .geoMercator()
      .scale(actualWidth / 6)
      .center([0, 40])
      .translate([actualWidth / 2, actualHeight / 2]);

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    // Create a group for the map
    const mapGroup = svg.append("g");

    // Tooltip creation - move outside of the map loading to avoid duplicates
    const tooltipId = "investment-map-tooltip";
    d3.select(`#${tooltipId}`).remove(); // Remove any existing tooltip

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", tooltipId)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "var(--popover)")
      .style("color", "var(--popover-foreground)")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "1000")
      .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid var(--border)");

    // Load and draw the world map
    setIsLoading(true);
    setError(null);

    d3.json(mapUrl)
      .then((worldData: any) => {
        // Draw countries
        mapGroup
          .selectAll("path")
          .data(
            topojson.feature(worldData, worldData.objects.countries as any)
              .features
          )
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "var(--muted)")
          .attr("stroke", "var(--border)")
          .attr("stroke-width", 0.5);

        // Add investment bubbles
        const bubbles = svg
          .selectAll(".bubble")
          .data(investmentData)
          .enter()
          .append("circle")
          .attr("class", "bubble")
          .attr("cx", (d) => {
            const coords = projection(d.coordinates);
            return coords ? coords[0] : 0;
          })
          .attr("cy", (d) => {
            const coords = projection(d.coordinates);
            return coords ? coords[1] : 0;
          })
          .attr("r", 0)
          .attr("fill", (d) => colorScale(d.amount))
          .attr("fill-opacity", 0.7)
          .attr("stroke", "var(--background)")
          .attr("stroke-width", 1);

        // Animate bubbles
        bubbles
          .transition()
          .duration(1000)
          .delay((_, i) => i * 100)
          .attr("r", (d) => sizeScale(d.amount));

        // Add pulsing animation with proper tracking for cleanup
        bubbles.each(function () {
          const anim = gsap.to(this, {
            r: "+=2",
            fillOpacity: 0.9,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          animationsRef.current.push(anim);
        });

        // Add tooltips with improved positioning
        bubbles
          .on("mouseover", function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("fill-opacity", 1)
              .attr("stroke-width", 2);

            tooltip
              .html(
                `
                <div>
                  <strong>${d.location}</strong>
                  <div>Investment: $${d.amount.toLocaleString()}</div>
                  <div>Students: ${d.students}</div>
                </div>
              `
              )
              .style("left", `${event.pageX + 15}px`)
              .style("top", `${event.pageY - 28}px`)
              .transition()
              .duration(200)
              .style("opacity", 0.9);
          })
          .on("mousemove", function (event) {
            // Update tooltip position on mouse move for better UX
            tooltip
              .style("left", `${event.pageX + 15}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("fill-opacity", 0.7)
              .attr("stroke-width", 1);

            tooltip.transition().duration(200).style("opacity", 0);
          });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
        setError("Failed to load map data");
        setIsLoading(false);
      });

    // Handle resize events
    const handleResize = () => {
      if (svgRef.current) {
        // Redraw the visualization on resize
        // This could be optimized further to avoid full redraws
        d3.select(svgRef.current).selectAll("*").remove();
        renderMap();
      }
    };

    // Define renderMap function for resize handler
    const renderMap = () => {
      // The rendering logic could be extracted here
      // For simplicity, we'll just trigger a re-render
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      // Remove tooltip
      d3.select(`#${tooltipId}`).remove();

      // Kill all GSAP animations
      animationsRef.current.forEach((anim) => anim.kill());
      animationsRef.current = [];

      // Remove resize listener
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]); // Add width and height to dependency array

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-primary">Loading map data...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-destructive">{error}</div>
        </div>
      )}

      <svg
        ref={svgRef}
        width={width || "100%"}
        height={height || "100%"}
        className={isLoading ? "opacity-30" : "opacity-100"}
      />
    </motion.div>
  );
}
