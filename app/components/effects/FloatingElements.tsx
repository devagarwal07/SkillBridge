"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

type FloatingElementsProps = {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  colors?: string[];
};

const FloatingElements = ({
  count = 15,
  minSize = 10,
  maxSize = 60,
  minOpacity = 0.01,
  maxOpacity = 0.05,
  colors = ["255, 255, 255"], // Default white
}: FloatingElementsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Current user data
  const currentDateTime = "2025-03-03 19:19:43";
  const currentUser = "vkhare2909";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating elements
    const elements: HTMLDivElement[] = [];

    // Generate a unique ID for this instance using timestamp and user
    const instanceId = `floating-${currentUser}-${Date.now()}`;
    container.dataset.instance = instanceId;

    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");
      const size = Math.random() * (maxSize - minSize) + minSize;
      const colorIndex = Math.floor(Math.random() * colors.length);
      const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;

      // Use standard styles
      element.className = "absolute rounded-full";
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.background = `rgba(${colors[colorIndex]}, ${opacity})`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.left = `${Math.random() * 100}vw`;

      // Add metadata
      element.dataset.user = currentUser;
      element.dataset.timestamp = currentDateTime;
      element.dataset.elementId = `${instanceId}-element-${i}`;

      container.appendChild(element);
      elements.push(element);
    }

    // Animate elements with GSAP
    elements.forEach((element, index) => {
      // Movement animation
      gsap.to(element, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: gsap.utils.random(20, 40),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Opacity animation
      gsap.to(element, {
        opacity: gsap.utils.random(minOpacity, maxOpacity * 2),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.1, // Stagger start times
      });
    });

    setIsInitialized(true);

    return () => {
      elements.forEach((element) => {
        gsap.killTweensOf(element);
        if (element.parentNode === container) {
          container.removeChild(element);
        }
      });
    };
  }, [
    count,
    minSize,
    maxSize,
    minOpacity,
    maxOpacity,
    colors,
    currentUser,
    currentDateTime,
  ]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* Metadata for tracking/debugging */}
      {isInitialized && (
        <div className="sr-only" aria-hidden="true">
          Floating elements background initialized by {currentUser} at{" "}
          {currentDateTime}
          Configuration: {count} elements, size range: {minSize}px-{maxSize}px
        </div>
      )}
    </>
  );
};

export default FloatingElements;
