"use client";

import type { CSSProperties } from "react";

import { useCurrentFrame, useVideoConfig } from "@/lib/framecn-ui";

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
  opts: {
    fps: number;
    blinkPerSecond: number;
    speed: number;
  }
): number => {
  const cycles = opts.blinkPerSecond <= 0 ? 1 : opts.blinkPerSecond;
  const halfPeriod = opts.fps / cycles / 2;
  if (halfPeriod <= 0) {
    return 1;
  }
  return Math.floor((frame * opts.speed) / halfPeriod) % 2 === 0 ? 1 : 0;
};

export const Caret = ({
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
}: CaretProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedOpacity = (() => {
    if (opacity !== undefined) {
      return opacity;
    }
    if (blink) {
      return caretBlinkOpacity(frame, { blinkPerSecond, fps, speed });
    }
    return 1;
  })();
  return (
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
        ...style,
      }}
    />
  );
};
