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

export interface CaptionWeightShiftProps {
  words?: CaptionWord[];
  color?: string;
  activeColor?: string;
  dimColor?: string;
  fontSize?: number;
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

export const CaptionWeightShift = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  activeColor = "#ffffff",
  dimColor = "rgba(255,255,255,0.35)",
  fontSize = 72,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionWeightShiftProps) => {
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
      let split = phraseWords.length;
      let difference = Infinity;
      for (let candidate = 1; candidate < phraseWords.length; candidate += 1) {
        const first = phraseWords
          .slice(0, candidate)
          .reduce((sum, word) => sum + word.text.length + 1, 0);
        const second = phraseWords
          .slice(candidate)
          .reduce((sum, word) => sum + word.text.length + 1, 0);
        if (Math.abs(first - second) < difference) {
          difference = Math.abs(first - second);
          split = candidate;
        }
      }
      const timedWords = phraseWords.map((word, wordIndex) => ({
        ...word,
        end: Math.min(word.end, phraseWords[wordIndex + 1]?.start ?? end, end),
      }));
      const lines = [timedWords.slice(0, split)];
      if (split < timedWords.length) {
        lines.push(timedWords.slice(split));
      }
      const longestLine = Math.max(
        ...lines.map((line) =>
          line.reduce((sum, word) => sum + word.text.length + 1, 0)
        )
      );
      return {
        end,
        fontSize: Math.min(
          fontSize,
          height * 0.16,
          (width - padding * 2) / Math.max(1, longestLine * 0.75)
        ),
        lines,
        start: phraseWords[0].start,
        switchDuration: lines[1]
          ? Math.min(
              0.1,
              Math.max(0.001, lines[1][0].end - lines[1][0].start) / 2
            )
          : 0.1,
        switchTime: lines[1]?.[0].start ?? Infinity,
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
                Math.max(0.001, Math.min(0.1, (group.end - group.start) / 2))
            )
          );
          const ease = 1 - (1 - entry) ** 3;
          const shift = Math.max(
            0,
            Math.min(1, (time - group.switchTime) / group.switchDuration)
          );
          return (
            <div
              key={groupIndex}
              data-caption-group={groupIndex}
              style={{
                alignItems: "center",
                bottom: height * 0.15,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                fontFamily: "'Montserrat', Arial, sans-serif",
                fontSize: group.fontSize,
                gap: "0.08em",
                left: 0,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                opacity: visible ? ease : 0,
                overflow: "visible",
                padding: `0 ${padding}px`,
                position: "absolute",
                right: 0,
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                textTransform: "lowercase",
                transform: `scale(${0.85 + 0.15 * ease})`,
                transformOrigin: "50% 100%",
              }}
            >
              {group.lines.map((line, lineIndex) => {
                const bold = lineIndex === 0 ? 1 - shift : shift;
                return (
                  <div
                    key={lineIndex}
                    style={{
                      alignItems: "baseline",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.12em 0.18em",
                      justifyContent: "center",
                      maxWidth: "100%",
                    }}
                  >
                    {line.map((word, wordIndex) => {
                      const active = time >= word.start && time < word.end;
                      let wordColor = color;
                      if (active) {
                        wordColor = activeColor;
                      } else if (time < word.start) {
                        wordColor = dimColor;
                      }
                      return (
                        <span
                          key={wordIndex}
                          data-caption-word={word.text}
                          style={{
                            color: wordColor,
                            display: "inline-grid",
                            maxWidth: "100%",
                            minWidth: 0,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {/* Both weights occupy one grid cell, so switching never reflows the line. */}
                          <span
                            style={{
                              fontWeight: 300,
                              gridArea: "1 / 1",
                              opacity: 1 - bold,
                            }}
                          >
                            {word.text}
                          </span>
                          <span
                            aria-hidden="true"
                            style={{
                              fontWeight: 700,
                              gridArea: "1 / 1",
                              opacity: bold,
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
          );
        })}
      </div>
    </Timegroup>
  );
};
