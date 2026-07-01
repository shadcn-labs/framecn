"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultContent = () => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)",
      borderRadius: 24,
      boxShadow: "0 20px 60px rgba(14,165,233,0.35)",
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 48,
      fontWeight: 700,
      height: 200,
      justifyContent: "center",
      letterSpacing: "-0.03em",
      width: 320,
    }}
  >
    Zoom
  </div>
);

export interface ZoomThroughTransitionProps {
  children?: ReactNode;
  targetScale?: number;
  transformOrigin?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const ZoomThroughTransition = ({
  children,
  targetScale = 20,
  transformOrigin = "center center",
  background = "white",
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: ZoomThroughTransitionProps) => {
  const durationMs = ((durationInFrames / fps) * 1000) / speed;
  const fadeStartPercent = 70;

  const style = {
    background,
    display: "block",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  const content = children ?? <DefaultContent />;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-ztt-scale {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(${targetScale});
            }
          }

          @keyframes framecn-ztt-opacity {
            ${fadeStartPercent}% {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}</style>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <div
            style={{
              animation: `
                framecn-ztt-scale ${durationMs}ms cubic-bezier(0.7, 0, 0.84, 0) forwards,
                framecn-ztt-opacity ${durationMs}ms linear forwards
              `,
              transformOrigin,
              willChange: "transform, opacity",
            }}
          >
            {content}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
