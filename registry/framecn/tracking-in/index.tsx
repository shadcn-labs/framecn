"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface TrackingInProps {
  text?: string;
  startTracking?: number;
  startBlur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const TrackingIn = ({
  text = "Tracking In",
  startTracking = 0.5,
  startBlur = 12,
  fontSize = 96,
  color = "#171717",
  fontWeight = 700,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: TrackingInProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const opacityDurationMs = (15 * frameMs) / speed;
  const mainAnimationDurationMs = durationMs / speed;

  const style = {
    background: "white",
    display: "block",
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup duration={`${durationMs}ms`} mode="fixed" style={style}>
      <>
        <style>{`
          @keyframes framecn-tracking-in-letter-spacing {
            from {
              letter-spacing: ${startTracking}em;
            }
            to {
              letter-spacing: -0.03em;
            }
          }

          @keyframes framecn-tracking-in-blur {
            from {
              filter: blur(${startBlur}px);
            }
            to {
              filter: blur(0px);
            }
          }

          @keyframes framecn-tracking-in-opacity {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
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
          <span
            className={className}
            style={{
              animation: `
                framecn-tracking-in-letter-spacing ${mainAnimationDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards,
                framecn-tracking-in-blur ${mainAnimationDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards,
                framecn-tracking-in-opacity ${opacityDurationMs}ms ease-out backwards
              `,
              color,
              fontFamily:
                "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize,
              fontWeight,
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </div>
      </>
    </Timegroup>
  );
};
