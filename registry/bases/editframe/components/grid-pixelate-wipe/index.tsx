"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties, ReactElement } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultPanel = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      alignItems: "center",
      background: color,
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 96,
      fontWeight: 700,
      inset: 0,
      justifyContent: "center",
      letterSpacing: "-0.05em",
      position: "absolute",
    }}
  >
    {label}
  </div>
);

export interface GridPixelateWipeProps {
  from?: React.ReactNode;
  to?: React.ReactNode;
  cols?: number;
  rows?: number;
  pattern?: "wave" | "diagonal" | "spiral";
  transitionStart?: number;
  transitionDuration?: number;
  cellFadeFrames?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
  className?: string;
}

const computeDelays = (
  cols: number,
  rows: number,
  pattern: string,
  transitionDuration: number,
  cellFadeFrames: number
) => {
  const raw: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  let max = -Infinity;
  let min = Infinity;

  if (pattern === "spiral") {
    let bottom = rows - 1;
    let i = 0;
    let left = 0;
    let right = cols - 1;
    let top = 0;
    while (top <= bottom && left <= right) {
      for (let x = left; x <= right; x += 1) {
        raw[top][x] = i;
        i += 1;
      }
      top += 1;
      for (let y = top; y <= bottom; y += 1) {
        raw[y][right] = i;
        i += 1;
      }
      right -= 1;
      if (top <= bottom) {
        for (let x = right; x >= left; x -= 1) {
          raw[bottom][x] = i;
          i += 1;
        }
        bottom -= 1;
      }
      if (left <= right) {
        for (let y = bottom; y >= top; y -= 1) {
          raw[y][left] = i;
          i += 1;
        }
        left -= 1;
      }
    }
  } else {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        raw[y][x] =
          pattern === "wave"
            ? Math.hypot(x - (cols - 1) / 2, y - (rows - 1) / 2)
            : x + y;
      }
    }
  }

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (raw[y][x] < min) {
        min = raw[y][x];
      }
      if (raw[y][x] > max) {
        max = raw[y][x];
      }
    }
  }

  const span = Math.max(0, transitionDuration - cellFadeFrames);
  const range = max - min || 1;
  const normalized: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      normalized[y][x] = ((raw[y][x] - min) / range) * span;
    }
  }
  return normalized;
};

export const GridPixelateWipe = ({
  from,
  to,
  cols = 12,
  rows = 7,
  pattern = "wave",
  transitionStart = 36,
  transitionDuration = 30,
  cellFadeFrames = 4,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  background = "black",
  className,
}: GridPixelateWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = transitionStart * frameMs;

  const delays = computeDelays(
    cols,
    rows,
    pattern,
    transitionDuration,
    cellFadeFrames
  );
  const cellFadeMs = ((cellFadeFrames / fps) * 1000) / safeSpeed;

  const fromContent = from ?? <DefaultPanel label="Scene A" color="#0f172a" />;
  const toContent = to ?? <DefaultPanel label="Scene B" color="#ec4899" />;

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  // Build grid cells
  const cells: ReactElement[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const delayMs = (delays[y][x] * frameMs) / safeSpeed;
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            animation: `framecn-grid-pixel-fade ${cellFadeMs}ms ease-out ${startMs + delayMs}ms backwards`,
            background: "black",
          }}
        />
      );
    }
  }

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-grid-pixel-fade {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}</style>
        <div style={{ inset: 0, position: "absolute" }}>{toContent}</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            inset: 0,
            position: "absolute",
          }}
        >
          {cells}
        </div>
        <div style={{ inset: 0, opacity: 1, position: "absolute" }}>
          {fromContent}
        </div>
      </>
    </Timegroup>
  );
};
