"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface BlurRevealProps {
  text?: string;
  className?: string;
  blur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
}

export const BlurReveal = ({
  text = "BlurReveal",
  className,
  blur = 10,
  fontSize = 48,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1000,
  height = 500,
  background = "white",
}: BlurRevealProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const revealDurationMs =
    (((durationInFrames * 0.6) / fps) * 1000) / safeSpeed;

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

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-blur-reveal {
            from {
              opacity: 0;
              filter: blur(${blur}px);
            }
            to {
              opacity: 1;
              filter: blur(0px);
            }
          }
        `}</style>
        <span
          style={{
            animation: `framecn-blur-reveal ${revealDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
            color,
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize,
            fontWeight,
            letterSpacing: "-0.05em",
          }}
        >
          {text}
        </span>
      </>
    </Timegroup>
  );
};
