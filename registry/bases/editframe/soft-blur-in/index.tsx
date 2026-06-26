"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface SoftBlurInProps {
  text?: string;
  blur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const SoftBlurIn = ({
  text = "Soft blur letters",
  blur = 12,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SoftBlurInProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const frameMs = 1000 / fps;

  const enterMs = (27 * frameMs) / safeSpeed;
  const charStaggerMs = (1 * frameMs) / safeSpeed;

  const chars = [...text];
  const keyframeName = `framecn-sbi-in-${blur}`;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "white",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
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
          @keyframes ${keyframeName} {
            from { opacity: 0; transform: translateY(16px); filter: blur(${blur}px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
        `}</style>
        <span
          style={{
            color,
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            letterSpacing: "-0.03em",
          }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              style={{
                animation: `${keyframeName} ${enterMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * charStaggerMs}ms backwards`,
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </>
    </Timegroup>
  );
};
