"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface FadeThroughProps {
  fromText?: string;
  toText?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const FadeThrough = ({
  fromText = "Hello world",
  toText = "New world",
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: FadeThroughProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const exitMs = (8 * frameMs) / safeSpeed;
  const enterMs = (13 * frameMs) / safeSpeed;
  const enterStartMs = exitMs + (1 * frameMs) / safeSpeed;

  const exitAnimation = `framecn-ft-exit ${exitMs}ms ease-out 0ms forwards`;
  const enterAnimation = `framecn-ft-enter ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${enterStartMs}ms backwards`;

  const textStyle: CSSProperties = {
    color,
    fontFamily: FONT_FAMILY,
    fontSize,
    fontWeight,
    left: "50%",
    letterSpacing: "-0.03em",
    position: "absolute",
    top: "50%",
    whiteSpace: "nowrap",
  };

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
          @keyframes framecn-ft-exit {
            from { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
            to { opacity: 0; transform: translate(-50%, -50%) translateY(-4px); }
          }
          @keyframes framecn-ft-enter {
            from { opacity: 0; transform: translate(-50%, -50%) translateY(6px) scale(0.99); filter: blur(2px); }
            to { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); filter: blur(0); }
          }
        `}</style>
        <div style={{ height: 0, position: "relative", width: 0 }}>
          <span style={{ ...textStyle, animation: exitAnimation }}>
            {fromText}
          </span>
          <span style={{ ...textStyle, animation: enterAnimation }}>
            {toText}
          </span>
        </div>
      </>
    </Timegroup>
  );
};
