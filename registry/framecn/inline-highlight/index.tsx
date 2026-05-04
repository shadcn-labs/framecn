"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface InlineHighlightProps {
  before: string;
  highlight: string;
  after?: string;
  baseColor?: string;
  highlightColor?: string;
  fontSize?: number;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const InlineHighlight = ({
  before,
  highlight,
  after = "",
  baseColor = "#171717",
  highlightColor = "#ff5e3a",
  fontSize = 48,
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: InlineHighlightProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const highlightDurationMs =
    (((durationInFrames * 0.5) / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "white",
    display: "flex",
    height: 500,
    justifyContent: "center",
    position: "relative",
    width: 1000,
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
          @keyframes framecn-inline-highlight {
            from {
              color: ${baseColor};
            }
            to {
              color: ${highlightColor};
            }
          }
        `}</style>
        <span
          style={{
            animation: `framecn-inline-highlight ${highlightDurationMs}ms ease-out ${durationMs - highlightDurationMs}ms forwards`,
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {before}
          <span style={{ color: highlightColor }}>{highlight}</span>
          {after}
        </span>
      </>
    </Timegroup>
  );
};
