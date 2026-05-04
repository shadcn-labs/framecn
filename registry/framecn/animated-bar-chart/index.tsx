"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface AnimatedBarChartProps {
  data?: number[];
  labels?: string[];
  width?: number;
  height?: number;
  barColor?: string;
  background?: string;
  gap?: number;
  staggerFrames?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const clampProgressValue = (value: number) => Math.max(0, value);

export const AnimatedBarChart = ({
  data = [35, 60, 45, 80, 55, 70, 90, 65],
  labels,
  width = 1000,
  height = 500,
  barColor = "#0ea5e9",
  background = "#0a0a0a",
  gap = 16,
  staggerFrames = 6,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: AnimatedBarChartProps) => {
  const chartData = data.length > 0 ? data.map(clampProgressValue) : [0];
  const max = Math.max(1, ...chartData);
  const safeSpeed = Math.max(0.01, speed);
  const padding = 60;
  const labelSpace = labels ? 40 : 0;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2 - labelSpace;
  const safeGap = Math.max(0, gap);
  const barWidth =
    (innerWidth - safeGap * (chartData.length - 1)) / chartData.length;
  const baseY = padding + innerHeight;
  const frameMs = 1000 / fps;
  const growDurationMs = 900 / safeSpeed;
  const staggerMs = (staggerFrames * frameMs) / safeSpeed;
  const durationMs = (durationInFrames / fps) * 1000;
  const chartStyle = {
    "--animated-bar-chart-color": barColor,
    "--animated-bar-chart-shadow": `${barColor}55`,
    background,
    display: "block",
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    height,
    overflow: "hidden",
    position: "relative",
    width,
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={chartStyle}
    >
      <>
        <style>{`
        @keyframes framecn-animated-bar-grow {
          from {
            opacity: 0.5;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes framecn-animated-bar-label {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        <svg
          aria-label="Animated bar chart"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <line
            stroke="#27272a"
            strokeWidth={2}
            x1={padding}
            x2={padding + innerWidth}
            y1={baseY}
            y2={baseY}
          />

          {chartData.map((value, index) => {
            const targetHeight = (value / max) * innerHeight;
            const x = padding + index * (barWidth + safeGap);
            const y = baseY - targetHeight;
            const animationDelay = index * staggerMs;

            return (
              <g key={`${value}-${index}`}>
                <rect
                  fill="var(--animated-bar-chart-color)"
                  height={targetHeight}
                  rx={6}
                  style={{
                    animation: `framecn-animated-bar-grow ${growDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}ms backwards`,
                    filter:
                      "drop-shadow(0 4px 16px var(--animated-bar-chart-shadow))",
                    transformBox: "fill-box",
                    transformOrigin: `${x + barWidth / 2}px ${baseY}px`,
                  }}
                  width={barWidth}
                  x={x}
                  y={y}
                />
                {labels?.[index] && (
                  <text
                    fill="#a1a1aa"
                    fontSize={16}
                    style={{
                      animation: `framecn-animated-bar-label ${growDurationMs}ms ease-out ${animationDelay}ms backwards`,
                      fontFamily:
                        "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                    textAnchor="middle"
                    x={x + barWidth / 2}
                    y={baseY + 28}
                  >
                    {labels[index]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </>
    </Timegroup>
  );
};
