"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CrosshairProps {
  containerRef: React.RefObject<HTMLDivElement>;
  color?: string;
  size?: number;
}

const Crosshair: React.FC<CrosshairProps> = ({
  containerRef,
  color = "#ffffff",
  size = 20,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerRef]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50"
      animate={{
        x: position.x,
        y: position.y,
        opacity: isActive ? 1 : 0,
        scale: isClicking ? 0.8 : 1,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.1,
      }}
      initial={{ opacity: 0 }}
      style={{ marginLeft: -size / 2, marginTop: -size / 2 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: isClicking ? 45 : 0,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: size,
            height: 1,
            backgroundColor: color,
            left: 0,
            top: size / 2,
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: 1,
            height: size,
            backgroundColor: color,
            left: size / 2,
            top: 0,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 5,
            height: 5,
            backgroundColor: color,
            left: size / 2 - 2.5,
            top: size / 2 - 2.5,
            opacity: 0.8,
          }}
          animate={{
            scale: isClicking ? 3 : 1,
            opacity: isClicking ? 0.4 : 0.8,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Crosshair;
