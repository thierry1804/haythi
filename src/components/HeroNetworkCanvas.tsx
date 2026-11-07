import { useCallback, useEffect, useRef } from 'react';

type Beam = {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  baseOpacity: number;
  opacity: number;
  thickness: number;
  scanner?: boolean;
  scanProgress?: number;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
};

export default function HeroNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const beamsRef = useRef<Beam[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  const seed = useCallback((w: number, h: number) => {
    if (w < 2 || h < 2) {
      beamsRef.current = [];
      nodesRef.current = [];
      return;
    }

    const beams: Beam[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = (Math.random() - 0.5) * 0.25;
      const length = 120 + 300 * Math.random();
      beams.push({
        x: Math.random() * (w + 200) - 100,
        y: Math.random() * h,
        angle,
        length,
        speed: 0.3 + 0.4 * Math.random(),
        baseOpacity: 0.04 + 0.05 * Math.random(),
        opacity: 0,
        thickness: 0.4 + 0.6 * Math.random(),
      });
    }

    for (let i = 0; i < 3; i++) {
      beams.push({
        x: 0,
        y: Math.random() * h,
        angle: 0,
        length: w,
        speed: 0.3 + 0.4 * Math.random(),
        baseOpacity: 0.055,
        opacity: 0,
        thickness: 0.5,
        scanner: true,
        scanProgress: Math.random(),
      });
    }
    beamsRef.current = beams;

    const nodes: Node[] = [];
    for (let i = 0; i < 25; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 1 + 1.5 * Math.random(),
        baseOpacity: 0.1 + 0.12 * Math.random(),
        opacity: 0,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + 0.03 * Math.random(),
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    resize();
    window.addEventListener('resize', resize);
    const parent = canvas.parentElement;
    const ro =
      parent && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => resize())
        : null;
    if (ro && parent) ro.observe(parent);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX < rect.right &&
        e.clientY >= rect.top &&
        e.clientY < rect.bottom;
      mouseRef.current = inside
        ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
        : { x: -1000, y: -1000 };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dpr = window.devicePixelRatio || 1;

      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const beams = beamsRef.current;
      const nodes = nodesRef.current;

      for (const beam of beams) {
        if (beam.scanner) {
          beam.scanProgress = ((beam.scanProgress || 0) + 0.003 * beam.speed) % 1;
          const y = beam.scanProgress * h;
          const dist = Math.abs(my - y);
          const boost = dist < 120 ? (1 - dist / 120) * 0.04 : 0;
          const opacity = beam.baseOpacity + boost;
          const grad = ctx.createLinearGradient(0, y, w, y);
          grad.addColorStop(0, 'rgba(0, 218, 243, 0)');
          grad.addColorStop(0.15, `rgba(0, 218, 243, ${opacity})`);
          grad.addColorStop(0.85, `rgba(0, 218, 243, ${opacity})`);
          grad.addColorStop(1, 'rgba(0, 218, 243, 0)');
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
          continue;
        }

        beam.x += 0.5 * beam.speed;
        beam.y += 0.08 * beam.speed;
        let x1 = beam.x;
        let y1 = beam.y;
        let x2 = beam.x + Math.cos(beam.angle) * beam.length;
        let y2 = beam.y + Math.sin(beam.angle) * beam.length;

        if (x1 > w + 200) {
          beam.x = -beam.length - 80;
          beam.y = Math.random() * h;
          x1 = beam.x;
          y1 = beam.y;
          x2 = beam.x + Math.cos(beam.angle) * beam.length;
          y2 = beam.y + Math.sin(beam.angle) * beam.length;
        }
        if (y1 > h + 80) beam.y = -40;

        const dx = mx - (x1 + x2) / 2;
        const dy = my - (y1 + y2) / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let ox = 0;
        let oy = 0;
        let opacityBoost = 0;
        if (dist < 250) {
          const f = 1 - dist / 250;
          const t3 = f * f * f;
          ox = dx * t3 * 0.12;
          oy = dy * t3 * 0.12;
          opacityBoost = 0.14 * t3;
        }

        beam.opacity += (beam.baseOpacity + opacityBoost - beam.opacity) * 0.06;
        const grad = ctx.createLinearGradient(x1 + ox, y1 + oy, x2 + ox, y2 + oy);
        grad.addColorStop(0, 'rgba(0, 218, 243, 0)');
        grad.addColorStop(0.2, `rgba(0, 218, 243, ${beam.opacity})`);
        grad.addColorStop(0.8, `rgba(0, 218, 243, ${beam.opacity})`);
        grad.addColorStop(1, 'rgba(0, 218, 243, 0)');
        ctx.beginPath();
        ctx.moveTo(x1 + ox, y1 + oy);
        ctx.lineTo(x2 + ox, y2 + oy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.thickness;
        ctx.stroke();

        const pulse = ((t * beam.speed * 0.4) % 1);
        const px = x1 + (x2 - x1) * pulse + ox;
        const py = y1 + (y2 - y1) * pulse + oy;
        if (beam.opacity > 0.03) {
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 218, 243, ${2.5 * beam.opacity})`;
          ctx.fill();
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;
        if (node.x < -20) node.x = w + 10;
        if (node.x > w + 20) node.x = -10;
        if (node.y < -20) node.y = h + 10;
        if (node.y > h + 20) node.y = -10;

        const dx = mx - node.x;
        const dy = my - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const f = 1 - dist / 250;
          node.vx += dx * f * 0.0004;
          node.vy += dy * f * 0.0004;
        }
        node.vx *= 0.995;
        node.vy *= 0.995;

        const pulse = 0.5 + 0.5 * Math.sin(node.pulse);
        const near = dist < 250 ? (1 - dist / 250) * 0.15 : 0;
        node.opacity += (node.baseOpacity * pulse + near - node.opacity) * 0.08;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 218, 243, ${node.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const a = (1 - dist / 140) * Math.min(nodes[i].opacity, nodes[j].opacity) * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 218, 243, ${a})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      if (mx > 0 && my > 0 && mx < w && my < h) {
        for (const node of nodes) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const a = (1 - dist / 180) * 0.12;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(0, 218, 243, ${a})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        ctx.strokeStyle = 'rgba(0, 218, 243, 0.11)';
        ctx.lineWidth = Math.max(0.5, 1 / dpr);
        ctx.beginPath();
        ctx.moveTo(mx, my - 20);
        ctx.lineTo(mx, my - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, my + 6);
        ctx.lineTo(mx, my + 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx - 20, my);
        ctx.lineTo(mx - 6, my);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx + 6, my);
        ctx.lineTo(mx + 20, my);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mx, my, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 218, 243, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
          const start = 0.8 * t + (i * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(mx, my, 35, start, start + 0.5);
          ctx.strokeStyle = 'rgba(0, 218, 243, 0.06)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    if (prefersReduced) {
      draw();
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
