"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface StaggeredFadeUpProps {
  text: string;
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

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export const StaggeredFadeUp = ({
  text,
  staggerDelay = 4,
  distance = 20,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: StaggeredFadeUpProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const staggerMs = (staggerDelay * frameMs) / speed;
  const wordAnimationDurationMs = 12 * frameMs;

  const containerStyle = {
    alignItems: "center",
    background: "white",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  } as CSSProperties;

  const words = text.split(" ");

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-fade-up {
            from {
              opacity: 0;
              transform: translateY(${distance}px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
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
          {words.map((word, i) => {
            const animationDelay = i * staggerMs;
            return (
              <span
                key={i}
                style={{
                  animation: `framecn-fade-up ${wordAnimationDurationMs}ms ease-out ${animationDelay}ms backwards`,
                  display: "inline-block",
                  marginRight: "0.25em",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      </>
    </Timegroup>
  );
};
