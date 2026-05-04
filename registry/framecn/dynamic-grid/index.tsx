"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface DynamicGridProps {
  cellSize?: number;
  lineColor?: string;
  background?: string;
  speed?: number;
  direction?: "diagonal" | "horizontal" | "vertical";
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const getGridAnimation = (dir: string, offset: number): string => {
  if (dir === "diagonal") {
    return `framecn-grid-scroll ${offset}ms linear infinite`;
  }
  if (dir === "horizontal") {
    return `framecn-grid-scroll-x ${offset}ms linear infinite`;
  }
  return `framecn-grid-scroll-y ${offset}ms linear infinite`;
};

export const DynamicGrid = ({
  cellSize = 40,
  lineColor = "#27272a",
  background = "#0a0a0a",
  speed = 0.5,
  direction = "diagonal",
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: DynamicGridProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const offsetMs = ((cellSize / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-grid-scroll {
            from { transform: translate(0, 0); }
            to { transform: translate(${cellSize}px, ${cellSize}px); }
          }
          @keyframes framecn-grid-scroll-x {
            from { transform: translate(0, 0); }
            to { transform: translate(${cellSize}px, 0); }
          }
          @keyframes framecn-grid-scroll-y {
            from { transform: translate(0, 0); }
            to { transform: translate(0, ${cellSize}px); }
          }
        `}</style>
        <div
          style={{
            animation: getGridAnimation(direction, offsetMs),
            backgroundImage: `
              linear-gradient(to right, ${lineColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            inset: `-${cellSize}px`,
            position: "absolute",
            willChange: "transform",
          }}
        />
      </>
    </Timegroup>
  );
};
