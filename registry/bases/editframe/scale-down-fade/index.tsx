"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface ScaleDownFadeProps {
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const ScaleDownFade = ({
  text = "Scale down fade",
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: ScaleDownFadeProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (16 * frameMs) / safeSpeed;
  const exitMs = (11 * frameMs) / safeSpeed;
  const exitStartMs = durationMs - exitMs;

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
          @keyframes framecn-sdf-in {
            from { opacity: 0; transform: translateY(8px) scale(1.04); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-sdf-out {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-8px) scale(0.94); }
          }
        `}</style>
        <span
          style={{
            animation: `framecn-sdf-in ${enterMs}ms ease-out 0ms backwards, framecn-sdf-out ${exitMs}ms ease-in ${exitStartMs}ms forwards`,
            color,
            display: "inline-block",
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </span>
      </>
    </Timegroup>
  );
};
