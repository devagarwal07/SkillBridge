"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Current user data
const currentDateTime = "2025-03-03 19:13:52";
const currentUser = "vkhare2909";

type SparkleButtonProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

export default function SparkleButton({
  children,
  href,
  className = "",
}: SparkleButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (isHovered && buttonRef.current) {
      buttonRef.current.addEventListener("mousemove", updateMousePosition);
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener("mousemove", updateMousePosition);
      }
    };
  }, [isHovered]);

  return (
    <div
      ref={buttonRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        className={`relative z-10 block overflow-hidden ${className}`}
        data-user={currentUser}
        data-timestamp={currentDateTime}
      >
        {children}
      </Link>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 top-0 z-0 pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-[150px] h-[150px] opacity-70">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #4f46e5, #7e22ce, #ec4899, #4f46e5)",
                animation: "spin 4s linear infinite",
              }}
            ></div>
            <div className="absolute inset-[3px] rounded-full bg-gray-900"></div>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
