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

export interface DirectionalWipeProps {
  from?: ReactNode;
  to?: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  transitionStart?: number;
  transitionDuration?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
  className?: string;
}

export const DirectionalWipe = ({
  from,
  to,
  direction = "left",
  transitionStart = 36,
  transitionDuration = 20,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  background = "black",
  className,
}: DirectionalWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = transitionStart * frameMs;
  const durationMsCalc = (transitionDuration * frameMs) / safeSpeed;

  const axis: "x" | "y" =
    direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "left" || direction === "up" ? -1 : 1;

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
          @keyframes framecn-dir-wipe-from {
            from { transform: translateX(0%); }
            to { transform: translateX(${sign * 100}%); }
          }
          @keyframes framecn-dir-wipe-to {
            from { transform: translateX(${-sign * 100}%); }
            to { transform: translateX(0%); }
          }
          @keyframes framecn-dir-wipe-from-y {
            from { transform: translateY(0%); }
            to { transform: translateY(${sign * 100}%); }
          }
          @keyframes framecn-dir-wipe-to-y {
            from { transform: translateY(${-sign * 100}%); }
            to { transform: translateY(0%); }
          }
        `}</style>
        <div
          style={{
            animation:
              axis === "x"
                ? `framecn-dir-wipe-from ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`
                : `framecn-dir-wipe-from-y ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`,
            inset: 0,
            position: "absolute",
            willChange: "transform",
          }}
        >
          {fromContent}
        </div>
        <div
          style={{
            animation:
              axis === "x"
                ? `framecn-dir-wipe-to ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`
                : `framecn-dir-wipe-to-y ${durationMsCalc}ms cubic-bezier(0.65, 0, 0.35, 1) ${startMs}ms backwards`,
            inset: 0,
            position: "absolute",
            willChange: "transform",
          }}
        >
          {toContent}
        </div>
      </>
    </Timegroup>
  );
};
