"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface PerWordCrossfadeProps {
  fromText?: string;
  toText?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const PerWordCrossfade = ({
  fromText = "Hello world",
  toText = "New world",
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: PerWordCrossfadeProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const exitWordMs = (15 * frameMs) / safeSpeed;
  const exitStaggerMs = (1 * frameMs) / safeSpeed;
  const enterWordMs = (21 * frameMs) / safeSpeed;
  const enterStaggerMs = (2 * frameMs) / safeSpeed;

  const fromWords = fromText.split(" ");
  const toWords = toText.split(" ");

  const lastFromExitEnd = (fromWords.length - 1) * exitStaggerMs + exitWordMs;
  const enterStartMs = lastFromExitEnd - (3 * frameMs) / safeSpeed;

  const textStyle: CSSProperties = {
    color,
    display: "flex",
    fontFamily: FONT_FAMILY,
    fontSize,
    fontWeight,
    gap: "0.25em",
    left: "50%",
    letterSpacing: "-0.03em",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    whiteSpace: "nowrap",
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          alignItems: "center",
          background: "white",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-pwcf-exit {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-6px); }
          }
          @keyframes framecn-pwcf-enter {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ height: 0, position: "relative", width: 0 }}>
          <div style={textStyle}>
            {fromWords.map((word, i) => (
              <span
                key={i}
                style={{
                  animation: `framecn-pwcf-exit ${exitWordMs}ms ease-in ${i * exitStaggerMs}ms forwards`,
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <div style={textStyle}>
            {toWords.map((word, j) => (
              <span
                key={j}
                style={{
                  animation: `framecn-pwcf-enter ${enterWordMs}ms cubic-bezier(0.22,1,0.36,1) ${enterStartMs + j * enterStaggerMs}ms backwards`,
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
