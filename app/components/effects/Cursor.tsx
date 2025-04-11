"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "link" | "button" | "text" | "hidden";

const Cursor = () => {
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [clickCount, setClickCount] = useState(0);
  const [lastActive, setLastActive] = useState(new Date().toISOString());

  // Use motion values for smoother animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 1000, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // Track cursor position
    const updatePosition = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setLastActive(new Date().toISOString());
    };

    // Click events
    const handleMouseDown = () => {
      setClicked(true);
      setClickCount((prev) => prev + 1);
    };
    const handleMouseUp = () => setClicked(false);

    // Hover in/out
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Define interactive elements
    const setupInteractiveElements = () => {
      // Links and buttons
      const interactiveEls = document.querySelectorAll("a, button");
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorMode("link"));
        el.addEventListener("mouseleave", () => setCursorMode("default"));
      });

      // Text inputs
      const textInputs = document.querySelectorAll(
        'input[type="text"], textarea'
      );
      textInputs.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorMode("text"));
        el.addEventListener("mouseleave", () => setCursorMode("default"));
      });
    };

    setupInteractiveElements();

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      setupInteractiveElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [x, y]);

  // Dynamic styles
  const getCursorStyles = () => {
    switch (cursorMode) {
      case "link":
        return {
          scale: clicked ? 1.1 : 1.4,
          width: "44px",
          height: "44px",
          borderColor: "rgba(99, 102, 241, 0.75)", // Indigo
          boxShadow: clicked
            ? "0 0 10px rgba(99, 102, 241, 0.5)"
            : "0 0 15px rgba(99, 102, 241, 0.4)",
        };
      case "text":
        return {
          scale: clicked ? 1.05 : 1,
          width: "4px",
          height: "24px",
          borderRadius: "2px",
          borderColor: "rgba(255, 255, 255, 0.7)",
          boxShadow: "none",
        };
      case "hidden":
        return {
          opacity: 0,
          scale: 0,
        };
      default:
        return {
          scale: clicked ? 1.1 : 1,
          width: "36px",
          height: "36px",
          borderColor: "rgba(255, 255, 255, 0.4)",
          boxShadow: clicked
            ? "0 0 10px rgba(255, 255, 255, 0.3)"
            : "0 0 15px rgba(255, 255, 255, 0.15)",
        };
    }
  };

  return (
    <>
      {typeof window !== "undefined" && (
        <>
          {/* Outer Circle */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-200 border border-solid"
            style={{
              x: springX,
              y: springY,
              width: getCursorStyles().width,
              height: getCursorStyles().height,
              marginLeft: `-${parseInt(getCursorStyles().width || "0") / 2}px`,
              marginTop: `-${parseInt(getCursorStyles().height || "0") / 2}px`,
              ...getCursorStyles(),
              borderRadius: cursorMode === "text" ? "2px" : "50%",
              background:
                cursorMode === "link"
                  ? "rgba(99, 102, 241, 0.05)"
                  : "rgba(99, 102, 241, 2)",
              transition: "all 0.15s ease-out",
            }}
          />
        </>
      )}
    </>
  );
};

export default Cursor;
