import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import "../styles/globals.css";
import NoiseBackground from "../components/effects/NoiseBackground";
import Cursor from "../components/effects/Cursor";
import LoadingScreen from "../components/ui/LoadingScreen";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <>
      <Head>
        <title>SkillBridge - AI-Powered Career Navigator</title>
        <meta
          name="description"
          content="AI-powered career navigation platform with blockchain-backed credentials"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
        <NoiseBackground />
        <Cursor />
        <LoadingScreen />
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </div>
    </>
  );
}
