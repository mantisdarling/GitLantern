"use client";

import React, { useEffect, useRef } from "react";

export function ArchitecturalSculpture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // Cap DPR at 1.5 for smooth 60fps performance on low-end devices and mobile
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!width || !height) return;
      targetPointerX = (e.clientX / width - 0.5) * 2;
      targetPointerY = (e.clientY / height - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!width || !height || !e.touches[0]) return;
      targetPointerX = (e.touches[0].clientX / width - 0.5) * 2;
      targetPointerY = (e.touches[0].clientY / height - 0.5) * 2;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const draw = () => {
      animationFrameId = window.requestAnimationFrame(draw);
      if (!isVisible || document.hidden || width === 0 || height === 0) return;

