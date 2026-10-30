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

export interface CaptionMatrixDecodeProps {
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

const WORDS_PER_GROUP = 3;

const DECODE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const scramble = (text: string, seed: number) => {
  let result = "";
  for (let index = 0; index < text.length; index += 1) {
    const hash = ((seed + index * 137 + 1) * 48_271) % 2_147_483_647;
    result += /\s|[.,!?;:]/u.test(text[index])
      ? text[index]
      : DECODE_CHARACTERS[hash % DECODE_CHARACTERS.length];
  }
  return result;
};

export const CaptionMatrixDecode = ({
  words = DEFAULT_WORDS,
  color = "#00ff41",
  fontSize = 80,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionMatrixDecodeProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const compositionEnd = (durationMs / 1000) * safeSpeed;
  const padding = Math.min(80, Math.max(16, width * 0.06));
  const groups = useMemo(() => {
    const result: {
      words: { word: CaptionWord; scrambles: string[] }[];
      start: number;
      end: number;
      characters: number;
    }[] = [];
    let current: CaptionWord[] = [];
    const finish = () => {
      if (!current.length) {
        return;
      }
      const index = result.length;
      result.push({
        characters: current.reduce(
          (count, word) => count + word.text.length + 1,
          0
        ),
        end: (current.at(-1)?.end ?? 0) + 0.18,
        start: current[0].start,
        words: current.map((word, wi) => ({
          scrambles: [
            scramble(word.text, index * 1000 + wi * 31),
            scramble(word.text, index * 1000 + wi * 31 + 7),
          ],
          word,
        })),
      });
      current = [];
    };
    for (const [index, word] of words.entries()) {
      current.push(word);
      const next = words[index + 1];
      if (
        current.length >= WORDS_PER_GROUP ||
        /[.!?,;:]["')\]]?$/u.test(word.text) ||
        !next ||
        next.start - word.end >= 0.15 - 1e-6
      ) {
        finish();
      }
    }
    finish();
    for (const [index, group] of result.entries()) {
      group.end = Math.min(group.end, result[index + 1]?.start ?? Infinity);
    }
    return result;
  }, [words]);

  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={{
        background,
        height,
        overflow: "hidden",
        position: "relative",
        width,
      }}
    >
      <div
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,255,65,0.04) 3px 4px)",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      {groups.map((group, gi) => {
        const end = Math.min(group.end, compositionEnd);
        const visible = time >= group.start && time < end;
        const fittedSize = Math.min(
          fontSize,
          height * 0.16,
          (width - padding * 2) / Math.max(1, group.characters * 0.68)
        );
        return (
          <div
            key={gi}
            data-caption-group={gi}
            style={{
              alignItems: "baseline",
              bottom: height * 0.15,
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "'Space Grotesk', 'Courier New', monospace",
              fontSize: fittedSize,
              fontWeight,
              gap: "0.3em",
              justifyContent: "center",
              left: 0,
              lineHeight: 1.15,
              opacity: visible ? 1 : 0,
              overflow: "visible",
              padding: `0 ${padding}px`,
              position: "absolute",
              right: 0,
            }}
          >
            {group.words.map(({ word, scrambles }, wi) => {
              // Two actual scrambled glyph states precede the real text, as in the reference.
              // Compress the decode for short words so the correct text is readable in time.
              const decodeDuration = Math.min(
                0.2,
                Math.max(0, word.end - word.start) * 0.55
              );
              const elapsed = time - word.start;
              const phase =
                decodeDuration > 0
                  ? Math.min(2, Math.floor((elapsed / decodeDuration) * 2))
                  : 2;
              return (
                <span
                  key={wi}
                  data-caption-word={word.text}
                  aria-label={word.text}
                  style={{
                    color,
                    display: "inline-grid",
                    letterSpacing: "0.04em",
                    maxWidth: "100%",
                    opacity: elapsed >= 0 ? 1 : 0,
                    overflowWrap: "anywhere",
                    textShadow: phase < 2 ? `0 0 0.12em ${color}` : "none",
                  }}
                >
                  <span
                    style={{
                      gridArea: "1 / 1",
                      visibility: phase >= 2 ? "visible" : "hidden",
                    }}
                  >
                    {word.text}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      gridArea: "1 / 1",
                      visibility: phase < 2 ? "visible" : "hidden",
                    }}
                  >
                    {scrambles[Math.max(0, phase)] ?? ""}
                  </span>
                </span>
              );
            })}
          </div>
        );
      })}
    </Timegroup>
  );
};
