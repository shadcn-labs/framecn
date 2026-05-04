"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface TypewriterProps {
  text?: string;
  cursor?: boolean;
  charsPerSecond?: number;
  speed?: number;
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  fontWeight?: number;
  className?: string;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  background?: string;
}

export const Typewriter = ({
  text = "console.log('hello, world')",
  cursor = true,
  charsPerSecond = 20,
  speed = 1,
  fontSize = 48,
  color = "#171717",
  cursorColor = "#171717",
  fontWeight = 600,
  className,
  fps = 30,
  durationInFrames = 120,
  width = 1000,
  height = 500,
  background = "white",
}: TypewriterProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const typingDurationMs = ((text.length / charsPerSecond) * 1000) / safeSpeed;

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

  const textStyle: CSSProperties = {
    animation: `framecn-typewriter-reveal ${typingDurationMs}ms steps(${text.length}) ${durationMs - typingDurationMs}ms backwards`,
    color,
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize,
    fontWeight,
    letterSpacing: "-0.03em",
    overflow: "hidden",
    whiteSpace: "pre",
  };

  const cursorSpanStyle: CSSProperties = {
    animation: `framecn-typewriter-cursor 1000ms ease-in-out infinite`,
    background: cursorColor,
    display: "inline-block",
    height: "1em",
    marginLeft: "0.04em",
    verticalAlign: "text-bottom",
    width: "0.08em",
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
          @keyframes framecn-typewriter-reveal {
            from {
              width: 0;
              opacity: 0.8;
            }
            to {
              width: 100%;
              opacity: 1;
            }
          }
          @keyframes framecn-typewriter-cursor {
            0%, 50% {
              opacity: 1;
            }
            50.01%, 100% {
              opacity: 0;
            }
          }
        `}</style>
        <span style={textStyle}>
          {text}
          {cursor ? <span style={cursorSpanStyle} /> : null}
        </span>
      </>
    </Timegroup>
  );
};
