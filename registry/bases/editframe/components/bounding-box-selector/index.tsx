"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

export interface BoundingBoxSelectorProps {
  children?: ReactNode;
  borderColor?: string;
  handleColor?: string;
  borderWidth?: number;
  appearAt?: number;
  background?: string;
  speed?: number;
  className?: string;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultPlaceholder = () => (
  <div
    style={{
      alignItems: "center",
      background: "white",
      borderRadius: 16,
      boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
      color: "#71717a",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fontWeight: 600,
      height: 280,
      justifyContent: "center",
      letterSpacing: "-0.02em",
      width: 480,
    }}
  >
    Selected element
  </div>
);

const Handle = ({ color, style }: { color: string; style: CSSProperties }) => (
  <div
    style={{
      background: "white",
      border: `2px solid ${color}`,
      borderRadius: 2,
      height: 10,
      position: "absolute",
      width: 10,
      ...style,
    }}
  />
);

export const BoundingBoxSelector = ({
  children,
  borderColor = "#0ea5e9",
  handleColor = "#0ea5e9",
  borderWidth = 2,
  appearAt = 15,
  background = "#fafafa",
  speed = 1,
  className,
  fps = 30,
  durationInFrames = 90,
  width = 1000,
  height = 500,
}: BoundingBoxSelectorProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const appearDelayMs = (appearAt * frameMs) / safeSpeed;
  const animationDurationMs = (durationMs - appearDelayMs) / safeSpeed;

  const content = children ?? <DefaultPlaceholder />;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height,
    justifyContent: "center",
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
          @keyframes framecn-bbox-appear {
            from {
              opacity: 0;
              transform: scale(0.96);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        <div style={{ display: "inline-block", position: "relative" }}>
          {content}
          <div
            style={{
              animation: `framecn-bbox-appear ${animationDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${appearDelayMs}ms backwards`,
              border: `${borderWidth}px solid ${borderColor}`,
              borderRadius: 4,
              inset: -8,
              pointerEvents: "none",
              position: "absolute",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            <Handle color={handleColor} style={{ left: -6, top: -6 }} />
            <Handle color={handleColor} style={{ right: -6, top: -6 }} />
            <Handle color={handleColor} style={{ bottom: -6, left: -6 }} />
            <Handle color={handleColor} style={{ bottom: -6, right: -6 }} />
            <Handle
              color={handleColor}
              style={{ left: "50%", marginLeft: -5, top: -6 }}
            />
            <Handle
              color={handleColor}
              style={{ bottom: -6, left: "50%", marginLeft: -5 }}
            />
            <Handle
              color={handleColor}
              style={{ left: -6, marginTop: -5, top: "50%" }}
            />
            <Handle
              color={handleColor}
              style={{ marginTop: -5, right: -6, top: "50%" }}
            />
          </div>
        </div>
      </>
    </Timegroup>
  );
};
