"use client";

import React, { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
}

interface PulsePacket {
  startIdx: number;
  endIdx: number;
  progress: number;
  speed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    const nodeCount = Math.min(Math.floor((width * height) / 36000), 36);
    const nodes: NodePoint[] = [];

    const colors = [
      "rgba(41, 151, 255, 0.45)",
      "rgba(134, 134, 139, 0.35)",
      "rgba(175, 175, 175, 0.25)",
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const packets: PulsePacket[] = [];
    let packetTimer = 0;
    let time = 0;

    const render = () => {
      time += 0.016;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cursorGlow = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        300
      );
      cursorGlow.addColorStop(0, "rgba(41, 151, 255, 0.05)");
      cursorGlow.addColorStop(1, "transparent");
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180 && mdist > 20) {
          const force = (1 - mdist / 180) * 0.3;
          node.x -= (mdx / mdist) * force;
          node.y -= (mdy / mdist) * force;
        }

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        const currentPulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 1.0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * currentPulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.16;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(134, 134, 139, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      packetTimer += 1;
      if (packetTimer % 50 === 0 && nodes.length > 5) {
        const start = Math.floor(Math.random() * nodes.length);
        let nearest = -1;
        let minDist = 140;
        for (let k = 0; k < nodes.length; k++) {
          if (k === start) continue;
          const d = Math.hypot(nodes[k].x - nodes[start].x, nodes[k].y - nodes[start].y);
          if (d < minDist) {
            minDist = d;
            nearest = k;
          }
        }
        if (nearest !== -1) {
          packets.push({
            startIdx: start,
            endIdx: nearest,
            progress: 0,
            speed: 0.02 + Math.random() * 0.015,
          });
        }
      }

      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }
        const n1 = nodes[pkt.startIdx];
        const n2 = nodes[pkt.endIdx];
        if (!n1 || !n2) continue;

        const px = n1.x + (n2.x - n1.x) * pkt.progress;
        const py = n1.y + (n2.y - n1.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = "#2997FF";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      aria-hidden="true"
    />
  );
}
