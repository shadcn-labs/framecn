"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface MaskedSlideRevealProps {
  text?: string;
  staggerDelay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const MaskedSlideReveal = ({
  text = "Ship to production.",
  staggerDelay = 3,
  fontSize = 72,
  color = "#171717",
  fontWeight = 700,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  className,
}: MaskedSlideRevealProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const _frameMs = 1000 / fps;
  const staggerMs = ((staggerDelay / fps) * 1000) / safeSpeed;

  const words = text.split(" ");
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
          @keyframes framecn-masked-slide {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <span
          style={{
            color,
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                lineHeight: 1.05,
                marginRight: "0.25em",
                overflow: "hidden",
                verticalAlign: "bottom",
              }}
            >
              <span
                style={{
                  animation: `framecn-masked-slide ${staggerMs * 3}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerMs}ms backwards`,
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      </>
    </Timegroup>
  );
};
