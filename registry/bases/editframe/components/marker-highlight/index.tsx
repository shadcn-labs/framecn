"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface MarkerHighlightProps {
  before?: string;
  highlight?: string;
  after?: string;
  markerColor?: string;
  baseColor?: string;
  highlightedTextColor?: string;
  fontSize?: number;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const MarkerHighlight = ({
  before = "",
  highlight = "builders",
  after = ".",
  markerColor = "#facc15",
  baseColor = "#171717",
  highlightedTextColor = "#171717",
  fontSize = 72,
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  className,
}: MarkerHighlightProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const markerGrowMs = ((15 / fps) * 1000) / safeSpeed;
  const colorFadeMs = ((15 / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "white",
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
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-marker-grow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @keyframes framecn-marker-fade {
            from { color: ${baseColor}; }
            to { color: ${highlightedTextColor}; }
          }
        `}</style>
        <span
          style={{
            color: baseColor,
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {before}
          <span style={{ display: "inline-block", position: "relative" }}>
            <span
              aria-hidden
              style={{
                animation: `framecn-marker-grow ${markerGrowMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                background: markerColor,
                inset: "0 -0.1em",
                position: "absolute",
                transformOrigin: "left center",
                zIndex: 0,
              }}
            />
            <span
              style={{
                animation: `framecn-marker-fade ${colorFadeMs}ms ease-out ${markerGrowMs * 0.8}ms backwards`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {highlight}
            </span>
          </span>
          {after}
        </span>
      </>
    </Timegroup>
  );
};
