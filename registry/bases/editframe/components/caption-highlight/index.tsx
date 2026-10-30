// Adapted from HyperFrames captions (https://github.com/heygen-com/hyperframes).
// Copyright 2026 HeyGen, Inc., licensed under the Apache License, Version 2.0.
// Modifications for framecn are licensed under the MIT License.
"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { useMemo } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionHighlightProps {
  words?: CaptionWord[];
  wordsPerGroup?: number;
  color?: string;
  highlightColor?: string;
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

export const CaptionHighlight = ({
  words = DEFAULT_WORDS,
  wordsPerGroup = 3,
  color = "#ffffff",
  highlightColor = "#ff1745",
  fontSize = 72,
  fontWeight = 800,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionHighlightProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const time = (ownCurrentTimeMs / 1000) * Math.max(0.01, speed);
  const duration = durationInFrames / fps;
  const padding = width * 0.065;
  const groups = useMemo(() => {
    const result: {
      words: CaptionWord[];
      start: number;
      end: number;
      size: number;
    }[] = [];
    const limit = Math.max(1, Math.floor(wordsPerGroup) || 1);
    let first = 0;
    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      const next = words[i + 1];
      if (
        i - first + 1 >= limit ||
        !next ||
        /[,.!?;:]$/.test(word.text) ||
        next.start - word.end >= 0.15
      ) {
        const phrase = words.slice(first, i + 1);
        const characters = phrase.reduce(
          (sum, item) => sum + item.text.length + 1,
          0
        );
        const longest = Math.max(...phrase.map((item) => item.text.length + 1));
        result.push({
          end: Math.min(word.end + 0.18, next?.start ?? Infinity),
          size: Math.min(
            fontSize,
            height * 0.12,
            (width * 0.82) / (longest * 0.8),
            (width * 1.55) / (characters * 0.8)
          ),
          start: words[first].start,
          words: phrase,
        });
        first = i + 1;
      }
    }
    return result;
  }, [words, wordsPerGroup, fontSize, width, height]);

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
      {groups.map((group, gi) => {
        const end = Math.min(group.end, duration * Math.max(0.01, speed));
        const visible = time >= group.start && time < end;
        const entrance = Math.min(
          1,
          Math.max(
            0,
            (time - group.start) / Math.min(0.12, (end - group.start) / 3)
          )
        );
        const exit = Math.min(
          1,
          Math.max(0, (end - time) / Math.min(0.1, (end - group.start) / 3))
        );
        return (
          <div
            key={gi}
            data-caption-group={gi}
            style={{
              alignItems: "flex-end",
              bottom: height * 0.13,
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.12em",
              justifyContent: "center",
              left: 0,
              opacity: visible
                ? Math.min(1 - (1 - entrance) ** 3, exit ** 2)
                : 0,
              paddingInline: padding,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              visibility: visible ? "visible" : "hidden",
            }}
          >
            {group.words.map((word, wi) => {
              const reveal = Math.min(
                1,
                Math.max(
                  0,
                  (time - word.start) /
                    Math.min(0.15, (word.end - word.start) / 2)
                )
              );
              const fade = Math.min(
                1,
                Math.max(0, (word.end + 0.1 - time) / 0.1)
              );
              return (
                <span
                  key={wi}
                  data-caption-word={wi}
                  style={{
                    color,
                    display: "inline-block",
                    fontFamily:
                      "'Montserrat', var(--font-geist-sans, Arial), sans-serif",
                    fontSize: group.size,
                    fontWeight,
                    isolation: "isolate",
                    letterSpacing: "0.02em",
                    lineHeight: 1.15,
                    maxWidth: "100%",
                    overflowWrap: "anywhere",
                    padding: "0.075em 0.15em",
                    position: "relative",
                    textShadow: "0 4px 16px rgb(0 0 0 / 0.45)",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      background: `linear-gradient(135deg, ${highlightColor}, color-mix(in srgb, ${highlightColor} 85%, black))`,
                      borderRadius: "0.12em",
                      boxShadow: `0 0.12em 0.35em color-mix(in srgb, ${highlightColor} 32%, transparent)`,
                      inset: 0,
                      opacity: reveal > 0 ? fade : 0,
                      position: "absolute",
                      transform: `scaleX(${1 - (1 - reveal) ** 3})`,
                      transformOrigin: "left center",
                      zIndex: -1,
                    }}
                  />
                  {word.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </Timegroup>
  );
};
