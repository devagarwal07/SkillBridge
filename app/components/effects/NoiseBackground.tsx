"use client";
import { useEffect, useRef, useState } from "react";

type NoiseBackgroundProps = {
  opacity?: number;
  speed?: number;
  debug?: boolean;
};

const NoiseBackground = ({
  opacity = 0.15,
  speed = 100,
  debug = false,
}: NoiseBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Current user data
  const currentDateTime = "2025-03-03 19:16:57";
  const currentUser = "vkhare2909";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Create off-screen canvas for the noise
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    let imgData = offscreenCtx.createImageData(
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    let data = imgData.data;

    // Function to generate noise
    const generateNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        const randColor = Math.floor(Math.random() * 40);
        data[i] = randColor; // red
        data[i + 1] = randColor; // green
        data[i + 2] = randColor; // blue
        data[i + 3] = Math.random() < 0.2 ? 15 : 0; // alpha (opacity)
      }

      offscreenCtx.putImageData(imgData, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Add debug info if enabled
      if (debug) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, 10, 250, 90);

        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(79, 70, 229, 1)"; // Indigo color
        ctx.fillText(`User: ${currentUser}`, 20, 30);
        ctx.fillText(`Time: ${currentDateTime}`, 20, 50);
        ctx.fillText(`Canvas: ${canvas.width}x${canvas.height}px`, 20, 70);
        ctx.fillText(
          `Noise particles: ~${Math.floor(data.length / 16)}`,
          20,
          90
        );
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      imgData = offscreenCtx.createImageData(
        offscreenCanvas.width,
        offscreenCanvas.height
      );
      data = imgData.data;

      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    const interval = setInterval(generateNoise, speed);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [debug, speed, currentDateTime, currentUser]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ opacity, zIndex: 0 }}
        aria-hidden="true"
      />

      {/* User hidden metadata */}
      <div className="sr-only">
        Noise background rendered for {currentUser} at {currentDateTime}
        Canvas dimensions: {dimensions.width}x{dimensions.height}px
      </div>
    </>
  );
};

export default NoiseBackground;
