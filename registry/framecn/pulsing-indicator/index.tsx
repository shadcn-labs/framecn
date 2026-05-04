"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface PulsingIndicatorProps {
  color?: string;
  size?: number;
  /** Wavelength of the base pulse, in frames. Higher = longer one cycle. */
  period?: number;
  /** Playback speed multiplier (1 = normal, 2 = twice as fast). */
  speed?: number;
  background?: string;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const PulsingIndicator = ({
  color = "#22c55e",
  size = 16,
  period = 8,
  _speed = 1,
  background = "white",
  fps = 30,
  durationInFrames = 90,
  className,
}: PulsingIndicatorProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  // Calculate animation duration based on period
  // Full sine wave cycle = period * 2 * PI frames
  const cycleFrames = period * 2 * Math.PI;
  const cycleMs = (cycleFrames / fps) * 1000;
  const ringCycleMs = cycleMs;

  const style = {
    background,
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-pulse-dot {
            0%, 100% {
              opacity: 0.6;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
          }

          @keyframes framecn-pulse-ring {
            from {
              opacity: 0.7;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(2.6);
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
              height: size,
              position: "relative",
              width: size,
            }}
          >
            {/* Ping ring */}
            <div
              style={{
                animation: `framecn-pulse-ring ${ringCycleMs}ms linear infinite`,
                background: color,
                borderRadius: "50%",
                inset: 0,
                position: "absolute",
                transformOrigin: "center",
              }}
            />
            {/* Solid dot */}
            <div
              style={{
                animation: `framecn-pulse-dot ${cycleMs}ms ease-in-out infinite`,
                background: color,
                borderRadius: "50%",
                inset: 0,
                position: "absolute",
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      </>
    </Timegroup>
  );
};
