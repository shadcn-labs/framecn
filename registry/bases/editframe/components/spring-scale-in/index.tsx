"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface SpringScaleInProps {
  text?: string;
  staggerDelay?: number;
  scaleFrom?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const SpringScaleIn = ({
  text = "Spring scale in",
  staggerDelay = 3,
  scaleFrom = 0.7,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SpringScaleInProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const wordDurationMs = (11 * frameMs) / safeSpeed;
  const staggerMs = (staggerDelay * frameMs) / safeSpeed;
  const scaleKey = Math.round(scaleFrom * 100);

  const words = text.split(" ");

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          alignItems: "center",
          background: "white",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-ssi-in-${scaleKey} {
            from { opacity: 0; transform: scale(${scaleFrom}); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <span
          style={{
            color,
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                animation: `framecn-ssi-in-${scaleKey} ${wordDurationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * staggerMs}ms backwards`,
                display: "inline-block",
                marginRight: "0.25em",
              }}
            >
              {word}
            </span>
          ))}
        </span>
      </>
    </Timegroup>
  );
};
