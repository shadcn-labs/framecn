"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties, ReactNode } from "react";

export interface SpringPopInProps {
  children?: ReactNode;
  damping?: number;
  mass?: number;
  stiffness?: number;
  delayInFrames?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultChild = () => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)",
      borderRadius: 32,
      boxShadow: "0 30px 80px rgba(14,165,233,0.35)",
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 56,
      fontWeight: 700,
      height: 280,
      justifyContent: "center",
      letterSpacing: "-0.04em",
      width: 280,
    }}
  >
    Pop!
  </div>
);

export const SpringPopIn = ({
  children,
  damping = 12,
  mass = 1,
  stiffness = 100,
  delayInFrames = 0,
  speed = 1,
  fps = 30,
  durationInFrames = 45,
  className,
}: SpringPopInProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const delayMs = (delayInFrames / fps) * 1000;
  const springTension = Math.min(0.85, 0.34 + damping / 120 + mass * 0.04);
  const springOvershoot = Math.min(0.72, 0.56 + stiffness / 800);

  const containerStyle = {
    alignItems: "center",
    background: "white",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-spring-pop {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.08);
            }
            70% {
              transform: scale(0.97);
            }
            85% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-spring-pop ${durationMs - delayMs}ms cubic-bezier(${springTension}, ${springOvershoot}, 0.64, 1) ${delayMs}ms forwards`,
            transformOrigin: "center",
          }}
        >
          {children ?? <DefaultChild />}
        </div>
      </>
    </Timegroup>
  );
};
