'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Line {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  baseOpacity: number;
  opacity: number;
  thickness: number;
  // For "scanner" lines
  scanner?: boolean;
  scanProgress?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

export const HeroLines = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const linesRef = useRef<Line[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initScene = useCallback((w: number, h: number) => {
    if (w < 2 || h < 2) {
      linesRef.current = [];
      nodesRef.current = [];
      return;
    }

    const lines: Line[] = [];

    // Horizontal drift lines — the "data streams"
    for (let i = 0; i < 14; i++) {
      const angle = (Math.random() - 0.5) * 0.25;
      const length = 120 + Math.random() * 300;
      lines.push({
        x: Math.random() * (w + 200) - 100,
        y: Math.random() * h,
        angle,
        length,
        speed: 0.3 + Math.random() * 0.5,
        baseOpacity: 0.09 + Math.random() * 0.08,
        opacity: 0,
        thickness: Math.random() < 0.3 ? 1 : 0.5,
      });
    }

    // Vertical accent lines
    for (let i = 0; i < 4; i++) {
      lines.push({
        x: Math.random() * w,
        y: Math.random() * h,
        angle: Math.PI / 2 + (Math.random() - 0.5) * 0.08,
        length: 60 + Math.random() * 150,
        speed: 0.1 + Math.random() * 0.15,
        baseOpacity: 0.07 + Math.random() * 0.06,
        opacity: 0,
        thickness: 0.5,
      });
    }

    // Scanner lines — horizontal lines that sweep top-to-bottom
    for (let i = 0; i < 2; i++) {
      lines.push({
        x: 0,
        y: Math.random() * h,
        angle: 0,
        length: w,
        speed: 0.3 + Math.random() * 0.4,
        baseOpacity: 0.055,
        opacity: 0,
        thickness: 0.5,
        scanner: true,
        scanProgress: Math.random(),
      });
    }

    linesRef.current = lines;

    // Floating nodes — small dots that form connections
    const nodes: Node[] = [];
    for (let i = 0; i < 25; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 1 + Math.random() * 1.5,
        baseOpacity: 0.1 + Math.random() * 0.12,
        opacity: 0,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const cssW = parent.offsetWidth;
      const cssH = parent.offsetHeight;
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene(cssW, cssH);
    };

    resize();
    window.addEventListener('resize', resize);
    const parent = canvas.parentElement;
    const ro = parent && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => resize())
      : null;
    if (ro && parent) ro.observe(parent);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX < rect.right &&
        e.clientY >= rect.top && e.clientY < rect.bottom;
      mouseRef.current = inside
        ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
        : { x: -1000, y: -1000 };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const animate = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const w = p.offsetWidth;
      const h = p.offsetHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dpr = window.devicePixelRatio || 1;
      const lineW = Math.max(0.5, 1 / dpr);
      const cursorRadius = 250;
      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const lines = linesRef.current;
      const nodes = nodesRef.current;

      // ── Draw Lines ──
      for (const line of lines) {
        if (line.scanner) {
          // Scanner sweep
          line.scanProgress = ((line.scanProgress || 0) + line.speed * 0.003) % 1;
          const sy = line.scanProgress * h;
          const scanDist = Math.abs(my - sy);
          const cursorPull = scanDist < 120 ? (1 - scanDist / 120) * 0.04 : 0;
          const op = line.baseOpacity + cursorPull;
          ctx.beginPath();
          // Gradient fade at edges
          const grad = ctx.createLinearGradient(0, sy, w, sy);
          grad.addColorStop(0, `rgba(0, 218, 243, 0)`);
          grad.addColorStop(0.15, `rgba(0, 218, 243, ${op})`);
          grad.addColorStop(0.85, `rgba(0, 218, 243, ${op})`);
          grad.addColorStop(1, `rgba(0, 218, 243, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5;
          ctx.moveTo(0, sy);
          ctx.lineTo(w, sy);
          ctx.stroke();
          continue;
        }

        // Drift
        line.x += line.speed * 0.5;
        line.y += line.speed * 0.08;

        const x1 = line.x;
        const y1 = line.y;
        const x2 = line.x + Math.cos(line.angle) * line.length;
        const y2 = line.y + Math.sin(line.angle) * line.length;

        // Wrap
        if (x1 > w + 200) {
          line.x = -line.length - 80;
          line.y = Math.random() * h;
        }
        if (y1 > h + 80) {
          line.y = -40;
        }

        // Cursor interaction
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = mx - midX;
        const dy = my - midY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let offX = 0, offY = 0, opBoost = 0;
        if (dist < cursorRadius) {
          const t = 1 - dist / cursorRadius;
          const ease = t * t * t; // Cubic ease
          offX = dx * ease * 0.12;
          offY = dy * ease * 0.12;
          opBoost = ease * 0.14;
        }

        line.opacity += (line.baseOpacity + opBoost - line.opacity) * 0.06;

        // Gradient along line for "energy beam" feel
        const grad = ctx.createLinearGradient(x1 + offX, y1 + offY, x2 + offX, y2 + offY);
        grad.addColorStop(0, `rgba(0, 218, 243, 0)`);
        grad.addColorStop(0.2, `rgba(0, 218, 243, ${line.opacity})`);
        grad.addColorStop(0.8, `rgba(0, 218, 243, ${line.opacity})`);
        grad.addColorStop(1, `rgba(0, 218, 243, 0)`);

        ctx.beginPath();
        ctx.moveTo(x1 + offX, y1 + offY);
        ctx.lineTo(x2 + offX, y2 + offY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.thickness;
        ctx.stroke();

        // Bright tip dot traveling along the line
        const travelT = ((time * line.speed * 0.4) % 1);
        const tipX = x1 + (x2 - x1) * travelT + offX;
        const tipY = y1 + (y2 - y1) * travelT + offY;
        if (line.opacity > 0.03) {
          ctx.beginPath();
          ctx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 218, 243, ${line.opacity * 2.5})`;
          ctx.fill();
        }
      }

      // ── Draw Nodes ──
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        // Wrap
        if (node.x < -20) node.x = w + 10;
        if (node.x > w + 20) node.x = -10;
        if (node.y < -20) node.y = h + 10;
        if (node.y > h + 20) node.y = -10;

        // Cursor attraction
        const dx = mx - node.x;
        const dy = my - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cursorRadius) {
          const t = 1 - dist / cursorRadius;
          node.vx += dx * t * 0.0004;
          node.vy += dy * t * 0.0004;
        }

        // Damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        const pulseFactor = 0.5 + 0.5 * Math.sin(node.pulse);
        const cursorBoost = dist < cursorRadius ? (1 - dist / cursorRadius) * 0.15 : 0;
        node.opacity += (node.baseOpacity * pulseFactor + cursorBoost - node.opacity) * 0.08;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 218, 243, ${node.opacity})`;
        ctx.fill();
      }

      // ── Node connections (close nodes form constellation lines) ──
      const connDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ddx = nodes[i].x - nodes[j].x;
          const ddy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < connDist) {
            const op = (1 - d / connDist) * Math.min(nodes[i].opacity, nodes[j].opacity) * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 218, 243, ${op})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      // ── Cursor-to-node connections ──
      if (mx > 0 && my > 0 && mx < w && my < h) {
        for (const node of nodes) {
          const ddx = mx - node.x;
          const ddy = my - node.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 180) {
            const op = (1 - d / 180) * 0.12;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(0, 218, 243, ${op})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        // HUD crosshair at cursor
        const chSize = 20;
        const chGap = 6;
        const chOp = 0.11;
        ctx.strokeStyle = `rgba(0, 218, 243, ${chOp})`;
        ctx.lineWidth = lineW;
        // Top
        ctx.beginPath(); ctx.moveTo(mx, my - chSize); ctx.lineTo(mx, my - chGap); ctx.stroke();
        // Bottom
        ctx.beginPath(); ctx.moveTo(mx, my + chGap); ctx.lineTo(mx, my + chSize); ctx.stroke();
        // Left
        ctx.beginPath(); ctx.moveTo(mx - chSize, my); ctx.lineTo(mx - chGap, my); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(mx + chGap, my); ctx.lineTo(mx + chSize, my); ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(mx, my, 28, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 218, 243, 0.04)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Rotating arc segments
        const arcOp = 0.06;
        for (let i = 0; i < 3; i++) {
          const startAngle = time * 0.8 + (i * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(mx, my, 35, startAngle, startAngle + 0.5);
          ctx.strokeStyle = `rgba(0, 218, 243, ${arcOp})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
