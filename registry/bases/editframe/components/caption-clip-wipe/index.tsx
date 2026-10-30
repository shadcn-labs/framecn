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

export interface CaptionClipWipeProps {
  words?: CaptionWord[];
  keywords?: string[];
  color?: string;
  keywordColor?: string;
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
const DEFAULT_KEYWORDS = ["single", "code."];
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export const CaptionClipWipe = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  color = "#ffffff",
  keywordColor = "#FFD700",
  fontSize = 72,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionClipWipeProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const duration = durationInFrames / fps;
  const transcriptEnd = duration * safeSpeed;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.max(12, width * (100 / 1920));
  const safeWidth = Math.max(1, width - padding * 2);
  const groups = useMemo(() => {
    const result: {
      words: CaptionWord[];
      start: number;
      end: number;
      size: number;
    }[] = [];
    const maxWords = Math.max(1, Math.floor(WORDS_PER_GROUP));
    let start = 0;
    for (let i = 0; i < words.length; i += 1) {
      const pause = (words[i + 1]?.start ?? words[i].end) - words[i].end;
      if (
        i - start + 1 >= maxWords ||
        /[,.;:!?]["')\]]?$/.test(words[i].text) ||
        pause >= 0.15 ||
        i === words.length - 1
      ) {
        const phrase = words.slice(start, i + 1);
        const longest = Math.max(
          ...phrase.map((word) => [...word.text.toUpperCase()].length),
          1
        );
        const chars = phrase.reduce(
          (total, word) => total + [...word.text].length,
          0
        );
        result.push({
          end: Math.min(
            words[i].end + 0.18,
            words[i + 1]?.start ?? transcriptEnd,
            transcriptEnd
          ),
          size: Math.min(
            fontSize,
            height * 0.16,
            safeWidth / (longest * 1.08),
            safeWidth / Math.max(1, chars * 0.7 + (phrase.length - 1) * 0.3)
          ),
          start: phrase[0].start,
          words: phrase,
        });
        start = i + 1;
      }
    }
    return result;
  }, [words, transcriptEnd, fontSize, height, safeWidth]);
  const keywordSet = useMemo(
    () =>
      new Set(
        keywords.map((word) =>
          word.toLowerCase().replaceAll(/[^\p{L}\p{N}]/gu, "")
        )
      ),
    [keywords]
  );

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
        const exitDuration = Math.min(0.2, (group.end - group.start) * 0.25);
        return (
          <div
            key={gi}
            data-caption-group={gi}
            style={{
              alignItems: "baseline",
              bottom: height * (120 / 1080),
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              fontSize: group.size,
              gap: "0.28em",
              justifyContent: "center",
              left: 0,
              opacity: visible ? 1 : 0,
              overflow: "visible",
              padding: `0 ${padding}px`,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
            }}
          >
            {group.words.map((word, wi) => {
              const wordWindow = Math.max(
                0.001,
                Math.min(
                  word.end,
                  group.words[wi + 1]?.start ?? group.end,
                  group.end
                ) - word.start
              );
              const entryDuration = Math.min(0.3, wordWindow * 0.7);
              const entry =
                1 - (1 - clamp((time - word.start) / entryDuration)) ** 3;
              const exitStart = Math.max(
                word.start + entryDuration,
                group.end - exitDuration + wi * exitDuration * 0.12
              );
              const exit =
                clamp(
                  (time - exitStart) / Math.max(0.001, group.end - exitStart)
                ) ** 3;
              const isKeyword = keywordSet.has(
                word.text.toLowerCase().replaceAll(/[^\p{L}\p{N}]/gu, "")
              );
              const spoken = time >= word.end;
              let opacity = 0;
              if (time >= word.start) {
                opacity = spoken ? 1 - clamp((time - word.end) / 0.2) * 0.6 : 1;
              }
              return (
                <span
                  key={wi}
                  data-caption-word={word.text}
                  style={{
                    clipPath: `inset(-12% ${(1 - entry) * 100}% -12% ${exit * 100}%)`,
                    color:
                      !spoken &&
                      isKeyword &&
                      time >= word.start + Math.min(0.1, wordWindow * 0.3)
                        ? keywordColor
                        : color,
                    display: "inline-block",
                    fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif",
                    fontSize: "inherit",
                    fontWeight,
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                    maxWidth: "100%",
                    opacity,
                    overflowWrap: "anywhere",
                    textTransform: "uppercase",
                  }}
                >
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
