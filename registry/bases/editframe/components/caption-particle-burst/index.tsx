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

export interface CaptionParticleBurstProps {
  words?: CaptionWord[];
  color?: string;
  burstColor?: string;
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

const PARTICLE_COLORS = [
  "#FF6B35",
  "#FF3C78",
  "#9B5DE5",
  "#00BBF9",
  "#00F5D4",
  "#ffffff",
  "#F15BB5",
];

const particleValue = (seed: number) => {
  const value = ((seed + 1) * 48_271) % 2_147_483_647;
  return ((value * 48_271) % 2_147_483_647) / 2_147_483_647;
};

export const CaptionParticleBurst = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  burstColor = "#fbbf24",
  fontSize = 80,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionParticleBurstProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const compositionEnd = (durationMs / 1000) * safeSpeed;
  const padding = Math.min(80, Math.max(16, width * 0.06));
  const groups = useMemo(() => {
    const result: {
      words: {
        word: CaptionWord;
        particles: { x: number; y: number; size: number }[];
      }[];
      start: number;
      end: number;
      characters: number;
    }[] = [];
    let current: {
      word: CaptionWord;
      particles: { x: number; y: number; size: number }[];
    }[] = [];
    const finish = () => {
      if (!current.length) {
        return;
      }
      result.push({
        characters: current.reduce(
          (count, { word }) => count + word.text.length + 1,
          0
        ),
        end: (current.at(-1)?.word.end ?? 0) + 0.18,
        start: current[0].word.start,
        words: current,
      });
      current = [];
    };
    for (const [index, word] of words.entries()) {
      const particles = Array.from({ length: 10 }, (_, pi) => {
        const seed = index * 137 + pi * 17 + 99;
        const angle = (pi / 10) * Math.PI * 2 + particleValue(seed) * 0.6;
        const distance = 0.75 + particleValue(seed + 1) * 1.35;
        return {
          size: 0.045 + particleValue(seed + 2) * 0.075,
          x: Math.cos(angle) * distance,
          y: -Math.sin(angle) * distance * 0.65,
        };
      });
      current.push({ particles, word });
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
        const fittedSize = Math.min(
          fontSize,
          height * 0.15,
          (width - padding * 2) / Math.max(1, group.characters * 0.78)
        );
        const enter = Math.max(
          0,
          Math.min(
            1,
            (time - group.start) /
              Math.min(0.18, Math.max(0.001, end - group.start) * 0.4)
          )
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
              fontFamily: "'Outfit', 'Arial Black', Arial, sans-serif",
              fontSize: fittedSize,
              fontWeight,
              gap: "0.3em",
              justifyContent: "center",
              left: 0,
              letterSpacing: "0.05em",
              lineHeight: 1.15,
              opacity: visible ? 1 : 0,
              overflow: "visible",
              padding: `0 ${padding}px`,
              position: "absolute",
              right: 0,
              textTransform: "uppercase",
              transform: `scale(${0.92 + 0.08 * (1 - (1 - enter) ** 3)})`,
            }}
          >
            {group.words.map(({ word, particles }, wi) => {
              const active = time >= word.start && time < word.end;
              const emphasis =
                word.text.replaceAll(/[^\p{L}\p{N}]/gu, "").length >= 6;
              const elapsed = time - word.start;
              const burstDuration = Math.min(
                0.55,
                Math.max(0.001, end - word.start)
              );
              const pulse = active
                ? Math.sin(
                    Math.PI *
                      Math.max(
                        0,
                        Math.min(
                          1,
                          elapsed /
                            Math.min(
                              0.16,
                              Math.max(0.001, word.end - word.start)
                            )
                        )
                      )
                  )
                : 0;
              return (
                <span
                  key={wi}
                  data-caption-word={word.text}
                  style={{
                    display: "inline-block",
                    maxWidth: "100%",
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  {particles.map((particle, pi) => {
                    const progress =
                      (elapsed / burstDuration - pi * 0.018) / (1 - pi * 0.018);
                    const p = Math.max(0, Math.min(1, progress));
                    const travel = 1 - (1 - p) ** 3;
                    return (
                      <span
                        key={pi}
                        aria-hidden
                        data-caption-particle={pi}
                        style={{
                          background:
                            pi % 3 === 0
                              ? burstColor
                              : PARTICLE_COLORS[pi % PARTICLE_COLORS.length],
                          borderRadius: "50%",
                          height: fittedSize * particle.size,
                          left: "50%",
                          opacity:
                            visible && progress >= 0 && progress < 1
                              ? (1 - p) ** 1.3
                              : 0,
                          pointerEvents: "none",
                          position: "absolute",
                          top: "50%",
                          transform: `translate(-50%, -50%) translate(${particle.x * fittedSize * travel}px, ${particle.y * fittedSize * travel + fittedSize * 0.25 * p * p}px) scale(${1 - p * 0.65})`,
                          width: fittedSize * particle.size,
                          zIndex: 2,
                        }}
                      />
                    );
                  })}
                  <span
                    style={{
                      color: emphasis && active ? burstColor : color,
                      display: "inline-block",
                      maxWidth: "100%",
                      opacity: active ? 1 : 0.4,
                      overflowWrap: "anywhere",
                      transform: `scale(${1 + pulse * (emphasis ? 0.12 : 0.05)})`,
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
    </Timegroup>
  );
};
