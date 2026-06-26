"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface FocusBlurResolveProps {
  text?: string;
  blur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const FocusBlurResolve = ({
  text = "Focus blur resolve",
  blur = 14,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: FocusBlurResolveProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (23 * frameMs) / safeSpeed;
  const exitMs = (16 * frameMs) / safeSpeed;
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
          @keyframes framecn-fbr-in-${blur} {
            from { opacity: 0; transform: translateY(14px) scale(1.01); filter: blur(${blur}px); }
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes framecn-fbr-out-${blur} {
            from { opacity: 1; transform: translateY(0); filter: blur(0); }
            to { opacity: 0; transform: translateY(-10px); filter: blur(10px); }
          }
        `}</style>
        <span
          style={{
            animation: `framecn-fbr-in-${blur} ${enterMs}ms cubic-bezier(0.22,1,0.36,1) 0ms backwards, framecn-fbr-out-${blur} ${exitMs}ms ease-in ${exitStartMs}ms forwards`,
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
