import React, { useEffect, useRef } from 'react';

export type GeometryMode = 'polyhedron' | 'lattice' | 'orbital';

interface SpatialCanvasProps {
  mode?: GeometryMode;
  interactive?: boolean;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  mode = 'polyhedron',
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      pointerRef.current.targetX = normX;
      pointerRef.current.targetY = normY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const vertices: Point3D[] = [];
    const edges: [number, number][] = [];
    const facets: [number, number, number][] = [];

    if (mode === 'polyhedron') {
      const phi = (1 + Math.sqrt(5)) / 2;
      const raw: [number, number, number][] = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
      ];
      raw.forEach(([x, y, z]) => {
        const len = Math.sqrt(x * x + y * y + z * z);
        vertices.push({ x: (x / len) * 188, y: (y / len) * 188, z: (z / len) * 188 });
      });
      raw.forEach(([x, y, z]) => {
        const len = Math.sqrt(x * x + y * y + z * z);
        vertices.push({ x: (x / len) * 94, y: (y / len) * 94, z: (z / len) * 94 });
      });

      for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 12; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const dz = vertices[i].z - vertices[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 215) {
            edges.push([i, j]);
          }
        }
        edges.push([i, i + 12]);
      }

      facets.push([0, 1, 5], [0, 5, 11], [1, 5, 9], [5, 9, 4], [4, 5, 11]);

      for (let i = 12; i < 24; i++) {
        for (let j = i + 1; j < 24; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const dz = vertices[i].z - vertices[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 110) {
            edges.push([i, j]);
          }
        }
      }
    } else if (mode === 'lattice') {
      const step = 92;
      const coords = [-step, 0, step];
      coords.forEach((x) => {
        coords.forEach((y) => {
          coords.forEach((z) => {
            vertices.push({ x, y, z });
          });
        });
      });
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dx = vertices[i].x - vertices[j].x;
          const dy = vertices[i].y - vertices[j].y;
          const dz = vertices[i].z - vertices[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (Math.abs(dist - step) < 5) {
            edges.push([i, j]);
          }
        }
      }
    } else {
      const rings = 3;
      const ptsPerRing = 16;
      const radius = 184;
      for (let r = 0; r < rings; r++) {
        const tilt = (r * Math.PI) / 3;
        for (let p = 0; p < ptsPerRing; p++) {
          const theta = (p / ptsPerRing) * Math.PI * 2;
          const x0 = Math.cos(theta) * radius;
          const y0 = Math.sin(theta) * radius * Math.cos(tilt);
          const z0 = Math.sin(theta) * radius * Math.sin(tilt);
          vertices.push({ x: x0, y: y0, z: z0 });
          const currIdx = r * ptsPerRing + p;
          const nextIdx = r * ptsPerRing + ((p + 1) % ptsPerRing);
          edges.push([currIdx, nextIdx]);
        }
      }
    }

    const ambientNodes: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < 24; i++) {
      ambientNodes.push({
        x: (Math.sin(i * 12.9898) - 0.5) * 900,
        y: (Math.cos(i * 78.233) - 0.5) * 520,
        z: ((i % 7) - 3) * 80,
        size: i % 3 === 0 ? 1.9 : 1.15,
      });
    }

    let angleY = 0.35;
    let angleX = 0.22;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.04;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.04;

      angleY += 0.0018;
      angleX += 0.0007;

      const rotY = angleY + pointerRef.current.x * 0.32;
      const rotX = angleX + pointerRef.current.y * 0.22;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width > 900 ? width * 0.35 : width * 0.5;
      const centerY = height * 0.48;
      const fov = 560;

      const project = (pt: Point3D) => {
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.z * cosY + pt.x * sinY;
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.y * sinX;

        const scale = fov / (fov + z2 + 260);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          z: z2,
          scale,
        };
      };

      // Subtle floating champagne gold coordinate dots (#B39458 -> rgb(179, 148, 88))
      ambientNodes.forEach((p, idx) => {
        const driftY = p.y + Math.sin(angleY * 2 + idx) * 9;
        const proj = project({ x: p.x, y: driftY, z: p.z });
        const alpha = Math.max(0.08, Math.min(0.26, (proj.scale - 0.45) * 0.45));
        ctx.fillStyle = `rgba(179, 148, 88, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      const projectedVertices = vertices.map(project);

      // Soft Gold (#E8D9B9 -> rgb(232, 217, 185)) translucent facets
      facets.forEach(([a, b, c]) => {
        const p1 = projectedVertices[a];
        const p2 = projectedVertices[b];
        const p3 = projectedVertices[c];
        if (!p1 || !p2 || !p3) return;
        ctx.fillStyle = 'rgba(232, 217, 185, 0.14)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
      });

      // Delicate Champagne Gold (#B39458) 3D wireframe edges
      edges.forEach(([i, j]) => {
        const p1 = projectedVertices[i];
        const p2 = projectedVertices[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) * 0.5;
        const depthNorm = Math.max(0.1, Math.min(0.32, (220 - avgZ) / 560));
        ctx.strokeStyle = `rgba(179, 148, 88, ${depthNorm.toFixed(3)})`;
        ctx.lineWidth = Math.max(0.65, ((p1.scale + p2.scale) * 0.5) * 1.1);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Charcoal (#252525) & Champagne Gold (#B39458) vertices
      projectedVertices.forEach((p, idx) => {
        const depthAlpha = Math.max(0.2, Math.min(0.6, (220 - p.z) / 440));
        ctx.fillStyle =
          idx < 12
            ? `rgba(37, 37, 37, ${depthAlpha.toFixed(3)})`
            : `rgba(179, 148, 88, ${depthAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.5, 2.5 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [mode, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none w-full h-full ${className}`}
    />
  );
};
