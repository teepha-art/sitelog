'use client';

import { useEffect, useRef } from 'react';

const SPACING = 14;
const DOT_RADIUS = 1;
const INFLUENCE = 70;
const MAX_PUSH = 45;
const SMOOTH = 0.3;
const IDLE_MS = 80;
const OPEN_RATE = 0.2;
const CLOSE_RATE = 0.04;

type Dot = {
  bx: number; by: number;
  cx: number; cy: number;
};

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(0);
  const intensity = useRef(0);
  const lastMoveTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = mq.matches;
    const rawColor = getComputedStyle(document.documentElement).getPropertyValue('--color-outline').trim() || 'hsl(215, 20%, 49%)';
    const handleMQ = (e: MediaQueryListEvent) => { reduceMotion = e.matches; };
    mq.addEventListener('change', handleMQ);

    const isMobile = 'ontouchstart' in window;
    let w = 0, h = 0;

    function resize() {
      const parent = canvas!.parentElement!;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width; h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / SPACING);
      const rows = Math.floor(h / SPACING);
      const ox = (w - cols * SPACING) / 2 + SPACING / 2;
      const oy = (h - rows * SPACING) / 2 + SPACING / 2;
      const arr: Dot[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * SPACING;
          const y = oy + r * SPACING;
          arr.push({ bx: x, by: y, cx: x, cy: y });
        }
      }
      dotsRef.current = arr;
    }

    resize();
    window.addEventListener('resize', resize);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      lastMoveTime.current = performance.now();
    }
    function onLeave() {
      mouse.current = { x: -9999, y: -9999 };
      intensity.current = 0;
    }

    if (!isMobile) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
    }

    let last = performance.now();

    function draw(now: number) {
      raf.current = requestAnimationFrame(draw);
      const dt = Math.min(now - last, 50);
      last = now;

      ctx!.clearRect(0, 0, w, h);

      const isStatic = reduceMotion || isMobile;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      const idleMs = now - lastMoveTime.current;
      const isIdle = idleMs > IDLE_MS || mx < -9000;
      const targetIntensity = isIdle ? 0 : 1;
      const rate = isIdle ? CLOSE_RATE : OPEN_RATE;
      intensity.current += (targetIntensity - intensity.current) * rate;
      const str = intensity.current;

      for (const dot of dotsRef.current) {
        if (isStatic) {
          ctx!.globalAlpha = 0.75;
          ctx!.fillStyle = rawColor;
          ctx!.beginPath();
          ctx!.arc(dot.bx, dot.by, DOT_RADIUS, 0, Math.PI * 2);
          ctx!.fill();
          continue;
        }

        const dx = dot.bx - mx;
        const dy = dot.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE) {
          const t = 1 - dist / INFLUENCE;
          const push = t * MAX_PUSH * str;
          const angle = Math.atan2(dy, dx);
          const tx = dot.bx + Math.cos(angle) * push;
          const ty = dot.by + Math.sin(angle) * push;
          dot.cx += (tx - dot.cx) * SMOOTH;
          dot.cy += (ty - dot.cy) * SMOOTH;

          ctx!.globalAlpha = 0.75 * (1 - t * 0.9 * str);
          ctx!.fillStyle = rawColor;
          ctx!.beginPath();
          ctx!.arc(dot.cx, dot.cy, DOT_RADIUS, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          dot.cx += (dot.bx - dot.cx) * SMOOTH;
          dot.cy += (dot.by - dot.cy) * SMOOTH;
          ctx!.globalAlpha = 0.75;
          ctx!.fillStyle = rawColor;
          ctx!.beginPath();
          ctx!.arc(dot.cx, dot.cy, DOT_RADIUS, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1.0;
    }

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      mq.removeEventListener('change', handleMQ);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
