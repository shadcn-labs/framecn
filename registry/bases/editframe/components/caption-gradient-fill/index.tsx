// Adapted from HyperFrames captions (https://github.com/heygen-com/hyperframes).
// Copyright 2026 HeyGen, Inc., licensed under the Apache License, Version 2.0.
// Modifications for framecn are licensed under the MIT License.
"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { useMemo } from "react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionGradientFillProps {
  words?: CaptionWord[];
  fromColor?: string;
  midColor?: string;
  toColor?: string;
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

const WORDS_PER_GROUP = 3;

export const CaptionGradientFill = ({
  words = DEFAULT_WORDS,
  fromColor = "#fe9f1b",
  midColor = "#ff2063",
  toColor = "#ef7aff",
  fontSize = 80,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionGradientFillProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.min(80, width * 0.0625);
  const groups = useMemo(() => {
    const phrases: CaptionWord[][] = [];
    let phrase: CaptionWord[] = [];
    for (const [index, word] of words.entries()) {
      phrase.push(word);
      const next = words[index + 1];
      if (
        phrase.length >= WORDS_PER_GROUP ||
        /[,.:;!?]["')\]]*$/u.test(word.text) ||
        !next ||
        next.start - word.end >= 0.15
      ) {
        phrases.push(phrase);
        phrase = [];
      }
    }
    return phrases.map((phraseWords, index) => {
      const end = Math.min(
        (durationMs / 1000) * safeSpeed,
        phrases[index + 1]?.[0].start ?? Infinity,
        (phraseWords.at(-1)?.end ?? 0) + 0.18
      );
      const characters = phraseWords.reduce(
        (total, word) => total + word.text.length + 1,
        0
      );
      const longest = Math.max(...phraseWords.map((word) => word.text.length));
      return {
        end,
        fontSize: Math.min(
          fontSize,
          height * 0.16,
          (width - padding * 2) / Math.max(1, longest * 0.8),
          ((width - padding * 2) * 1.65) / Math.max(1, characters * 0.8)
        ),
        start: phraseWords[0].start,
        words: phraseWords.map((word, wordIndex) => ({
          ...word,
          end: Math.min(
            word.end,
            phraseWords[wordIndex + 1]?.start ?? end,
            end
          ),
        })),
      };
    });
  }, [words, durationMs, safeSpeed, fontSize, width, height, padding]);

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };
  const gradientImage = `linear-gradient(90deg, ${fromColor}, ${midColor} 50%, ${toColor})`;

  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <div
        style={{
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
          position: "absolute",
        }}
      >
        {groups.map((group, groupIndex) => {
          const visible = time >= group.start && time < group.end;
          return (
            <div
              key={groupIndex}
              data-caption-group={groupIndex}
              style={{
                alignItems: "baseline",
                bottom: height * 0.15,
                boxSizing: "border-box",
                display: "flex",
                flexWrap: "wrap",
                fontFamily: "'Montserrat', 'Arial Black', Arial, sans-serif",
                fontSize: group.fontSize,
                fontWeight,
                gap: "0.16em 0.3em",
                justifyContent: "center",
                left: 0,
                letterSpacing: "0.04em",
                lineHeight: 1.15,
                opacity: visible ? 1 : 0,
                overflow: "visible",
                padding: `0 ${padding}px`,
                position: "absolute",
                right: 0,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {group.words.map((word, wordIndex) => {
                const active = time >= word.start && time < word.end;
                const progress = active
                  ? Math.min(
                      1,
                      (time - word.start) /
                        Math.max(0.001, word.end - word.start)
                    )
                  : 0;
                return (
                  <span
                    key={wordIndex}
                    data-caption-word={word.text}
                    style={{
                      display: "inline-grid",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflowWrap: "anywhere",
                      paddingBottom: "0.05em",
                      transform: `scale(${active ? 1.04 : 1})`,
                    }}
                  >
                    <span style={{ color: "#ffffff", gridArea: "1 / 1" }}>
                      {word.text}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        backgroundImage: gradientImage,
                        clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
                        color: "transparent",
                        gridArea: "1 / 1",
                        opacity: active ? 1 : 0,
                      }}
                    >
                      {word.text}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </Timegroup>
  );
};
