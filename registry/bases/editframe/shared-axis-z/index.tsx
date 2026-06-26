"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface SharedAxisZProps {
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

export const SharedAxisZ = ({
  fromText = "Hello world",
  toText = "New world",
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SharedAxisZProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const exitMs = (11 * frameMs) / safeSpeed;
  const enterMs = (16 * frameMs) / safeSpeed;
  const enterStartMs = exitMs - (2 * frameMs) / safeSpeed;

  const exitAnimation = `framecn-saz-exit ${exitMs}ms ease-in 0ms forwards`;
  const enterAnimation = `framecn-saz-enter ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${enterStartMs}ms backwards`;

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
          @keyframes framecn-saz-exit {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(1.06); filter: blur(1px); }
          }
          @keyframes framecn-saz-enter {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); filter: blur(2px); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
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
