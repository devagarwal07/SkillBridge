"use client";
import { useRef, useEffect, useState } from "react";

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: React.CSSProperties;
  animationTo?: React.CSSProperties[];
  easing?: string;
  onAnimationComplete?: () => void;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = "cubic-bezier(0.215, 0.610, 0.355, 1.000)", // easeOutCubic
  onAnimationComplete,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  const ref = useRef<HTMLParagraphElement>(null);

  // Default animations based on direction
  const defaultFrom: React.CSSProperties = {
    filter: "blur(10px)",
    opacity: 0,
    transform: `translate3d(0,${direction === "top" ? "-50px" : "50px"},0)`,
  };

  const defaultTo: React.CSSProperties = {
    filter: "blur(0px)",
    opacity: 1,
    transform: "translate3d(0,0,0)",
  };

  // Track animation completion
  useEffect(() => {
    if (animatedElements.length === elements.length && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [animatedElements, elements.length, onAnimationComplete]);

  // Intersection Observer to detect when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Trigger staggered animations when in view
  useEffect(() => {
    if (inView) {
      elements.forEach((_, index) => {
        const timer = setTimeout(() => {
          setAnimatedElements((prev) => [...prev, index]);
        }, delay * index);

        return () => clearTimeout(timer);
      });
    }
  }, [inView, elements, delay]);

  // Handle animation transition for each element
  const getElementStyle = (index: number): React.CSSProperties => {
    const isAnimating = animatedElements.includes(index);
    const from = animationFrom || defaultFrom;
    const to =
      animationTo && animationTo.length > 0
        ? animationTo[animationTo.length - 1]
        : defaultTo;

    const style: React.CSSProperties = {
      display: "inline-block",
      transition: `all 0.6s ${easing}`,
      transitionDelay: `${delay * index}ms`,
      willChange: "transform, filter, opacity",
      ...(!isAnimating ? from : to),
    };

    return style;
  };

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((element, index) => (
        <span
          key={index}
          style={getElementStyle(index)}
          className="inline-block"
        >
          {element === " " ? "\u00A0" : element}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </span>
      ))}
    </p>
  );
};

export default BlurText;
