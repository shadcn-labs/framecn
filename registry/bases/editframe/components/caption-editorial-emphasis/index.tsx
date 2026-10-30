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

export interface CaptionEditorialEmphasisProps {
  words?: CaptionWord[];
  emphasisWords?: string[];
  color?: string;
  fontSize?: number;
  fontWeight?: number | string;
  emphasisScale?: number;
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
const DEFAULT_EMPHASIS_WORDS = ["single", "code."];

export const CaptionEditorialEmphasis = ({
  words = DEFAULT_WORDS,
  emphasisWords = DEFAULT_EMPHASIS_WORDS,
  color = "#f5f0d0",
  fontSize = 56,
  fontWeight = "400",
  emphasisScale = 2,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionEditorialEmphasisProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const duration = durationInFrames / fps;
  const transcriptEnd = duration * safeSpeed;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.max(12, width * (60 / 1920));
  const safeWidth = Math.max(1, width - padding * 2);
  const groups = useMemo(() => {
    const emphasisSet = new Set(
      emphasisWords.map((word) =>
        word.toLowerCase().replaceAll(/[^\p{L}\p{N}]/gu, "")
      )
    );
    const result: {
      words: {
        word: CaptionWord;
        emphasis: boolean;
        secondLine: boolean;
        size: number;
      }[];
      start: number;
      end: number;
    }[] = [];
    const maxWords = Math.max(1, Math.floor(WORDS_PER_GROUP));
    const scale = Math.max(1.2, Math.min(3, emphasisScale));
    let start = 0;
    for (let i = 0; i < words.length; i += 1) {
      const isEmphasis = emphasisSet.has(
        words[i].text.toLowerCase().replaceAll(/[^\p{L}\p{N}]/gu, "")
      );
      const pause = (words[i + 1]?.start ?? words[i].end) - words[i].end;
      if (
        isEmphasis ||
        i - start + 1 >= maxWords ||
        /[,.;:!?]["')\]]?$/.test(words[i].text) ||
        pause >= 0.15 ||
        i === words.length - 1
      ) {
        const phrase = words.slice(start, i + 1);
        const emphasisIndex = isEmphasis ? phrase.length - 1 : -1;
        const normalChars = phrase.reduce(
          (total, word, wi) =>
            total + (wi === emphasisIndex ? 0 : [...word.text].length + 0.3),
          0
        );
        const normalSize = Math.min(
          fontSize,
          height * 0.11,
          safeWidth / Math.max(1, normalChars * 0.8)
        );
        result.push({
          end: Math.min(
            words[i].end + 0.18,
            words[i + 1]?.start ?? transcriptEnd,
            transcriptEnd
          ),
          start: phrase[0].start,
          words: phrase.map((word, wi) => {
            const emphasis = wi === emphasisIndex;
            const baseSize = emphasis
              ? Math.min(fontSize * scale, height * 0.24)
              : normalSize;
            return {
              emphasis,
              secondLine: emphasis && wi > 0,
              size: Math.min(
                baseSize,
                safeWidth / Math.max(1, [...word.text].length * 1.12)
              ),
              word,
            };
          }),
        });
        start = i + 1;
      }
    }
    return result;
  }, [
    words,
    emphasisWords,
    emphasisScale,
    fontSize,
    height,
    safeWidth,
    transcriptEnd,
  ]);

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
      {groups.map((group, gi) => (
        <div
          key={gi}
          data-caption-group={gi}
          style={{
            bottom: height * (70 / 1080),
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            left: 0,
            opacity: time >= group.start && time < group.end ? 1 : 0,
            overflow: "visible",
            padding: `0 ${padding}px`,
            pointerEvents: "none",
            position: "absolute",
            right: 0,
          }}
        >
          <div
            style={{
              alignItems: "baseline",
              columnGap: fontSize * (14 / 86),
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              maxWidth: safeWidth,
              rowGap: 8,
              width: "100%",
            }}
          >
            {group.words.map(({ word, emphasis, secondLine, size }, wi) => {
              const wordWindow = Math.max(
                0.001,
                Math.min(
                  word.end,
                  group.words[wi + 1]?.word.start ?? group.end,
                  group.end
                ) - word.start
              );
              const entryDuration = Math.min(
                secondLine ? 0.2 : 0.1,
                wordWindow * 0.7
              );
              const progress = Math.max(
                0,
                Math.min(1, (time - word.start) / entryDuration)
              );
              const eased = 1 - (1 - progress) ** 3;
              return (
                <span
                  key={wi}
                  style={{
                    display: secondLine ? "block" : "inline-block",
                    flexBasis: secondLine ? "100%" : undefined,
                    maxWidth: "100%",
                  }}
                >
                  <span
                    data-caption-word={word.text}
                    style={{
                      color,
                      display: "inline-block",
                      fontFamily: emphasis
                        ? "'Playfair Display', Georgia, 'Times New Roman', serif"
                        : "'Inter', Arial, sans-serif",
                      fontSize: size,
                      fontStyle:
                        emphasis || word.text.toLowerCase() === "just"
                          ? "italic"
                          : "normal",
                      fontWeight: emphasis ? 800 : fontWeight,
                      lineHeight: emphasis ? 1.05 : 1.1,
                      maxWidth: "100%",
                      opacity: time < word.start ? 0 : eased,
                      overflowWrap: "anywhere",
                      textShadow:
                        "0 2px 12px rgba(0,0,0,.6), 0 4px 24px rgba(0,0,0,.35)",
                      transform: secondLine
                        ? `translateX(${-width * (1 - eased)}px)`
                        : `scale(${1 + 0.12 * (1 - eased)})`,
                      transformOrigin: "0% 100%",
                    }}
                  >
                    {word.text}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </Timegroup>
  );
};
