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

export interface CaptionGlitchRgbProps {
  words?: CaptionWord[];
  color?: string;
  glitchRedColor?: string;
  glitchCyanColor?: string;
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

export const CaptionGlitchRgb = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  glitchRedColor = "#ff003c",
  glitchCyanColor = "#00e5ff",
  fontSize = 88,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionGlitchRgbProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const duration = durationInFrames / fps;
  const transcriptEnd = duration * safeSpeed;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const padding = Math.max(12, width * (100 / 1920));
  const safeWidth = Math.max(1, width - padding * 2);
  const groups = useMemo(() => {
    const result: {
      words: {
        word: CaptionWord;
        travel: number;
        shadow: number;
        glitchDuration: number;
        aftershocks: { start: number; travel: number; shadow: number }[];
      }[];
      start: number;
      end: number;
      size: number;
    }[] = [];
    const maxWords = Math.max(1, Math.floor(WORDS_PER_GROUP));
    let start = 0;
    let chars = 0;
    for (let i = 0; i < words.length; i += 1) {
      chars += words[i].text.length + 1;
      const pause = (words[i + 1]?.start ?? words[i].end) - words[i].end;
      if (
        i - start + 1 >= maxWords ||
        chars >= 21 ||
        /[,.;:!?]["')\]]?$/u.test(words[i].text) ||
        pause >= 0.15 ||
        i === words.length - 1
      ) {
        const phrase = words.slice(start, i + 1);
        const end = Math.min(
          words[i].end + 0.18,
          words[i + 1]?.start ?? transcriptEnd,
          transcriptEnd
        );
        const firstIndex = start;
        const styledWords = phrase.map((word, wi) => {
          // Seeded samples are prepared once, independently of playback direction.
          let seed = (firstIndex + wi) * 777 + 13;
          const samples: number[] = [];
          for (let sample = 0; sample < 2; sample += 1) {
            seed = (seed * 48_271) % 2_147_483_647;
            samples.push(seed / 2_147_483_647);
          }
          const nextStart = words[firstIndex + wi + 1]?.start ?? end;
          const available = Math.max(
            0.001,
            Math.min(word.end, nextStart, end) - word.start
          );
          const glitchDuration = Math.min(
            available * 0.9,
            0.24,
            Math.max(0.08, available - 0.02)
          );
          const aftershocks: {
            start: number;
            travel: number;
            shadow: number;
          }[] = [];
          if (
            /\d|\$|%/u.test(word.text) ||
            word.text.replaceAll(/[^\w]/gu, "").length >= 7
          ) {
            const aftershockEnd = Math.min(end - 0.02, nextStart - 0.02);
            // Fit the short aftershock into the available hold; never extend the caption window.
            const pulseStart = word.end + 0.02;
            if (pulseStart + 0.12 < aftershockEnd) {
              aftershocks.push({
                shadow: 3 + samples[1] * 5,
                start: pulseStart,
                travel: -(3 + samples[0] * 5),
              });
            }
          }
          return {
            aftershocks,
            glitchDuration,
            shadow: 5 + samples[1] * 7,
            travel: -(8 + samples[0] * 8),
            word,
          };
        });
        const longest = Math.max(
          ...phrase.map((word) => [...word.text.toUpperCase()].length),
          1
        );
        result.push({
          end,
          size: Math.min(
            fontSize,
            height * 0.16,
            safeWidth / (longest * 1.08),
            safeWidth / Math.max(1, chars * 0.7)
          ),
          start: phrase[0].start,
          words: styledWords,
        });
        start = i + 1;
        chars = 0;
      }
    }
    return result;
  }, [words, fontSize, height, safeWidth, transcriptEnd]);

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
      <div
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom,rgba(0,0,0,.08) 0%,rgba(0,0,0,.16) 54%,rgba(0,0,0,.5) 100%)",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background:
            "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.16) 3px,rgba(0,0,0,.16) 4px)",
          inset: 0,
          opacity: 0.55,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      {groups.map((group, gi) => {
        const visible = time >= group.start && time < group.end;
        const entryDuration = Math.min(0.12, (group.end - group.start) * 0.3);
        const exitDuration = Math.min(0.1, (group.end - group.start) * 0.2);
        const entry =
          1 -
          (1 -
            Math.max(
              0,
              Math.min(1, (time - group.start) / Math.max(0.001, entryDuration))
            )) **
            3;
        const exit =
          Math.max(
            0,
            Math.min(
              1,
              (time - group.end + exitDuration) / Math.max(0.001, exitDuration)
            )
          ) ** 3;
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
              gap: "0.16em",
              justifyContent: "center",
              left: 0,
              opacity: visible ? entry * (1 - exit) : 0,
              overflow: "visible",
              padding: `0 ${padding}px`,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
            }}
          >
            {group.words.map(
              ({ word, travel, shadow, glitchDuration, aftershocks }, wi) => {
                const elapsed = time - word.start;
                const firstPhase = glitchDuration * 0.35;
                let pulse = 0;
                if (elapsed >= 0 && elapsed < glitchDuration) {
                  pulse =
                    elapsed < firstPhase
                      ? elapsed / firstPhase
                      : (1 -
                          (elapsed - firstPhase) /
                            (glitchDuration - firstPhase)) **
                        4;
                }
                let x = travel * pulse;
                let separation = shadow * pulse;
                for (const aftershock of aftershocks) {
                  const local = time - aftershock.start;
                  if (local >= 0 && local < 0.12) {
                    pulse =
                      local < 0.045
                        ? local / 0.045
                        : (1 - (local - 0.045) / 0.075) ** 4;
                    x = aftershock.travel * pulse;
                    separation = aftershock.shadow * pulse;
                  }
                }
                return (
                  <span
                    key={wi}
                    data-caption-word={word.text}
                    style={{
                      color,
                      display: "inline-block",
                      fontFamily: "'Space Grotesk', Arial, sans-serif",
                      fontSize: "inherit",
                      fontWeight,
                      letterSpacing: "0.03em",
                      lineHeight: 1.08,
                      maxWidth: "100%",
                      overflowWrap: "anywhere",
                      textShadow:
                        separation > 0
                          ? `${separation}px 0 ${glitchRedColor}, ${-separation}px 0 ${glitchCyanColor}, 0 5px 18px rgba(0,0,0,.52)`
                          : "0 5px 18px rgba(0,0,0,.52)",
                      textTransform: "uppercase",
                      transform: `translateX(${x}px)`,
                    }}
                  >
                    {word.text}
                  </span>
                );
              }
            )}
          </div>
        );
      })}
    </Timegroup>
  );
};
