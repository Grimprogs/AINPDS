import React, { useEffect, useRef } from 'react';

interface VeoBackgroundCanvasProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  opacity?: number; // 0.1 to 0.8
  blurPx?: number; // 0 to 10
  enabled?: boolean;
}

export const VeoBackgroundCanvas: React.FC<VeoBackgroundCanvasProps> = ({
  videoUrl,
  imageUrl,
  opacity = 0.25,
  blurPx = 0,
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // If there is a real video URL, play it
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn('Auto-play blocked or waiting for user interaction:', err);
      });
    }
  }, [videoUrl]);

  // Ambient Canvas Animation when no video or as generative cyber layer
  useEffect(() => {
    if (!enabled || videoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cyber particle nodes
    const nodeCount = Math.min(45, Math.floor(width / 35));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = ['#38bdf8', '#34d399', '#818cf8', '#22d3ee'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI
      });
    }

    // Packet burst lines
    const packetRays: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
    }> = [];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 64;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & render nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.02;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      // Periodic packet travel bursts
      if (frame % 35 === 0 && nodes.length > 2) {
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
        const toNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (fromNode !== toNode) {
          packetRays.push({
            x: fromNode.x,
            y: fromNode.y,
            targetX: toNode.x,
            targetY: toNode.y,
            progress: 0,
            speed: 0.04 + Math.random() * 0.03
          });
        }
      }

      // Render packet rays
      for (let p = packetRays.length - 1; p >= 0; p--) {
        const pkt = packetRays[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packetRays.splice(p, 1);
          continue;
        }

        const currX = pkt.x + (pkt.targetX - pkt.x) * pkt.progress;
        const currY = pkt.y + (pkt.targetY - pkt.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, videoUrl]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
      style={{
        opacity,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined
      }}
      aria-hidden="true"
    >
      {/* 1. Real Video Player when Veo Video URL is present */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : imageUrl ? (
        /* 2. Suitable Preset or Uploaded Image Background */
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000 scale-105 animate-pulse"
          style={{
            backgroundImage: `url(${imageUrl})`,
            animationDuration: '16s'
          }}
        />
      ) : (
        /* 3. Ambient Generative Cyber Defense Canvas */
        <canvas ref={canvasRef} className="w-full h-full block" />
      )}

      {/* Dark Ambient Vignette & Gradient Overlays for pristine UI legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
    </div>
  );
};
