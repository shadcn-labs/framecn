"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface ShimmerSweepProps {
  text: string;
  baseColor?: string;
  shineColor?: string;
  fontSize?: number;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const ShimmerSweep = ({
  text,
  baseColor = "#3f3f46",
  shineColor = "#fafafa",
  fontSize = 96,
  fontWeight = 700,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: ShimmerSweepProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const style = {
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  const textStyle: CSSProperties = {
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize,
    fontWeight,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    margin: 0,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-shimmer-sweep {
            from {
              background-position: 200% 50%;
            }
            80% {
              background-position: -100% 50%;
            }
            100% {
              background-position: -100% 50%;
            }
          }
        `}</style>

        <div
          style={{
            alignItems: "center",
            background: "white",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <div style={{ display: "inline-block", position: "relative" }}>
            <span style={{ ...textStyle, color: baseColor }}>{text}</span>
            <span
              style={{
                ...textStyle,
                WebkitBackgroundClip: "text",
                animation: `framecn-shimmer-sweep ${durationMs}ms linear forwards`,
                backgroundClip: "text",
                backgroundImage: `linear-gradient(110deg, transparent 30%, ${shineColor} 50%, transparent 70%)`,
                backgroundSize: "200% 100%",
                color: "transparent",
                inset: 0,
                position: "absolute",
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
