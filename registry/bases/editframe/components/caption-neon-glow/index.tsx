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

export interface CaptionNeonGlowProps {
  words?: CaptionWord[];
  glowColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  wordsPerGroup?: number;
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

export const CaptionNeonGlow = ({
  words = DEFAULT_WORDS,
  glowColor = "#00fff0",
  fontSize = 80,
  fontWeight = 900,
  wordsPerGroup = 6,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionNeonGlowProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.min(80, width * 0.0625);
  const groupLimit = Math.max(
    1,
    Math.floor(Number.isFinite(wordsPerGroup) ? wordsPerGroup : 6)
  );
  const groups = useMemo(() => {
    const phrases: CaptionWord[][] = [];
    let phrase: CaptionWord[] = [];
    for (const [index, word] of words.entries()) {
      phrase.push(word);
      const next = words[index + 1];
      if (
        phrase.length >= groupLimit ||
        /[,.:;!?]["')\]]*$/.test(word.text) ||
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
  }, [
    words,
    groupLimit,
    durationMs,
    safeSpeed,
    fontSize,
    width,
    height,
    padding,
  ]);

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

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
          const entry = Math.min(
            1,
            Math.max(
              0,
              (time - group.start) /
                Math.max(0.001, Math.min(0.14, (group.end - group.start) / 2))
            )
          );
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
                fontFamily: "'Outfit', 'Arial Black', Arial, sans-serif",
                fontSize: group.fontSize,
                fontWeight,
                gap: "0.16em 0.3em",
                justifyContent: "center",
                left: 0,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                opacity: visible ? 1 : 0,
                overflow: "visible",
                padding: `0 ${padding}px`,
                position: "absolute",
                right: 0,
                textAlign: "center",
                textTransform: "uppercase",
                transform: `translateX(${-8 * (1 - entry) ** 3}px)`,
              }}
            >
              {group.words.map((word, wordIndex) => {
                const active = time >= word.start && time < word.end;
                const progress = active
                  ? (time - word.start) / Math.max(0.001, word.end - word.start)
                  : 0;
                const pulse = active
                  ? Math.min(1, progress / 0.15, (1 - progress) / 0.15)
                  : 0;
                return (
                  <span
                    key={wordIndex}
                    data-caption-word={word.text}
                    style={{
                      color: glowColor,
                      display: "inline-grid",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflowWrap: "anywhere",
                    }}
                  >
                    <span style={{ gridArea: "1 / 1", opacity: 0.14 }}>
                      {word.text}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        gridArea: "1 / 1",
                        opacity: pulse,
                        textShadow: `0 0 10px ${glowColor}, 0 0 35px ${glowColor}, 0 0 90px ${glowColor}`,
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
