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

export interface CaptionParallaxLayersProps {
  words?: CaptionWord[];
  color?: string;
  behindColor?: string;
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

export const CaptionParallaxLayers = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  behindColor = "#a78bfa",
  fontSize = 56,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionParallaxLayersProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const compositionEnd = (durationMs / 1000) * safeSpeed;
  const padding = Math.min(80, Math.max(16, width * 0.06));
  const groups = useMemo(() => {
    const result: {
      words: CaptionWord[];
      start: number;
      end: number;
      emphasis: CaptionWord;
      characters: number;
    }[] = [];
    let current: CaptionWord[] = [];
    const finish = () => {
      if (!current.length) {
        return;
      }
      let [emphasis] = current;
      for (const word of current) {
        if (word.text.length > emphasis.text.length) {
          emphasis = word;
        }
      }
      result.push({
        characters: current.reduce(
          (count, word) => count + word.text.length + 1,
          0
        ),
        emphasis,
        end: (current.at(-1)?.end ?? 0) + 0.18,
        start: current[0].start,
        words: current,
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
      {groups.map((group, gi) => {
        const end = Math.min(group.end, compositionEnd);
        const visible = time >= group.start && time < end;
        const progress = Math.max(
          0,
          Math.min(1, (time - group.start) / Math.max(0.001, end - group.start))
        );
        const enter = Math.max(
          0,
          Math.min(
            1,
            (time - group.start) /
              Math.min(0.2, Math.max(0.001, end - group.start) * 0.4)
          )
        );
        const eased = 1 - (1 - enter) ** 3;
        const direction = gi % 2 === 0 ? 1 : -1;
        const frontSize = Math.min(
          fontSize,
          height * 0.14,
          (width - padding * 2) / Math.max(1, group.characters * 0.68)
        );
        const behindSize = Math.min(
          fontSize * 3,
          height * 0.16,
          (width - padding * 2 - 64) /
            Math.max(1, group.emphasis.text.length * 0.75)
        );
        const emphasisEnter = Math.max(
          0,
          Math.min(
            1,
            (time - group.emphasis.start) /
              Math.min(
                0.1,
                Math.max(0.001, group.emphasis.end - group.emphasis.start) * 0.4
              )
          )
        );
        return (
          <div
            key={gi}
            data-caption-group={gi}
            style={{
              inset: 0,
              opacity: visible ? 1 : 0,
              perspective: width,
              position: "absolute",
            }}
          >
            <div
              aria-hidden
              data-caption-layer="behind"
              style={{
                WebkitTextStroke: `${Math.max(1, behindSize * 0.018)}px ${behindColor}`,
                boxSizing: "border-box",
                color: behindColor,
                fontFamily:
                  "'Instrument Serif', Georgia, 'Times New Roman', serif",
                fontSize: behindSize,
                fontWeight: 400,
                left: padding,
                lineHeight: 1.05,
                opacity: emphasisEnter,
                overflowWrap: "anywhere",
                position: "absolute",
                right: padding,
                textAlign: "center",
                textShadow: `2px 4px 0 ${behindColor}, 0 10px 18px rgba(0,0,0,0.45)`,
                top: height * 0.08,
                transform: `translate3d(${direction * ((1 - eased) * 48 + progress * 12)}px, ${(1 - eased) * -18}px, -60px) rotateY(${direction * (1 - eased) * 12}deg) scaleY(2.4)`,
                transformOrigin: "50% 0%",
              }}
            >
              {group.emphasis.text}
            </div>
            <div
              data-caption-layer="front"
              style={{
                alignItems: "baseline",
                bottom: height * 0.12,
                boxSizing: "border-box",
                color,
                display: "flex",
                flexWrap: "wrap",
                fontFamily:
                  "'Instrument Serif', Georgia, 'Times New Roman', serif",
                fontSize: frontSize,
                fontWeight,
                gap: "0.25em",
                justifyContent: "center",
                left: 0,
                lineHeight: 1.15,
                overflow: "visible",
                padding: `0 ${padding}px`,
                position: "absolute",
                right: 0,
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                transform: `translate3d(${direction * ((1 - eased) * -28 - progress * 6)}px, ${(1 - eased) * 12}px, 0)`,
              }}
            >
              {group.words.map((word, wi) => {
                const entry = Math.max(
                  0,
                  Math.min(
                    1,
                    (time - word.start) /
                      Math.min(
                        0.12,
                        Math.max(0.001, word.end - word.start) * 0.4
                      )
                  )
                );
                return (
                  <span
                    key={wi}
                    data-caption-word={word.text}
                    style={{
                      display: "inline-block",
                      fontStyle: /[.!?]$/u.test(word.text)
                        ? "italic"
                        : "normal",
                      maxWidth: "100%",
                      opacity: time >= word.start ? 1 : 0,
                      overflowWrap: "anywhere",
                      transform: `translateY(${(1 - entry) * frontSize * 0.18}px)`,
                    }}
                  >
                    {word.text}
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
