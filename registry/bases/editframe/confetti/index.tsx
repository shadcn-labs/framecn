"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface ConfettiProps {
  particleCount?: number;
  originX?: number;
  originY?: number;
  lifetime?: number;
  power?: number;
  gravity?: number;
  size?: number;
  seed?: number;
  colors?: string[];
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
  speed?: number;
}

// Park-Miller PRNG — no bitwise operations needed
const makePrng = (initialSeed: number) => {
  let s = (Math.abs(initialSeed) % 2_147_483_646) + 1;
  return () => {
    s = (s * 16_807) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
};

export const Confetti = ({
  particleCount = 80,
  originX = 0.5,
  originY = 0.5,
  lifetime = 90,
  power = 17,
  gravity = 0.45,
  size = 13,
  seed = 1,
  colors = ["#1d9bf0", "#ff5da2", "#ffd23f", "#22c55e", "#a855f7", "#ff7a45"],
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
  speed = 1,
}: ConfettiProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeSpeed = Math.max(0.01, speed);
  const lifetimeMs = ((lifetime / fps) * 1000) / safeSpeed;

  const rand = makePrng(seed);
  const safeCount = Math.min(particleCount, 120);

  const particles = Array.from({ length: safeCount }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const spd = rand() * power;
    const drift = (rand() - 0.5) * 2;
    const vx = Math.cos(angle) * spd + drift;
    const vy = Math.sin(angle) * spd;
    const lt = lifetime;

    const startX = originX * width;
    const startY = originY * height;
    const endX = startX + vx * lt;
    const endY = startY + (vy * lt + 0.5 * gravity * lt * lt);

    const color = colors[i % colors.length] ?? "#fff";
    const rot0 = rand() * 360;
    const rotSpeed = (rand() - 0.5) * 720;
    const endRot = rot0 + rotSpeed;
    const w = size * (0.5 + rand() * 0.5);
    const h = size * (0.5 + rand() * 0.5);

    return { color, endRot, endX, endY, h, i, rot0, startX, startY, w };
  });

  const keyframesCSS = particles
    .map(
      ({ startX, startY, endX, endY, rot0, endRot, i }) => `
    @keyframes framecn-confetti-p-${i}-${seed} {
      0% { opacity: 0; transform: translate(${startX - width / 2}px, ${startY - height / 2}px) rotate(${rot0}deg); }
      5% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; transform: translate(${endX - width / 2}px, ${endY - height / 2}px) rotate(${endRot}deg); }
    }
  `
    )
    .join("\n");

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: "white",
          inset: 0,
          overflow: "hidden",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{keyframesCSS}</style>
        <div
          style={{
            height: 0,
            left: width / 2,
            position: "absolute",
            top: height / 2,
            width: 0,
          }}
        >
          {particles.map(({ color, rot0, w, h, i }) => (
            <div
              key={i}
              style={{
                animation: `framecn-confetti-p-${i}-${seed} ${lifetimeMs}ms ease-out 0ms both`,
                backgroundColor: color,
                borderRadius: 2,
                height: h,
                position: "absolute",
                transform: `translate(-${w / 2}px, -${h / 2}px) rotate(${rot0}deg)`,
                width: w,
              }}
            />
          ))}
        </div>
      </>
    </Timegroup>
  );
};
