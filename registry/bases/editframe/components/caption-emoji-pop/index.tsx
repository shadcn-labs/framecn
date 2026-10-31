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

export interface CaptionEmojiPopProps {
  words?: CaptionWord[];
  color?: string;
  accentColor?: string;
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

const EMOJI_MAP: Record<string, string> = {
  cinema: "🎥",
  code: "⌨️",
  frame: "🖼️",
  html: "💻",
  hyperframes: "🎬",
  professional: "✨",
  video: "📹",
};
const KEYWORDS: Record<string, true> = {
  cinema: true,
  code: true,
  html: true,
  hyperframes: true,
  professional: true,
};
const TRANSITION_WORDS: Record<string, true> = Object.fromEntries(
  [
    "a",
    "about",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "been",
    "but",
    "by",
    "can",
    "could",
    "did",
    "do",
    "does",
    "for",
    "from",
    "had",
    "has",
    "have",
    "if",
    "in",
    "is",
    "it",
    "its",
    "just",
    "may",
    "might",
    "must",
    "no",
    "not",
    "of",
    "on",
    "or",
    "out",
    "should",
    "so",
    "that",
    "the",
    "then",
    "these",
    "this",
    "those",
    "to",
    "up",
    "was",
    "were",
    "will",
    "with",
    "would",
    "yes",
  ].map((word) => [word, true])
);

export const CaptionEmojiPop = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  accentColor = "#FF76FF",
  fontSize = 72,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionEmojiPopProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const duration = durationInFrames / fps;
  const transcriptEnd = duration * safeSpeed;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.max(12, width * (100 / 1920));
  const safeWidth = Math.max(
    1,
    Math.min(width - padding * 2, width * (1400 / 1920))
  );
  const groups = useMemo(() => {
    const result: {
      words: { text: string; color: string }[];
      emoji: string | null;
      start: number;
      end: number;
      size: number;
    }[] = [];
    const accents = [accentColor, "#FF0002", "#B2F7FF"];
    const maxWords = Math.max(1, Math.floor(WORDS_PER_GROUP));
    let start = 0;
    for (let i = 0; i < words.length; i += 1) {
      const pause = (words[i + 1]?.start ?? words[i].end) - words[i].end;
      if (
        i - start + 1 >= maxWords ||
        /[,.;:!?]["')\]]?$/u.test(words[i].text) ||
        pause >= 0.15 ||
        i === words.length - 1
      ) {
        const phrase = words.slice(start, i + 1);
        const groupIndex = result.length;
        let emoji: string | null = null;
        const styledWords = phrase.map((word, wi) => {
          const clean = word.text.toLowerCase().replaceAll(/[^a-z]/gu, "");
          if (!emoji && Object.hasOwn(EMOJI_MAP, clean)) {
            emoji = EMOJI_MAP[clean];
          }
          // The reference's seeded color assignment is computed once, never per frame.
          const isKeyword = Object.hasOwn(KEYWORDS, clean);
          const seed = isKeyword
            ? groupIndex * 23 + wi * 31
            : groupIndex * 13 + wi;
          const value = Math.sin(seed * 9999) * 10_000;
          const sample = value - Math.floor(value);
          const accented =
            isKeyword ||
            (!Object.hasOwn(TRANSITION_WORDS, clean) && sample > 0.55);
          return {
            color: accented
              ? accents[Math.floor(sample * accents.length) % accents.length]
              : color,
            text: word.text,
          };
        });
        const longest = Math.max(
          ...phrase.map((word) => [...word.text.toUpperCase()].length),
          1
        );
        const chars = phrase.reduce(
          (total, word) => total + [...word.text].length,
          0
        );
        result.push({
          emoji,
          end: Math.min(
            words[i].end + 0.18,
            words[i + 1]?.start ?? transcriptEnd,
            transcriptEnd
          ),
          size: Math.min(
            fontSize,
            height * 0.14,
            safeWidth / (longest * 1.08),
            safeWidth / Math.max(1, chars * 0.72 + (phrase.length - 1) * 0.2)
          ),
          start: phrase[0].start,
          words: styledWords,
        });
        start = i + 1;
      }
    }
    return result;
  }, [words, accentColor, color, fontSize, height, safeWidth, transcriptEnd]);

  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${duration * 1000}ms`}
      mode="fixed"
      style={{
        background,
        height,
        overflow: "hidden",
        position: "relative",
        width,
      }}
    >
      {groups.map((group, gi) => {
        const visible = time >= group.start && time < group.end;
        const entryDuration = Math.min(
          4 / fps,
          (group.end - group.start) * 0.35
        );
        const exitDuration = Math.min(
          3 / fps,
          (group.end - group.start) * 0.25
        );
        const entry =
          1 -
          (1 -
            Math.max(
              0,
              Math.min(1, (time - group.start) / Math.max(0.001, entryDuration))
            )) **
            4;
        const exit =
          Math.max(
            0,
            Math.min(
              1,
              (time - (group.end - exitDuration)) /
                Math.max(0.001, exitDuration)
            )
          ) ** 3;
        return (
          <div
            key={gi}
            data-caption-group={gi}
            style={{
              alignItems: "center",
              bottom: height * (160 / 1080),
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: group.size * 0.2,
              left: 0,
              opacity: visible ? entry * (1 - exit * 0.2) : 0,
              overflow: "visible",
              padding: `0 ${padding}px`,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              transform: `scaleX(${0.8 + entry * 0.2 - exit * 0.25})`,
              transformOrigin: "50% 50%",
            }}
          >
            {group.emoji && (
              <span
                aria-hidden="true"
                style={{
                  fontFamily:
                    "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                  fontSize: group.size * (56 / 72),
                  lineHeight: 1,
                }}
              >
                {group.emoji}
              </span>
            )}
            <div
              style={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                fontSize: group.size,
                gap: "0.2em",
                justifyContent: "center",
                maxWidth: safeWidth,
              }}
            >
              {group.words.map((word, wi) => (
                <span
                  key={wi}
                  data-caption-word={word.text}
                  style={{
                    WebkitTextStroke: `${Math.max(1, group.size * (3 / 72))}px #000000`,
                    color: word.color,
                    display: "inline-block",
                    fontFamily: "'Gabarito', 'Arial Black', Arial, sans-serif",
                    fontSize: "inherit",
                    fontWeight,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    maxWidth: "100%",
                    overflowWrap: "anywhere",
                    paintOrder: "stroke fill",
                    textShadow: `0 4px 8px rgba(0,0,0,.7), 0 0 2px ${word.color}, 0 0 8px ${word.color}`,
                    textTransform: "uppercase",
                  }}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </Timegroup>
  );
};
