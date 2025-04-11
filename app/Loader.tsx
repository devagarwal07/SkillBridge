"use client";
import BlurText from "./BlurText";
import { useEffect, useState } from "react";
function Loader() {
  // const [loading, setLoading] = useState(true); // unused variable
  const [, setLoading] = useState(true);

  useEffect(() => {
    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <div className="text-center">
        <BlurText
          text="Loading Your Future"
          className="text-4xl font-bold text-white mb-4"
          animateBy="letters"
          delay={40}
          duration={600}
        />
        <BlurText
          text="AI-Powered Career Navigation Platform"
          className="text-sm text-gray-400"
          animateBy="words"
          delay={80}
          direction="bottom"
        />
      </div>
    </div>
  );
}
export default Loader;
