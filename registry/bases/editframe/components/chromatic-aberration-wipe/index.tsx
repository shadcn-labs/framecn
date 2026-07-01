"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

export interface ChromaticAberrationWipeProps {
  from?: ReactNode;
  to?: ReactNode;
  direction?: "left" | "right";
  transitionStart?: number;
  transitionDuration?: number;
  aberrationOffset?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
  className?: string;
}

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

export const ChromaticAberrationWipe = ({
  from,
  to,
  direction = "left",
  transitionStart = 36,
  transitionDuration = 7,
  aberrationOffset = 8,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  background = "black",
  className,
}: ChromaticAberrationWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = transitionStart * frameMs;
  const durationMsCalc = (transitionDuration * frameMs) / safeSpeed;
  const sign = direction === "left" ? -1 : 1;

  const fromContent = from ?? <DefaultPanel label="Scene A" color="#0f172a" />;
  const toContent = to ?? <DefaultPanel label="Scene B" color="#06b6d4" />;

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
          @keyframes framecn-chromatic-from {
            from { transform: translateX(${sign * 100}%); }
            to { transform: translateX(0%); }
          }
          @keyframes framecn-chromatic-to {
            from { transform: translateX(${-sign * 100}%); }
            to { transform: translateX(0%); }
          }
          @keyframes framecn-chromatic-filter {
            0%, 100% { filter: none; }
            25%, 75% { filter: drop-shadow(${-aberrationOffset}px 0 0 rgba(255,0,0,0.8)) drop-shadow(${aberrationOffset}px 0 0 rgba(0,255,255,0.8)); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-chromatic-from ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`,
            inset: 0,
            position: "absolute",
            willChange: "transform",
          }}
        >
          {fromContent}
        </div>
        <div
          style={{
            animation: `framecn-chromatic-to ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`,
            inset: 0,
            position: "absolute",
            willChange: "transform",
          }}
        >
          {toContent}
        </div>
        {/* Aberration filter overlay */}
        <div
          style={{
            animation: `framecn-chromatic-filter ${durationMsCalc}ms ease-in-out ${startMs}ms backwards`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      </>
    </Timegroup>
  );
};
