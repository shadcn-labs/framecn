"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface BlurOutUpProps {
  text?: string;
  staggerDelay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const BlurOutUp = ({
  text = "Words fade and blur",
  staggerDelay = 4,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: BlurOutUpProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (17 * frameMs) / safeSpeed;
  const exitMs = (14 * frameMs) / safeSpeed;
  const staggerMs = (staggerDelay * frameMs) / safeSpeed;

  const words = text.split(" ");
  const exitStartMs = Math.max(
    0,
    durationMs - exitMs - (words.length - 1) * staggerMs
  );

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
          @keyframes framecn-bou-in {
            from { opacity: 0; transform: translateY(10px); filter: blur(6px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes framecn-bou-out {
            from { opacity: 1; transform: translateY(0); filter: blur(0); }
            to { opacity: 0; transform: translateY(-14px); filter: blur(8px); }
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
                animation: `framecn-bou-in ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms backwards, framecn-bou-out ${exitMs}ms cubic-bezier(0.64,0,0.78,0) ${exitStartMs + i * staggerMs}ms forwards`,
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
