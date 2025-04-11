"use client";
import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number; // milliseconds per character
  className?: string;
}

export function TypingAnimation({
  text,
  speed = 20,
  className = "",
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) return;

    // Reset animation when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsDone(false);

    // Start typing animation
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, currentIndex]);

  return (
    <div className={`relative ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: displayedText }} />
      {!isDone && (
        <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse" />
      )}
    </div>
  );
}
