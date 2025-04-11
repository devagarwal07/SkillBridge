import React from "react";

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute inset-0 -z-10 parallax-bg"
        style={{ height: "150%" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(45, 212, 191, 0.05) 50%, transparent 80%)",
            height: "150%",
            width: "100%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(14,165,233,0.15) 0, rgba(0,0,0,0) 80%)",
            height: "150%",
            width: "100%",
          }}
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-200">
          Loading application form...
        </p>
      </div>
    </div>
  );
}
