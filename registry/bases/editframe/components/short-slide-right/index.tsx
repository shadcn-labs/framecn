"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface ShortSlideRightProps {
  text?: string;
  distance?: number;
  staggerDelay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const ShortSlideRight = ({
  text = "Short slide right",
  distance = 24,
  staggerDelay = 3,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: ShortSlideRightProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const containerMs = (16 * frameMs) / safeSpeed;
  const fadeMs = (6 * frameMs) / safeSpeed;
  const staggerMs = (staggerDelay * frameMs) / safeSpeed;

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
          @keyframes framecn-ssr-slide {
            from { transform: translateX(-${distance}px); }
            to { transform: translateX(0); }
          }
          @keyframes framecn-ssr-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <span
          style={{
            animation: `framecn-ssr-slide ${containerMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) 0ms backwards`,
            color,
            display: "inline-block",
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
                animation: `framecn-ssr-fade ${fadeMs}ms ease-out ${i * staggerMs}ms backwards`,
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
