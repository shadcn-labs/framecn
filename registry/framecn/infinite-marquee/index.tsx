"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface InfiniteMarqueeProps {
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  stroke?: boolean;
  strokeColor?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const InfiniteMarquee = ({
  text = "ship · build · animate · ",
  fontSize = 120,
  color = "#171717",
  fontWeight = 900,
  pixelsPerFrame = 4,
  stroke = false,
  strokeColor = "#171717",
  background = "#fafafa",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  width = 1280,
  height = 720,
  className,
}: InfiniteMarqueeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const approxWidth = text.length * fontSize * 0.55;
  const scrollDurationMs =
    ((approxWidth / pixelsPerFrame / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width,
  };

  const spanStyle: CSSProperties = {
    WebkitTextStroke: stroke ? `2px ${strokeColor}` : undefined,
    color: stroke ? "transparent" : color,
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize,
    fontWeight,
    letterSpacing: "-0.03em",
    paddingRight: "0.4em",
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
          @keyframes framecn-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-${approxWidth}px); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-marquee ${scrollDurationMs}ms linear infinite`,
            display: "flex",
            whiteSpace: "nowrap",
          }}
        >
          <span style={spanStyle}>{text}</span>
          <span style={spanStyle}>{text}</span>
          <span style={spanStyle}>{text}</span>
        </div>
      </>
    </Timegroup>
  );
};
