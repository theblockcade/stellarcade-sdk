"use client";

import { useEffect, useRef } from "react";

/** Animated film-grain canvas, redrawn every `refreshInterval` frames. */
function Noise({
  refreshInterval = 2,
  alpha = 18,
}: {
  refreshInterval?: number;
  alpha?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const size = 1024;

    const resize = () => {
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = alpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % refreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [refreshInterval, alpha]);

  return <canvas ref={canvasRef} className="noise-bg-canvas" />;
}

/** Fixed, full-viewport background: dark base, cyan spotlight, grid, film grain. */
export default function NoiseBackground() {
  return (
    <div className="noise-bg">
      <div className="noise-bg-spotlight" />
      <div className="noise-bg-grid" />
      <Noise refreshInterval={2} alpha={18} />
    </div>
  );
}
