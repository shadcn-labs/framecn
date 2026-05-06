"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface MatrixDecodeProps {
  text?: string;
  charset?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  revealDuration?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

// Seeded random for consistent output
const seededRandom = (seed: string, index: number): number => {
  let hash = 0;
  const str = `${seed}-${index}`;
  for (let i = 0; i < str.length; i += 1) {
    const code = str.codePointAt(i) ?? 0;
    hash = Math.trunc(hash * 32 - hash + code);
  }
  // eslint-disable-next-line no-bitwise unicorn/number-literal-case
  return (hash & 0x7f_ff_ff) / 0x7f_ff_ff;
};

export const MatrixDecode = ({
  text = "DECRYPTED",
  charset = "!@#$%^&*()_+-=<>?/\\|",
  fontSize = 72,
  color = "#22c55e",
  fontWeight = 600,
  revealDuration = 60,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  width = 1280,
  height = 720,
  className,
}: MatrixDecodeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const revealMs = (revealDuration * frameMs) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "white",
    display: "flex",
    fontFamily:
      "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
    height,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width,
  };

  const chars = [...text];

  // For each character position, generate sequence: random chars + final char
  const charSequences = chars.map((finalChar, i) => {
    const sequence = [];
    for (let s = 0; s < charset.length; s += 1) {
      const r = seededRandom(`${i}`, s);
      sequence.push(charset[Math.floor(r * charset.length)]);
    }
    sequence.push(finalChar);
    return sequence;
  });

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-matrix-reveal {
            to {
              transform: translateY(-${charset.length * 100}%);
            }
          }
        `}</style>
        <div
          style={{
            color,
            display: "flex",
            fontSize,
            fontWeight,
            letterSpacing: "0.05em",
          }}
        >
          {charSequences.map((sequence, i) => {
            const delay = (i * revealMs) / chars.length;
            const charHeight = fontSize * 1.2;

            return (
              <div
                key={i}
                style={{
                  height: charHeight,
                  overflow: "hidden",
                  textAlign: "center",
                  width: `${charHeight * 0.6}px`,
                }}
              >
                <div
                  style={{
                    animation: `framecn-matrix-reveal ${revealMs}ms steps(${charset.length}) ${delay}ms forwards`,
                  }}
                >
                  {sequence.map((ch, j) => (
                    <div
                      key={j}
                      style={{
                        alignItems: "center",
                        display: "flex",
                        height: charHeight,
                        justifyContent: "center",
                      }}
                    >
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
