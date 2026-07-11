"use client";

import { useCurrentFrame, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";

export interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  radius?: number;
  speed?: number;
  baseColor?: string;
  highlightColor?: string;
  flexShrink?: number;
  className?: string;
}
const SWEEP_FRAMES = 60;
export const SkeletonBlock = ({
  width = 120,
  height = 16,
  radius = 6,
  speed = 1,
  baseColor,
  highlightColor,
  flexShrink,
  className,
}: SkeletonBlockProps) => {
  const theme = useFramecnTheme();
  const base = baseColor ?? theme.muted;
  const highlight = highlightColor ?? mixOklch(base, theme.foreground, 0.13);
  const frame = useCurrentFrame() * speed;
  const progress = (frame % SWEEP_FRAMES) / SWEEP_FRAMES;
  const positionX = 100 - progress * 200;
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(90deg, ${base} 20%, ${highlight} 50%, ${base} 80%)`,
        backgroundPosition: `${positionX}% 0`,
        backgroundSize: "200% 100%",
        borderRadius: radius,
        flexShrink,
        height,
        width,
      }}
    />
  );
};
