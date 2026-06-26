"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface LineByLineSlideProps {
  text?: string;
  distance?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const LineByLineSlide = ({
  text = "First line\nSecond line",
  distance = 48,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: LineByLineSlideProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (27 * frameMs) / safeSpeed;
  const exitMs = (18 * frameMs) / safeSpeed;
  const enterStaggerMs = (4 * frameMs) / safeSpeed;
  const exitStaggerMs = (2 * frameMs) / safeSpeed;

  const lines = text.split("\n");
  const exitStartMs = durationMs - exitMs - (lines.length - 1) * exitStaggerMs;

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
          @keyframes framecn-lbls-in {
            from { opacity: 0; transform: translateX(-${distance}px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes framecn-lbls-out {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(${distance}px); }
          }
        `}</style>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.1em",
          }}
        >
          {lines.map((line, i) => {
            const enterDelay = i * enterStaggerMs;
            const exitDelay = exitStartMs + i * exitStaggerMs;
            return (
              <div
                key={i}
                style={{
                  animation: `framecn-lbls-in ${enterMs}ms ease-out ${enterDelay}ms backwards, framecn-lbls-out ${exitMs}ms ease-in ${exitDelay}ms forwards`,
                  color,
                  display: "block",
                  fontFamily: FONT_FAMILY,
                  fontSize,
                  fontWeight,
                  letterSpacing: "-0.03em",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
