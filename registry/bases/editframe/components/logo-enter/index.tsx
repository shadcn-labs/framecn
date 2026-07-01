"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const LOGOS = [
  { bg: "#cc785c", fg: "white", name: "C" },
  { bg: "#000000", fg: "white", name: "Cu" },
  { bg: "#10a37f", fg: "white", name: "Co" },
  { bg: "#1a1a1a", fg: "white", name: "G" },
];

export interface LogoEnterProps {
  diameter?: number;
  overlap?: number;
  ringColor?: string;
  orientation?: "horizontal" | "vertical";
  stagger?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  background?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const LogoEnter = ({
  diameter = 118,
  overlap = 38,
  ringColor = "#ffffff",
  orientation = "horizontal",
  stagger = 7,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  background = "#0a0a0a",
  className,
}: LogoEnterProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const staggerMs = (stagger * frameMs) / safeSpeed;

  const isVertical = orientation === "vertical";

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          alignItems: "center",
          background,
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-le-in {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
          }}
        >
          {LOGOS.map((logo, i) => (
            <div
              key={i}
              style={{
                alignItems: "center",
                animation: `framecn-le-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * staggerMs}ms backwards`,
                background: logo.bg,
                border: `3px solid ${ringColor}`,
                borderRadius: "50%",
                color: logo.fg,
                display: "flex",
                fontFamily: FONT_FAMILY,
                fontSize: diameter * 0.3,
                fontWeight: 700,
                height: diameter,
                justifyContent: "center",
                marginLeft: !isVertical && i > 0 ? -overlap : 0,
                marginTop: isVertical && i > 0 ? -overlap : 0,
                position: "relative",
                width: diameter,
                zIndex: i,
              }}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
