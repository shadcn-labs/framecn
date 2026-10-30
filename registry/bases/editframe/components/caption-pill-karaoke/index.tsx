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

export interface CaptionPillKaraokeProps {
  words?: CaptionWord[];
  wordsPerSegment?: number;
  activeColor?: string;
  dimColor?: string;
  pillColor?: string;
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

export const CaptionPillKaraoke = ({
  words = DEFAULT_WORDS,
  wordsPerSegment = 6,
  activeColor = "#1a1a1a",
  dimColor = "#a6a6a6",
  pillColor = "#e7e5e7",
  fontSize = 60,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionPillKaraokeProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const duration = durationInFrames / fps;
  const segments = useMemo(() => {
    const result: {
      words: CaptionWord[];
      start: number;
      end: number;
      size: number;
    }[] = [];
    const limit = Math.max(1, Math.floor(wordsPerSegment) || 1);
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
          end: Math.min(word.end + 0.3, next?.start ?? Infinity),
          size: Math.min(
            fontSize,
            height * 0.1,
            (width * 0.72) / (longest * 0.75),
            (width * 1.35) / (characters * 0.75)
          ),
          start: words[first].start,
          words: phrase,
        });
        first = i + 1;
      }
    }
    return result;
  }, [words, wordsPerSegment, fontSize, width, height]);

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
      {segments.map((segment, si) => {
        const visible =
          time >= segment.start &&
          time < Math.min(segment.end, duration * safeSpeed);
        return (
          <div
            key={si}
            data-caption-group={si}
            style={{
              bottom: height * 0.12,
              display: "flex",
              justifyContent: "center",
              left: width * 0.075,
              opacity: visible ? 1 : 0,
              pointerEvents: "none",
              position: "absolute",
              right: width * 0.075,
              visibility: visible ? "visible" : "hidden",
            }}
          >
            <div
              style={{
                background: pillColor,
                borderRadius: "0.36em",
                boxShadow: "0 2px 8px rgb(0 0 0 / 0.12)",
                boxSizing: "border-box",
                display: "flex",
                flexWrap: "wrap",
                fontSize: segment.size,
                gap: "0.08em 0.25em",
                justifyContent: "center",
                maxWidth: "100%",
                padding: "0.25em 0.7em 0.28em",
              }}
            >
              {segment.words.map((word, wi) => {
                // Spoken words stay active, matching the reference's cumulative karaoke.
                const progress =
                  wi === 0
                    ? 1
                    : Math.min(
                        1,
                        Math.max(0, (time - word.start + 0.05) / 0.1)
                      );
                return (
                  <span
                    key={wi}
                    data-caption-word={wi}
                    style={{
                      color: `color-mix(in srgb, ${activeColor} ${progress * 100}%, ${dimColor})`,
                      display: "inline-block",
                      fontFamily:
                        "'Poppins', var(--font-geist-sans, Arial), sans-serif",
                      fontWeight,
                      lineHeight: 1.16,
                      maxWidth: "100%",
                      overflowWrap: "anywhere",
                      textAlign: "center",
                    }}
                  >
                    {word.text.toLowerCase()}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </Timegroup>
  );
};
