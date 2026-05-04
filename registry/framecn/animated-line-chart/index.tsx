"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface AnimatedLineChartProps {
  data?: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  background?: string;
  gridColor?: string;
  showDot?: boolean;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const AnimatedLineChart = ({
  data = [12, 19, 8, 15, 22, 18, 28, 25, 32],
  width = 1000,
  height = 500,
  strokeColor = "#22c55e",
  strokeWidth = 4,
  background = "#0a0a0a",
  gridColor = "#27272a",
  showDot = true,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: AnimatedLineChartProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const _frameMs = 1000 / fps;
  const durationMs = (durationInFrames / fps) * 1000;
  const lineDurationMs = (((durationInFrames * 0.85) / fps) * 1000) / safeSpeed;

  const padding = 60;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((value - min) / range) * innerHeight;
    return { x, y };
  });

  let pathLength = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    pathLength += Math.hypot(dx, dy);
  }

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const gridRows = 4;
  const gridCols = data.length - 1;

  const chartStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    height,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={chartStyle}
    >
      <>
        <style>{`
          @keyframes framecn-line-draw {
            from {
              stroke-dashoffset: ${pathLength};
              opacity: 0.7;
            }
            to {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
          @keyframes framecn-line-dot {
            0% {
              offset-distance: 0%;
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            100% {
              offset-distance: 100%;
              opacity: 1;
            }
          }
        `}</style>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: "visible" }}
        >
          {/* Horizontal grid */}
          {Array.from({ length: gridRows + 1 }).map((_, i) => {
            const y = padding + (i / gridRows) * innerHeight;
            return (
              <line
                key={`h-${i}`}
                x1={padding}
                x2={padding + innerWidth}
                y1={y}
                y2={y}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })}
          {/* Vertical grid */}
          {Array.from({ length: gridCols + 1 }).map((_, i) => {
            const x = padding + (i / gridCols) * innerWidth;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                x2={x}
                y1={padding}
                y2={padding + innerHeight}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })}
          {/* Axis */}
          <line
            x1={padding}
            x2={padding}
            y1={padding}
            y2={padding + innerHeight}
            stroke={gridColor}
            strokeWidth={2}
          />
          <line
            x1={padding}
            x2={padding + innerWidth}
            y1={padding + innerHeight}
            y2={padding + innerHeight}
            stroke={gridColor}
            strokeWidth={2}
          />

          {/* Animated line */}
          <path
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            style={{
              animation: `framecn-line-draw ${lineDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
              filter: `drop-shadow(0 0 12px ${strokeColor}55)`,
            }}
          />

          {showDot && (
            <circle
              r={strokeWidth * 2}
              fill={strokeColor}
              style={{
                animation: `framecn-line-dot ${lineDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                filter: `drop-shadow(0 0 8px ${strokeColor})`,
                offsetPath: `path("${d}")`,
              }}
            />
          )}
        </svg>
      </>
    </Timegroup>
  );
};
