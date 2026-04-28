import { useRef, useEffect } from "react";

const STROKE_COLOR = "rgba(255, 255, 255, 0.16)";
const STROKE_WIDTH = 0.8;

export default function CrtBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ];
    const vertices = rawVerts.map((v) => {
      const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      return [v[0] / len, v[1] / len, v[2] / len];
    });

    const edges = [
      [0, 1],
      [0, 5],
      [0, 7],
      [0, 10],
      [0, 11],
      [1, 5],
      [1, 7],
      [1, 8],
      [1, 9],
      [2, 3],
      [2, 4],
      [2, 6],
      [2, 10],
      [2, 11],
      [3, 4],
      [3, 6],
      [3, 8],
      [3, 9],
      [4, 5],
      [4, 9],
      [4, 11],
      [5, 9],
      [5, 11],
      [6, 7],
      [6, 8],
      [6, 10],
      [7, 8],
      [7, 10],
      [8, 9],
      [10, 11],
    ];

    const draw = (t: number) => {
      const w = canvas.width / dpr,
        h = canvas.height / dpr;
      const cx = w / 2,
        cy = h / 2;
      const s = Math.min(w, h) * 3.5;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = STROKE_WIDTH;

      const ay = t * 0.0000375;
      const ax = t * 0.000025;
      const az = t * 0.00002;

      const project = (v: number[]) => {
        const [x, y, z] = v;
        const x2 = x * Math.cos(ay) - z * Math.sin(ay);
        const z2 = x * Math.sin(ay) + z * Math.cos(ay);
        const y2 = y * Math.cos(ax) - z2 * Math.sin(ax);
        const z3 = y * Math.sin(ax) + z2 * Math.cos(ax);
        const x3 = x2 * Math.cos(az) - y2 * Math.sin(az);
        const y3 = x2 * Math.sin(az) + y2 * Math.cos(az);
        const scale = 2 / (3.5 + z3 * 0.3);
        return [cx + x3 * s * scale, cy + y3 * s * scale];
      };

      for (const [a, b] of edges) {
        const [x1, y1] = project(vertices[a]);
        const [x2, y2] = project(vertices[b]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed top-0 right-0 bottom-0 z-10 hidden xl:block"
      style={{ left: "var(--container-max)" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
