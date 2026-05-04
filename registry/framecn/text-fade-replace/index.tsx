"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface TextFadeReplaceProps {
  from: string;
  to: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FPS = 30;
const DURATION_IN_FRAMES = 90;

export const TextFadeReplace = ({
  from,
  to,
  fontSize = 48,
  color = "#171717",
  fontWeight = 600,
  _speed = 1,
  fps = FPS,
  durationInFrames = DURATION_IN_FRAMES,
  className,
}: TextFadeReplaceProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  const baseSpanStyle: CSSProperties = {
    color,
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
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
          @keyframes framecn-text-fade-from {
            0%, 40% {
              opacity: 1;
              transform: translate(-50%, calc(-50% + 0px));
            }
            60%, 100% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + -12px));
            }
          }

          @keyframes framecn-text-fade-to {
            0%, 40% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 12px));
            }
            60%, 100% {
              opacity: 1;
              transform: translate(-50%, calc(-50% + 0px));
            }
          }
        `}</style>
        <div style={{ height: 0, position: "relative", width: 0 }}>
          <span
            className={className}
            style={{
              ...baseSpanStyle,
              animation: `framecn-text-fade-from ${durationMs}ms ease-in-out forwards`,
            }}
          >
            {from}
          </span>
          <span
            className={className}
            style={{
              ...baseSpanStyle,
              animation: `framecn-text-fade-to ${durationMs}ms ease-in-out forwards`,
            }}
          >
            {to}
          </span>
        </div>
      </>
    </Timegroup>
  );
};
