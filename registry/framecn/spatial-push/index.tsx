"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties, ReactNode } from "react";

export interface SpatialPushProps {
  from?: ReactNode;
  to?: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  transitionStart?: number;
  transitionDuration?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
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
      height: "100%",
      inset: 0,
      justifyContent: "center",
      letterSpacing: "-0.05em",
      position: "absolute",
    }}
  >
    {label}
  </div>
);

const _getTransform = (progress: number, dir: string): string => {
  switch (dir) {
    case "up": {
      return `translateY(${(1 - progress) * 100}%)`;
    }
    case "down": {
      return `translateY(${(progress - 1) * 100}%)`;
    }
    case "left": {
      return `translateX(${(1 - progress) * 100}%)`;
    }
    case "right": {
      return `translateX(${(progress - 1) * 100}%)`;
    }
    default: {
      return `translateY(${(1 - progress) * 100}%)`;
    }
  }
};

const getShadow = (dir: string): string => {
  switch (dir) {
    case "up": {
      return "0 -40px 100px rgba(0,0,0,0.8)";
    }
    case "down": {
      return "0 40px 100px rgba(0,0,0,0.8)";
    }
    case "left": {
      return "-40px 0 100px rgba(0,0,0,0.8)";
    }
    case "right": {
      return "40px 0 100px rgba(0,0,0,0.8)";
    }
    default: {
      return "0 -40px 100px rgba(0,0,0,0.8)";
    }
  }
};

export const SpatialPush = ({
  from,
  to,
  direction = "up",
  transitionStart,
  transitionDuration = 30,
  _speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SpatialPushProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const start =
    typeof transitionStart === "number"
      ? transitionStart
      : Math.floor(durationInFrames * 0.4);

  const startPct = (start / durationInFrames) * 100;
  const endPct = ((start + transitionDuration) / durationInFrames) * 100;
  const springEndPct = ((start + 40) / durationInFrames) * 100;

  const fromContent = from ?? <DefaultPanel label="Scene A" color="#0f172a" />;
  const toContent = to ?? <DefaultPanel label="Scene B" color="#22c55e" />;

  const containerStyle = {
    background: "black",
    height: "100%",
    overflow: "hidden",
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
          @keyframes framecn-spatial-from {
            ${startPct}% {
              transform: scale(1);
              filter: brightness(1);
              border-radius: 0px;
            }
            ${endPct}% {
              transform: scale(0.92);
              filter: brightness(0.5);
              border-radius: 16px;
            }
            100% {
              transform: scale(0.92);
              filter: brightness(0.5);
              border-radius: 16px;
            }
          }

          @keyframes framecn-spatial-to-up {
            0%, ${startPct}% {
              transform: translateY(100%);
            }
            ${springEndPct}% {
              transform: translateY(-3%);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes framecn-spatial-to-down {
            0%, ${startPct}% {
              transform: translateY(-100%);
            }
            ${springEndPct}% {
              transform: translateY(3%);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes framecn-spatial-to-left {
            0%, ${startPct}% {
              transform: translateX(100%);
            }
            ${springEndPct}% {
              transform: translateX(-3%);
            }
            100% {
              transform: translateX(0);
            }
          }

          @keyframes framecn-spatial-to-right {
            0%, ${startPct}% {
              transform: translateX(-100%);
            }
            ${springEndPct}% {
              transform: translateX(3%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>

        <div
          style={{
            animation: `framecn-spatial-from ${durationMs}ms ease-out forwards`,
            inset: 0,
            overflow: "hidden",
            position: "absolute",
          }}
        >
          {fromContent}
        </div>

        <div
          style={{
            animation: `framecn-spatial-to-${direction} ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            boxShadow: getShadow(direction),
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
