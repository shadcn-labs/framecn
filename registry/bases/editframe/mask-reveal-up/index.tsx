"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface MaskRevealUpProps {
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

export const MaskRevealUp = ({
  text = "First line\nSecond line",
  distance = 30,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: MaskRevealUpProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (23 * frameMs) / safeSpeed;
  const exitMs = (16 * frameMs) / safeSpeed;
  const enterStaggerMs = (3 * frameMs) / safeSpeed;
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
          @keyframes framecn-mru-in {
            from { opacity: 0; transform: translateY(${distance}px); filter: blur(6px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes framecn-mru-out {
            from { opacity: 1; transform: translateY(0); filter: blur(0); }
            to { opacity: 0; transform: translateY(-22px); filter: blur(6px); }
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
                  animation: `framecn-mru-in ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${enterDelay}ms backwards, framecn-mru-out ${exitMs}ms ease-in ${exitDelay}ms forwards`,
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
