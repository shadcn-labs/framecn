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

export interface CaptionTextureProps {
  words?: CaptionWord[];
  textureFrom?: string;
  textureMid?: string;
  textureTo?: string;
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

// Embedded luminance texture keeps registry installs standalone and works offline.
const TEXTURE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="256"><filter id="rock"><feTurbulence type="fractalNoise" baseFrequency=".026 .055" numOctaves="4" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="gamma" amplitude="2.1" exponent="2.8" offset=".08"/><feFuncG type="gamma" amplitude="2.1" exponent="2.8" offset=".08"/><feFuncB type="gamma" amplitude="2.1" exponent="2.8" offset=".08"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#rock)"/></svg>'
)}")`;

export const CaptionTexture = ({
  words = DEFAULT_WORDS,
  textureFrom = "#ff6414",
  textureMid = "#ff2200",
  textureTo = "#ffd000",
  fontSize = 120,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionTextureProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const time = (ownCurrentTimeMs / 1000) * safeSpeed;
  const compositionEnd = (durationMs / 1000) * safeSpeed;
  const padding = Math.min(80, Math.max(16, width * 0.06));
  const timedWords = useMemo(
    () =>
      words.map((word, index) => ({
        ...word,
        end: Math.min(word.end, words[index + 1]?.start ?? Infinity),
        text: word.text.toUpperCase(),
      })),
    [words]
  );
  const textureBackground = `radial-gradient(ellipse at 20% 30%, ${textureFrom}, transparent 55%), radial-gradient(ellipse at 75% 65%, ${textureTo}, transparent 60%), linear-gradient(135deg, ${textureFrom}, ${textureMid} 45%, ${textureTo})`;

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
      {timedWords.map((word, index) => {
        const end = Math.min(word.end, compositionEnd);
        const visible = time >= word.start && time < end;
        const duration = Math.max(0.001, end - word.start);
        const progress = Math.max(
          0,
          Math.min(1, (time - word.start) / duration)
        );
        const enter = Math.min(
          1,
          (time - word.start) / Math.min(0.18, duration * 0.4)
        );
        const exit = Math.max(0, (progress - 0.8) / 0.2);
        const eased = 1 - (1 - Math.max(0, enter)) ** 3;
        const fittedSize = Math.min(
          fontSize,
          height * 0.24,
          (width - padding * 2) / Math.max(1, word.text.length * 0.88)
        );
        const maskPosition = `${(0.5 - Math.cos(progress * Math.PI) * 0.5) * 100}% 50%`;
        return (
          <div
            key={index}
            data-caption-group={index}
            style={{
              bottom: height * 0.15,
              boxSizing: "border-box",
              filter: `drop-shadow(0 4px ${fittedSize * 0.16}px ${textureFrom})`,
              left: 0,
              opacity: visible
                ? Math.min(1, Math.max(0, enter) * 3) * (1 - exit)
                : 0,
              padding: `0 ${padding}px`,
              position: "absolute",
              right: 0,
              textAlign: "center",
              transform: `scale(${0.88 + eased * 0.12 + exit * 0.08})`,
              transformOrigin: "50% 100%",
            }}
          >
            <span
              data-caption-word={word.text}
              style={{
                WebkitBackgroundClip: "text",
                WebkitMaskImage: TEXTURE_MASK,
                WebkitMaskPosition: maskPosition,
                WebkitMaskRepeat: "repeat",
                WebkitMaskSize: "200% 200%",
                backgroundClip: "text",
                backgroundImage: textureBackground,
                backgroundPosition: maskPosition,
                backgroundSize: "200% 200%",
                color: "transparent",
                display: "inline-block",
                fontFamily: "'Anton', Impact, 'Arial Black', sans-serif",
                fontSize: fittedSize,
                fontWeight,
                letterSpacing: "0.04em",
                lineHeight: 1.15,
                maskImage: TEXTURE_MASK,
                maskMode: "luminance",
                maskPosition,
                maskRepeat: "repeat",
                maskSize: "200% 200%",
                maxWidth: "100%",
                overflowWrap: "anywhere",
              }}
            >
              {word.text}
            </span>
          </div>
        );
      })}
    </Timegroup>
  );
};
