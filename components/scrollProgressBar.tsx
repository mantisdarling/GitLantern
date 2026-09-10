"use client";

import React, { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-[#f05032] z-50 transition-all duration-75 ease-out pointer-events-none"
      style={{ width: `${scrollProgress}%` }}
      aria-hidden="true"
    />
  );
}
