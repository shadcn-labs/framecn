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
  _damping = 12,
  _mass = 1,
  _stiffness = 100,
  delayInFrames = 0,
  _speed = 1,
  fps = 30,
  durationInFrames = 45,
  className,
}: SpringPopInProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const delayMs = (delayInFrames / fps) * 1000;

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
            animation: `framecn-spring-pop ${durationMs - delayMs}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms forwards`,
            transformOrigin: "center",
          }}
        >
          {children ?? <DefaultChild />}
        </div>
      </>
    </Timegroup>
  );
};
