"use client";
import { useRef, useEffect, useState } from "react";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  onAnimationComplete?: () => void;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  duration = 800,
  onAnimationComplete,
}) => {
  const [inView, setInView] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Handle animation completion
  useEffect(() => {
    if (inView && !animationComplete) {
      const totalAnimationTime = elements.length * delay + duration;

      const timer = setTimeout(() => {
        setAnimationComplete(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [
    inView,
    animationComplete,
    elements.length,
    delay,
    duration,
    onAnimationComplete,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {text ? (
        elements.map((element, index) => (
          <span
            key={index}
            className={`blur-text-element ${inView ? "animate-in" : ""}`}
            style={{
              display: "inline-block",
              transitionProperty: "opacity, filter, transform",
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
              transitionDelay: `${index * delay}ms`,
              opacity: inView ? 1 : 0,
              filter: inView ? "blur(0px)" : "blur(10px)",
              transform: inView
                ? "translate3d(0, 0, 0)"
                : `translate3d(0, ${
                    direction === "top" ? "-50px" : "50px"
                  }, 0)`,
            }}
          >
            {element === " " ? "\u00A0" : element}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </span>
        ))
      ) : (
        <span className={className}></span>
      )}

      <style jsx global>{`
        @keyframes blur-text-fade-in {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: translate3d(
              0,
              ${direction === "top" ? "-50px" : "50px"},
              0
            );
          }
          50% {
            opacity: 0.5;
            filter: blur(5px);
            transform: translate3d(
              0,
              ${direction === "top" ? "5px" : "-5px"},
              0
            );
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlurText;
