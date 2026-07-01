"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface DataFlowNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface DataFlowEdge {
  from: string;
  to: string;
  startFrame?: number;
}

export interface DataFlowPipesProps {
  nodes?: DataFlowNode[];
  edges?: DataFlowEdge[];
  pipeColor?: string;
  pulseColor?: string;
  pulseLength?: number;
  pulseDuration?: number;
  background?: string;
  nodeColor?: string;
  textColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_NODES: DataFlowNode[] = [
  { id: "client", label: "Client", x: 140, y: 360 },
  { id: "api", label: "API", x: 460, y: 200 },
  { id: "queue", label: "Queue", x: 460, y: 520 },
  { id: "db", label: "Database", x: 820, y: 360 },
  { id: "cdn", label: "CDN", x: 1140, y: 200 },
  { id: "log", label: "Logs", x: 1140, y: 520 },
];

const DEFAULT_EDGES: DataFlowEdge[] = [
  { from: "client", startFrame: 0, to: "api" },
  { from: "client", startFrame: 12, to: "queue" },
  { from: "api", startFrame: 24, to: "db" },
  { from: "queue", startFrame: 36, to: "db" },
  { from: "db", startFrame: 48, to: "cdn" },
  { from: "db", startFrame: 56, to: "log" },
];

const bezierPath = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => {
  const handle = Math.max(60, Math.abs(b.x - a.x) * 0.5);
  return `M ${a.x} ${a.y} C ${a.x + handle} ${a.y}, ${b.x - handle} ${b.y}, ${b.x} ${b.y}`;
};

const bezierLength = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => {
  const handle = Math.max(60, Math.abs(b.x - a.x) * 0.5);
  let len = 0;
  let prev = a;
  for (let i = 1; i <= 32; i += 1) {
    const t = i / 32;
    const u = 1 - t;
    const p = {
      x:
        u * u * u * a.x +
        3 * u * u * t * (a.x + handle) +
        3 * u * t * t * (b.x - handle) +
        t * t * t * b.x,
      y:
        u * u * u * a.y +
        3 * u * u * t * a.y +
        3 * u * t * t * b.y +
        t * t * t * b.y,
    };
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return len;
};

export const DataFlowPipes = ({
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  pipeColor = "#1f1f23",
  pulseColor = "#22d3ee",
  pulseLength = 60,
  pulseDuration = 36,
  background = "#050505",
  nodeColor = "#0a0a0a",
  textColor = "#fafafa",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: DataFlowPipesProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const containerStyle: CSSProperties = {
    background,
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  // Build path lengths for animation
  const edgesWithLength = edges.map((edge) => {
    const a = nodeMap.get(edge.from);
    const b = nodeMap.get(edge.to);
    const path = a && b ? bezierPath(a, b) : "";
    const len = a && b ? bezierLength(a, b) : 100;
    return { ...edge, a, b, len, path };
  });

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-dataflow-pulse {
            from { stroke-dashoffset: ${pulseLength + 100}; }
            to { stroke-dashoffset: -${pulseLength}; }
          }
        `}</style>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 720"
          style={{ inset: 0, position: "absolute" }}
        >
          {/* Static pipes */}
          {edgesWithLength.map((edge, i) => (
            <path
              key={`pipe-${i}`}
              d={edge.path}
              fill="none"
              stroke={pipeColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}

          {/* Pulses */}
          {edgesWithLength.map((edge, i) => {
            if (!edge.a || !edge.b) {
              return null;
            }
            const startMs = (edge.startFrame ?? 0) * frameMs;
            return (
              <g key={`pulse-${i}`}>
                {/* Trail copies */}
                {[0.15, 0.3, 0.55].map((alpha, idx) => (
                  <path
                    key={`trail-${idx}`}
                    d={edge.path}
                    fill="none"
                    stroke={pulseColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={`${pulseLength} 9999`}
                    style={{
                      animation: `framecn-dataflow-pulse ${pulseDuration * frameMs}ms linear ${startMs + idx * 100}ms backwards`,
                      opacity: alpha,
                    }}
                  />
                ))}
                {/* Bright head */}
                <path
                  d={edge.path}
                  fill="none"
                  stroke={pulseColor}
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeDasharray={`${pulseLength} 9999`}
                  style={{
                    animation: `framecn-dataflow-pulse ${pulseDuration * frameMs}ms linear ${startMs}ms backwards`,
                    filter: `drop-shadow(0 0 8px ${pulseColor})`,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              alignItems: "center",
              background: nodeColor,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              color: textColor,
              display: "flex",
              fontSize: 14,
              fontWeight: 600,
              height: 48,
              justifyContent: "center",
              left: node.x - 60,
              letterSpacing: "-0.01em",
              position: "absolute",
              top: node.y - 24,
              width: 120,
            }}
          >
            {node.label ?? node.id}
          </div>
        ))}
      </>
    </Timegroup>
  );
};
