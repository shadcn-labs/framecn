"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS = [
  "Vercel",
  "Linear",
  "Stripe",
  "Figma",
  "Notion",
  "Discord",
];

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const PerspectiveMarquee = ({
  items = DEFAULT_ITEMS,
  fontSize = 84,
  color = "#fafafa",
  fontWeight = 700,
  pixelsPerFrame = 2,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  fadeColor = "#050505",
  background = "#050505",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  width = 1280,
  height = 720,
  className,
}: PerspectiveMarqueeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const approxItemWidth = items.join("  ").length * fontSize * 0.6;
  const scrollMs =
    ((approxItemWidth / pixelsPerFrame / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily: FONT_FAMILY,
    height,
    justifyContent: "center",
    overflow: "hidden",
    perspective,
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
          @keyframes framecn-perspective-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-${approxItemWidth}px); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-perspective-marquee ${scrollMs}ms linear infinite`,
            display: "flex",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            whiteSpace: "nowrap",
          }}
        >
          {[...items, ...items, ...items].map((item, i) => {
            const itemCenter =
              (i * (approxItemWidth / items.length)) % approxItemWidth;
            const norm = (itemCenter - width / 2) / (width / 2);
            const distance = Math.min(1, Math.abs(norm));
            const blurPx = distance * 6;
            const opacity = 1 - distance * 0.4;
            return (
              <span
                key={i}
                style={{
                  color,
                  display: "inline-block",
                  filter: `blur(${blurPx}px)`,
                  fontFamily: FONT_FAMILY,
                  fontSize,
                  fontWeight,
                  letterSpacing: "-0.03em",
                  opacity,
                  paddingRight: "0.25em",
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        {/* Vignette */}
        <div
          style={{
            background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 18%, transparent 82%, ${fadeColor} 100%)`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
        <div
          style={{
            background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 25%, transparent 75%, ${fadeColor} 100%)`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      </>
    </Timegroup>
  );
};
