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

      time += 0.014;
      pointerX += (targetPointerX - pointerX) * 0.05;
      pointerY += (targetPointerY - pointerY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 640;
      const finCount = isMobile ? 28 : 40;
      const baseW = isMobile ? Math.min(width * 0.58, 220) : Math.min(width * 0.26, 340);
      const baseH = isMobile ? 16 : 22;
      const centerX = width * 0.44;
      const startY = -height * 0.06;
      const totalH = height * 1.12;
      const stepY = totalH / finCount;

      for (let i = 0; i < finCount; i++) {
        const t = i / finCount;
        const wave = Math.sin(t * Math.PI * 2.1 - time) * (isMobile ? 55 : 115);
        const depth = Math.cos(t * Math.PI * 2.1 - time);
        const offsetX = wave + pointerX * (24 * (0.4 + t * 0.6));
        const offsetY = pointerY * 12;

        const finW = baseW * (0.82 + 0.28 * (0.5 + 0.5 * depth));
        const finH = baseH * (0.85 + 0.25 * (0.5 + 0.5 * depth));
        const angle =
          Math.cos(t * Math.PI * 2.1 - time) * 0.34 + pointerX * 0.08;

        const x = centerX + offsetX;
        const y = startY + i * stepY + offsetY;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Soft architectural shadow beneath each white plate
        ctx.shadowColor = "rgba(0, 0, 0, 0.14)";
        ctx.shadowBlur = isMobile ? 10 : 16;
        ctx.shadowOffsetX = -4;
        ctx.shadowOffsetY = 8;

        // Crisp flat white plate with subtle warm-gray edge shading
        const shade = Math.round(244 + depth * 11);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;

        const rx = -finW / 2;
        const ry = -finH / 2;
        const r = 4;

        ctx.beginPath();
        ctx.roundRect(rx, ry, finW, finH, r);
        ctx.fill();

        // Crisp architectural rim line
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "rgba(210, 210, 215, 0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    };

    animationFrameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
}
