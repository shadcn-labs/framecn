// Adapted from HyperFrames captions (https://github.com/heygen-com/hyperframes).
// Copyright 2026 HeyGen, Inc., licensed under the Apache License, Version 2.0.
// Modifications for framecn are licensed under the MIT License.
"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionKineticSlamProps {
  words?: CaptionWord[];
  color?: string;
  fontSize?: number;
  fontWeight?: number | string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { end: 0.35, start: 0, text: "Every" },
  { end: 0.65, start: 0.35, text: "great" },
  { end: 1, start: 0.65, text: "video" },
  { end: 1.45, start: 1.1, text: "starts" },
  { end: 1.65, start: 1.45, text: "with" },
  { end: 1.8, start: 1.65, text: "a" },
  { end: 2.15, start: 1.8, text: "single" },
  { end: 2.7, start: 2.15, text: "frame." },
  { end: 3.2, start: 3, text: "No" },
  { end: 3.9, start: 3.2, text: "timelines." },
  { end: 4.2, start: 4, text: "No" },
  { end: 4.5, start: 4.2, text: "drag" },
  { end: 4.65, start: 4.5, text: "and" },
  { end: 5.1, start: 4.65, text: "drop." },
  { end: 5.55, start: 5.3, text: "Just" },
  { end: 6, start: 5.55, text: "code." },
];

export const CaptionKineticSlam = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  fontSize = 120,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionKineticSlamProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const duration = durationInFrames / fps;
  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${duration * 1000}ms`}
      mode="fixed"
      style={{
        background,
        display: "block",
        height,
        overflow: "hidden",
        position: "relative",
        width,
      }}
    >
      {words.map((word, i) => {
        const end = Math.min(
          word.end,
          words[i + 1]?.start ?? Infinity,
          duration * safeSpeed
        );
        const span = end - word.start;
        const visible = time >= word.start && time < end;
        const entrance = Math.min(
          1,
          Math.max(0, (time - word.start) / Math.min(0.22, span * 0.6))
        );
        const exit = Math.min(
          1,
          Math.max(0, (end - time) / Math.min(0.1, span * 0.25))
        );
        const mode = i % 4;
        const back = 1 + 2.7 * (entrance - 1) ** 3 + 1.7 * (entrance - 1) ** 2;
        const slide = entrance === 1 ? 1 : 1 - 2 ** (-10 * entrance);
        const direction = Number(mode === 2) - Number(mode === 1);
        const x = direction * width * 0.16 * (1 - slide);
        const y = mode === 0 ? -height * 0.12 * (1 - back) : 0;
        const scale = mode === 3 ? 0.4 + back * 0.6 : 1;
        return (
          <div
            key={i}
            data-caption-group={i}
            style={{
              alignItems: "center",
              boxSizing: "border-box",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              opacity: visible ? Math.min(entrance * 3, 1) * exit ** 2 : 0,
              padding: `0 ${width * 0.08}px`,
              pointerEvents: "none",
              position: "absolute",
              visibility: visible ? "visible" : "hidden",
            }}
          >
            <span
              data-caption-word={i}
              style={{
                color,
                display: "block",
                fontFamily:
                  "'Anton', Impact, var(--font-geist-sans, Arial), sans-serif",
                fontSize: Math.min(
                  fontSize,
                  height * 0.3,
                  (width * 0.72) / Math.max(1, word.text.length * 0.8)
                ),
                fontWeight,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                maxWidth: "100%",
                overflowWrap: "anywhere",
                textAlign: "center",
                textShadow: "0 6px 32px rgb(0 0 0 / 0.6)",
                textTransform: "uppercase",
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
              }}
            >
              {word.text}
            </span>
          </div>
        );
      })}
    </Timegroup>
  );
};
