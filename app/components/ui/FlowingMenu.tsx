"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  // Initialize marquee animation
  useEffect(() => {
    if (!marqueeContentRef.current) return;

    // Set up continuous animation for the marquee
    gsap.to(marqueeContentRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
      repeatRefresh: false,
    });
  }, [marqueeContentRef]);

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }).to(
      marqueeInnerRef.current,
      { y: edge === "top" ? "101%" : "-101%" }
    );
  };

  const repeatedMarqueeContent = React.useMemo(() => {
    // Create more repetitions for smoother looping
    const contents = [];
    for (let i = 0; i < 8; i++) {
      contents.push(
        <React.Fragment key={i}>
          <span className="text-[#060606] uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">
            {text}
          </span>
          <div
            className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </React.Fragment>
      );
    }
    return contents;
  }, [text, image]);

  return (
    <div
      className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]"
      ref={itemRef}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] hover:text-[#060606] focus:text-white focus-visible:text-[#060606]"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%]"
        ref={marqueeRef}
      >
        <div className="h-full w-[200%] flex" ref={marqueeInnerRef}>
          <div
            ref={marqueeContentRef}
            className="flex items-center relative h-full w-[200%] will-change-transform"
          >
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add current user and date info as a hidden comment
// Current User: vkhare2909
// Last Updated: 2025-03-09 12:50:36

export default FlowingMenu;
