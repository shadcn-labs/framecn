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

export interface CaptionNeonAccentProps {
  words?: CaptionWord[];
  accentWords?: string[];
  color?: string;
  accentColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  accentScale?: number;
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
const DEFAULT_ACCENT_WORDS = ["frame.", "code."];

export const CaptionNeonAccent = ({
  words = DEFAULT_WORDS,
  accentWords = DEFAULT_ACCENT_WORDS,
  color = "#ffffff",
  accentColor = "#a855f7",
  fontSize = 64,
  fontWeight = 700,
  accentScale = 1.5,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionNeonAccentProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.min(80, width * 0.0625);
  const clampedScale = Math.max(1.2, Math.min(2.5, accentScale));
  const groups = useMemo(() => {
    const accents = new Set(accentWords);
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
        (total, word) =>
          total +
          (word.text.length + 1) * (accents.has(word.text) ? clampedScale : 1),
        0
      );
      const longest = Math.max(
        ...phraseWords.map(
          (word) =>
            word.text.length * (accents.has(word.text) ? clampedScale : 1)
        )
      );
      return {
        end,
        fontSize: Math.min(
          fontSize,
          (height * 0.16) / clampedScale,
          (width - padding * 2) / Math.max(1, longest * 0.8),
          ((width - padding * 2) * 1.6) / Math.max(1, characters * 0.8)
        ),
        start: phraseWords[0].start,
        words: phraseWords.map((word, wordIndex) => ({
          ...word,
          accent: accents.has(word.text),
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
    accentWords,
    clampedScale,
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
          const age = Math.max(0, time - group.start);
          const entryDuration = Math.min(7 / 30, (group.end - group.start) / 2);
          const entry = Math.min(1, age / Math.max(0.001, entryDuration));
          const ease = 1 - (1 - entry) ** 3;
          const drift =
            (1 - Math.cos(age * Math.PI * 1.3)) * 7 * (groupIndex % 2 ? 1 : -1);
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
                gap: "0.16em 0.25em",
                justifyContent: "center",
                left: 0,
                lineHeight: 1.1,
                opacity: visible ? ease : 0,
                overflow: "visible",
                padding: `0 ${padding}px`,
                position: "absolute",
                right: 0,
                textAlign: "center",
                textTransform: "uppercase",
                transform: `translate(${drift}px, ${drift}px) scale(${0.65 + 0.35 * ease})`,
                transformOrigin: "50% 100%",
              }}
            >
              {group.words.map((word, wordIndex) => {
                const active = time >= word.start && time < word.end;
                const progress = active
                  ? (time - word.start) / Math.max(0.001, word.end - word.start)
                  : 0;
                const pulse = active
                  ? Math.min(1, progress / 0.12, (1 - progress) / 0.12)
                  : 0;
                return (
                  <span
                    key={wordIndex}
                    data-caption-word={word.text}
                    style={{
                      display: "inline-grid",
                      fontSize: word.accent ? `${clampedScale}em` : "1em",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflowWrap: "anywhere",
                    }}
                  >
                    <span style={{ color, gridArea: "1 / 1" }}>
                      {word.text}
                    </span>
                    {word.accent && (
                      <span
                        aria-hidden="true"
                        style={{
                          color: accentColor,
                          gridArea: "1 / 1",
                          opacity: pulse,
                          textShadow: `0 0 4px ${accentColor}, 0 0 10px ${accentColor}, 0 0 25px ${accentColor}, 0 0 45px ${accentColor}`,
                        }}
                      >
                        {word.text}
                      </span>
                    )}
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
