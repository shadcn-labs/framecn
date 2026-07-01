"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultPanel = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      alignItems: "center",
      background: color,
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 96,
      fontWeight: 700,
      inset: 0,
      justifyContent: "center",
      letterSpacing: "-0.05em",
      position: "absolute",
    }}
  >
    {label}
  </div>
);

export interface FrostedGlassWipeProps {
  from?: ReactNode;
  to?: ReactNode;
  transitionStart?: number;
  transitionDuration?: number;
  glassBlur?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
  className?: string;
}

export const FrostedGlassWipe = ({
  from,
  to,
  transitionStart = 36,
  transitionDuration = 30,
  glassBlur = 24,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  background = "black",
  className,
}: FrostedGlassWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = transitionStart * frameMs;
  const durationMsCalc = (transitionDuration * frameMs) / safeSpeed;

  const fromContent = from ?? <DefaultPanel label="Scene A" color="#0ea5e9" />;
  const toContent = to ?? <DefaultPanel label="Scene B" color="#9333ea" />;

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
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
          @keyframes framecn-frosted-glass {
            from { transform: translateX(-110%); }
            to { transform: translateX(110%); }
          }
          @keyframes framecn-frosted-show {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div style={{ inset: 0, position: "absolute" }}>{fromContent}</div>
        <div
          style={{
            animation: `framecn-frosted-show 1ms linear ${startMs + durationMsCalc / 2}ms forwards`,
            inset: 0,
            position: "absolute",
          }}
        >
          {toContent}
        </div>
        <div
          style={{
            WebkitBackdropFilter: `blur(${glassBlur}px)`,
            animation: `framecn-frosted-glass ${durationMsCalc}ms cubic-bezier(0.6, 0, 0.2, 1) ${startMs}ms backwards`,
            backdropFilter: `blur(${glassBlur}px)`,
            background: "rgba(255,255,255,0.05)",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            bottom: 0,
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
            willChange: "transform",
          }}
        />
      </>
    </Timegroup>
  );
};
