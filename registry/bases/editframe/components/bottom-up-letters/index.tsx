"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface BottomUpLettersProps {
  text?: string;
  staggerDelay?: number;
  distance?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const BottomUpLetters = ({
  text = "Hello world",
  staggerDelay = 3,
  distance = 46,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: BottomUpLettersProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (12 * frameMs) / safeSpeed;
  const charStaggerMs = (staggerDelay * frameMs) / safeSpeed;

  const chars = [...text];

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "white",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
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
          @keyframes framecn-bul-in {
            from { opacity: 0; transform: translateY(${distance}px); }
            to { opacity: 1; transform: translateY(0); }
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
          {chars.map((char, i) => (
            <span
              key={i}
              style={{
                animation: `framecn-bul-in ${enterMs}ms ease-out ${i * charStaggerMs}ms backwards`,
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </>
    </Timegroup>
  );
};
