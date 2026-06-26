"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionTextureProps {
  words?: CaptionWord[];
  keywords?: number[];
  color?: string;
  keywordColor?: string;
  texture?: string;
  fontSize?: number;
  fontFamily?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { end: 0.3, start: 0, text: "Every" },
  { end: 0.55, start: 0.3, text: "great" },
  { end: 0.85, start: 0.55, text: "video" },
  { end: 1.1, start: 0.85, text: "starts" },
  { end: 1.25, start: 1.1, text: "with" },
  { end: 1.35, start: 1.25, text: "a" },
  { end: 1.65, start: 1.35, text: "single" },
  { end: 2, start: 1.65, text: "frame." },
  { end: 2.65, start: 2.1, text: "HyperFrames" },
  { end: 2.85, start: 2.65, text: "lets" },
  { end: 2.95, start: 2.85, text: "you" },
  { end: 3.15, start: 2.95, text: "write" },
  { end: 3.55, start: 3.15, text: "HTML" },
  { end: 3.65, start: 3.55, text: "and" },
  { end: 3.95, start: 3.65, text: "render" },
  { end: 4.45, start: 3.95, text: "professional" },
  { end: 4.8, start: 4.45, text: "video." },
  { end: 5.05, start: 4.9, text: "No" },
  { end: 5.45, start: 5.05, text: "timeline." },
  { end: 5.65, start: 5.5, text: "No" },
  { end: 5.85, start: 5.65, text: "drag" },
  { end: 5.95, start: 5.85, text: "and" },
  { end: 6.25, start: 5.95, text: "drop." },
  { end: 6.55, start: 6.35, text: "Just" },
  { end: 6.8, start: 6.55, text: "code" },
  { end: 6.95, start: 6.8, text: "that" },
  { end: 7.3, start: 6.95, text: "becomes" },
  { end: 7.7, start: 7.3, text: "cinema." },
];

const DEFAULT_KEYWORDS = [8, 12, 15, 24, 27];

export const CaptionTexture = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  color = "#ffd0a0",
  keywordColor = "#FFAA44",
  texture = "lava",
  fontSize = 200,
  fontFamily = "'Anton', sans-serif",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionTextureProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const textureUrl = `compositions/components/${texture}.png`;

  const containerStyle: CSSProperties = {
    background: "transparent",
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes ct-show {
            to { visibility: visible; }
          }
          @keyframes ct-hide {
            to { visibility: hidden; }
          }
          @keyframes ct-in {
            from {
              opacity: 0;
              transform: translateY(-50%) scale(0.88);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) scale(1);
            }
          }
          @keyframes ct-out {
            from {
              opacity: 1;
              transform: translateY(-50%) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-50%) scale(1.08);
            }
          }
          @keyframes ct-reveal {
            from {
              mask-position: 0% 50%;
              -webkit-mask-position: 0% 50%;
            }
            to {
              mask-position: 100% 50%;
              -webkit-mask-position: 100% 50%;
            }
          }
        `}</style>
        <div style={{ inset: 0, position: "absolute" }}>
          {words.map((word, wi) => {
            const startMs = (word.start * 1000) / safeSpeed;
            const endMs = (word.end * 1000) / safeSpeed;
            const dur = Math.max(word.end - word.start + 0.3, 0.4);
            const revealMs = (dur * 1000) / safeSpeed;
            const isKW = keywords.includes(wi);
            const hideMs = endMs + 100;

            return (
              <div
                key={wi}
                style={
                  {
                    animation: [
                      `ct-show 1ms linear ${startMs}ms both`,
                      `ct-in 180ms ease-out ${startMs}ms 1 forwards`,
                      `ct-out 100ms ease-in ${endMs}ms 1 forwards`,
                      `ct-hide 1ms linear ${hideMs}ms forwards`,
                    ].join(", "),
                    filter: "drop-shadow(0 4px 24px rgba(255, 100, 20, 0.55))",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    textAlign: "center",
                    top: "50%",
                    visibility: "hidden",
                    width: "100%",
                  } as CSSProperties
                }
              >
                <div
                  style={
                    {
                      WebkitMaskImage: `url('${textureUrl}')`,
                      WebkitMaskMode: "luminance",
                      WebkitMaskPosition: "0% 50%",
                      WebkitMaskSize: "200% 200%",
                      animation: `ct-reveal ${revealMs}ms ease-in-out ${startMs}ms 1 forwards`,
                      color: isKW ? keywordColor : color,
                      display: "inline-block",
                      filter: "contrast(1.2)",
                      fontFamily,
                      fontSize,
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                      maskImage: `url('${textureUrl}')`,
                      maskMode: "luminance",
                      maskPosition: "0% 50%",
                      maskSize: "200% 200%",
                      textTransform: "uppercase",
                      willChange: "mask-position",
                    } as CSSProperties
                  }
                >
                  {word.text.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
