"use client";

import { useCurrentFrame, useVideoConfig } from "@/lib/framecn-ui";

export interface TypingIndicatorProps {
  dotCount?: number;
  color?: string;
  size?: number;
  gap?: number;
  amplitude?: number;
  speed?: number;
  cyclesPerSecond?: number;
  className?: string;
}

export interface TypingDotOptions {
  fps: number;
  dotCount: number;
  amplitude: number;
  speed: number;
  cyclesPerSecond: number;
}

export const typingDotOffset = (
  frame: number,
  index: number,
  opts: TypingDotOptions
): {
  translateY: number;
  opacity: number;
} => {
  const cps = opts.cyclesPerSecond <= 0 ? 1 : opts.cyclesPerSecond;
  const periodFrames = opts.fps / cps;
  const stagger = opts.dotCount > 0 ? periodFrames / (opts.dotCount * 2) : 0;
  const phase =
    ((frame * opts.speed - index * stagger) / periodFrames) * Math.PI * 2;
  const wave = (Math.sin(phase) + 1) / 2;
  return {
    opacity: 0.45 + 0.55 * wave,
    translateY: -opts.amplitude * wave,
  };
};

export const TypingIndicator = ({
  dotCount = 3,
  color = "currentColor",
  size = 8,
  gap = 5,
  amplitude = 5,
  speed = 1,
  cyclesPerSecond = 1.1,
  className,
}: TypingIndicatorProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opts: TypingDotOptions = {
    amplitude,
    cyclesPerSecond,
    dotCount,
    fps,
    speed,
  };
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        gap,
        height: size + amplitude * 2,
      }}
    >
      {Array.from({ length: dotCount }, (_, i) => {
        const { translateY, opacity } = typingDotOffset(frame, i, opts);
        return (
          <span
            key={i}
            style={{
              background: color,
              borderRadius: "50%",
              display: "inline-block",
              height: size,
              opacity,
              transform: `translateY(${translateY}px)`,
              width: size,
            }}
          />
        );
      })}
    </div>
  );
};
