"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface MicroScaleFadeProps {
  text?: string;
  scaleFrom?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const MicroScaleFade = ({
  text = "Scale fade in",
  scaleFrom = 0.96,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: MicroScaleFadeProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (18 * frameMs) / safeSpeed;
  const keyframeName = `framecn-msf-in-${Math.round(scaleFrom * 100)}`;

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
          @keyframes ${keyframeName} {
            from { opacity: 0; transform: scale(${scaleFrom}); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <span
          style={{
            animation: `${keyframeName} ${enterMs}ms cubic-bezier(0.22,1,0.36,1) 0ms backwards`,
            color,
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
