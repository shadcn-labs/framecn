"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface SlotMachineRollProps {
  from?: string;
  to?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const SlotMachineRoll = ({
  from = "$99",
  to = "$199",
  fontSize = 120,
  color = "#171717",
  fontWeight = 700,
  speed = 1,
  fps = 30,
  durationInFrames = 45,
  className,
}: SlotMachineRollProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const staggerMs = ((4 / fps) * 1000) / speed;

  const len = Math.max(from.length, to.length);
  const paddedFrom = from.padStart(len, " ");
  const paddedTo = to.padStart(len, " ");

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
          @keyframes framecn-slot-roll {
            0% {
              transform: translateY(0);
            }
            70% {
              transform: translateY(-1.05em);
            }
            85% {
              transform: translateY(-1.12em);
            }
            100% {
              transform: translateY(-1.1em);
            }
          }
        `}</style>
        <span
          style={{
            color,
            display: "inline-block",
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {Array.from({ length: len }, (_, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                height: "1.1em",
                lineHeight: "1.1em",
                overflow: "hidden",
                textAlign: "center",
                verticalAlign: "top",
                width: "0.7em",
              }}
            >
              <span
                style={{
                  animation: `framecn-slot-roll ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * staggerMs}ms forwards`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>{paddedFrom[i]}</span>
                <span>{paddedTo[i]}</span>
              </span>
            </span>
          ))}
        </span>
      </>
    </Timegroup>
  );
};
