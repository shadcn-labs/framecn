"use client";

import type { CSSProperties } from "react";

export interface CaretProps {
  color?: string;
  width?: number;
  height?: number;
  radius?: number;
  opacity?: number;
  blink?: boolean;
  blinkPerSecond?: number;
  speed?: number;
  marginLeft?: number;
  className?: string;
  style?: CSSProperties;
}

export const caretBlinkOpacity = (
  frame: number,
  opts: { fps: number; blinkPerSecond: number; speed: number }
): number => {
  const cycles = opts.blinkPerSecond <= 0 ? 1 : opts.blinkPerSecond;
  const halfPeriod = opts.fps / cycles / 2;
  if (halfPeriod <= 0) {
    return 1;
  }
  return Math.floor((frame * opts.speed) / halfPeriod) % 2 === 0 ? 1 : 0;
};

export function Caret({
  color = "currentColor",
  width = 2,
  height = 18,
  radius = 1,
  opacity,
  blink = false,
  blinkPerSecond = 1,
  speed = 1,
  marginLeft = 0,
  className,
  style,
}: CaretProps) {
  const blinkDuration = `${1 / (blinkPerSecond * speed)}s`;
  const blinkStyle = blink
    ? { animation: `editframe-blink ${blinkDuration} step-end infinite` }
    : {};

  const resolvedOpacity =
    opacity !== undefined ? opacity : blink ? undefined : 1;

  return (
    <>
      <style>{`@keyframes editframe-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      <span
        className={className}
        style={{
          background: color,
          borderRadius: radius,
          display: "inline-block",
          flexShrink: 0,
          height,
          marginLeft,
          opacity: resolvedOpacity,
          width,
          ...blinkStyle,
          ...style,
        }}
      />
    </>
  );
}
