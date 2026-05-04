"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface SuccessConfettiProps {
  count?: number;
  colors?: string[];
  originX?: number;
  originY?: number;
  gravity?: number;
  velocity?: number;
  text?: string;
  textColor?: string;
  background?: string;
  seed?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

// Seed-based PRNG (mulberry32) to replace Remotion's random
// eslint-disable-next-line no-bitwise
const mulberry32 = (seed: number) => {
  let a = Math.trunc(seed);
  return () => {
    a = Math.trunc(a + 1_814_331_957);
    // eslint-disable-next-line no-bitwise
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    // eslint-disable-next-line no-bitwise
    t ^= Math.imul(t ^ (t >>> 7), 61 | t);
    // eslint-disable-next-line no-bitwise
    return Math.trunc(t & 0xFF_FF_FF) / 4_294_967_296;
  };
};

const hashSeed = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    const char = seed.codePointAt(i) ?? 0;
    hash = (hash << 5) - hash + char; // eslint-disable-line no-bitwise
    hash &= hash; // eslint-disable-line no-bitwise
  }
  return hash;
};

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export const SuccessConfetti = ({
  count = 60,
  colors = ["#ff5e3a", "#22c55e", "#0ea5e9", "#facc15", "#a855f7"],
  originX = 0.5,
  originY = 0.5,
  gravity = 0.4,
  velocity = 12,
  text = "Merged!",
  textColor = "#171717",
  background = "#fafafa",
  seed = "remocn",
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SuccessConfettiProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;
  const width = 1280;
  const height = 720;
  const cx = width * originX;
  const cy = height * originY;

  // Generate deterministic random particles
  const seedNum = hashSeed(seed);
  const random = mulberry32(seedNum);

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = random() * Math.PI * 2;
    const launchSpeed = velocity * (0.6 + random() * 0.8);
    const colorIndex = Math.floor(random() * colors.length);
    const color = colors[colorIndex] ?? colors[0];
    const size = 6 + random() * 8;
    const rotationSpeed = (random() - 0.5) * 16;
    const initialRotation = random() * 360;
    const isCircle = random() > 0.6;
    const lifeOffset = Math.floor(random() * 4);

    const totalFrames = durationInFrames - lifeOffset;
    const fTotal = totalFrames;
    const deltaX = Math.cos(angle) * launchSpeed * fTotal;
    const deltaY =
      Math.sin(angle) * launchSpeed * fTotal + 0.5 * gravity * fTotal * fTotal;
    const totalRotation = initialRotation + rotationSpeed * fTotal;

    const animStartMs = (lifeOffset * frameMs) / safeSpeed;
    const animDurationMs = (totalFrames * frameMs) / safeSpeed;

    return {
      animDurationMs,
      animName: `framecn-confetti-particle-${i}`,
      animStartMs,
      color,
      deltaX,
      deltaY,
      initialRotation,
      isCircle,
      key: i,
      lifeOffset,
      size,
      totalRotation,
    };
  });

  // Generate particle keyframes
  const particleKeyframes = particles
    .map(
      (p) => `
    @keyframes ${p.animName} {
      0% {
        transform: translate(0px, 0px) rotate(${p.initialRotation}deg);
        opacity: 0;
      }
      ${((4 - p.lifeOffset) / (durationInFrames - p.lifeOffset)) * 100}% {
        opacity: 1;
      }
      ${((durationInFrames - 20 - p.lifeOffset) / (durationInFrames - p.lifeOffset)) * 100}% {
        opacity: 1;
      }
      100% {
        transform: translate(${p.deltaX}px, ${p.deltaY}px) rotate(${p.totalRotation}deg);
        opacity: 0;
      }
    }
  `
    )
    .join("");

  const containerStyle = {
    background,
    fontFamily: FONT_FAMILY,
    inset: 0,
    overflow: "hidden",
    position: "absolute",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          ${particleKeyframes}
          @keyframes framecn-confetti-text {
            4.44% { opacity: 0; transform: scale(0.6); }
            15.55% { opacity: 1; transform: scale(1); }
            86.66% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
          }
        `}</style>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ inset: 0, position: "absolute" }}
        >
          {particles.map((p) => {
            const particleStyle: CSSProperties = {
              animation: `${p.animName} ${p.animDurationMs}ms linear ${p.animStartMs}ms forwards`,
            };
            return p.isCircle ? (
              <circle
                key={p.key}
                cx={cx}
                cy={cy}
                r={p.size / 2}
                fill={p.color}
                style={particleStyle}
              />
            ) : (
              <rect
                key={p.key}
                x={-p.size / 2}
                y={-p.size / 2}
                width={p.size}
                height={p.size * 0.5}
                rx={1}
                fill={p.color}
                style={particleStyle}
                transform={`translate(${cx} ${cy}) rotate(${p.initialRotation})`}
              />
            );
          })}
        </svg>

        {text ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              pointerEvents: "none",
              position: "absolute",
            }}
          >
            <span
              style={{
                animation: `framecn-confetti-text ${durationMs}ms linear forwards`,
                color: textColor,
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              {text}
            </span>
          </div>
        ) : null}
      </>
    </Timegroup>
  );
};
