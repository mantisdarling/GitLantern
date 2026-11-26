"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface CyberConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const confettiColors = ["#2997FF", "#30d158", "#afafaf", "#ffd60a", "#ffffff"];

export function CyberConfetti({ trigger, onComplete }: CyberConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Create 60 particles scattered across the viewport
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: w * (0.2 + Math.random() * 0.6),
      y: h * (0.2 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 3,
      life: 1.0,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 4 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      let alive = false;
      for (const p of particlesRef.current) {
        if (p.life <= 0) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.life -= 0.018;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (alive) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, w, h);
        onComplete?.();
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[80]"
      aria-hidden="true"
    />
  );
}
