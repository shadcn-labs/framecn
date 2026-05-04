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

export interface KineticTypeMaskProps {
  from?: ReactNode;
  to?: ReactNode;
  text?: string;
  transitionStart?: number;
  holdFrames?: number;
  transitionDuration?: number;
  maxScale?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const KineticTypeMask = ({
  from,
  to,
  text = "NEXT",
  transitionStart,
  holdFrames = 12,
  transitionDuration = 24,
  maxScale = 120,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  className,
}: KineticTypeMaskProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const startMs =
    (transitionStart ?? Math.floor(durationInFrames * 0.3)) * frameMs;
  const scaleStartMs = (startMs + holdFrames * frameMs) / safeSpeed;
  const scaleDurationMs = (transitionDuration * frameMs) / safeSpeed;

  const fromContent = from ?? <DefaultPanel label="Scene A" color="#0f172a" />;
  const toContent = to ?? <DefaultPanel label="Scene B" color="#f97316" />;

  const containerStyle: CSSProperties = {
    background: "black",
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
          @keyframes framecn-kinetic-mask-text {
            0% { transform: scale(1); }
            100% { transform: scale(${maxScale}); }
          }
          @keyframes framecn-kinetic-mask-reveal {
            from { clip-path: inset(0 0 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          @keyframes framecn-kinetic-scene {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div style={{ inset: 0, position: "absolute" }}>{fromContent}</div>

        {maxScale > 1 && (
          <div
            style={{
              alignItems: "center",
              animation: `framecn-kinetic-mask-text ${scaleDurationMs}ms cubic-bezier(0.7, 0, 0.84, 1) ${scaleStartMs}ms backwards`,
              color: "black",
              display: "flex",
              fontFamily: FONT_FAMILY,
              fontSize: height * 0.7,
              fontWeight: 900,
              inset: 0,
              justifyContent: "center",
              position: "absolute",
              transformOrigin: "center center",
            }}
          >
            {text}
          </div>
        )}

        <div
          style={{
            animation: `framecn-kinetic-scene 1ms linear ${scaleStartMs + scaleDurationMs * 0.95}ms forwards`,
            inset: 0,
            position: "absolute",
          }}
        >
          {toContent}
        </div>
      </>
    </Timegroup>
  );
};
