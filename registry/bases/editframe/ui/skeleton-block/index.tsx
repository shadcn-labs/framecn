"use client";

import { useEffect, useRef } from "react";

export interface SkeletonBlockProps {
  width?: number;
  height?: number;
  radius?: number;
  baseColor?: string;
  speed?: number;
  flexShrink?: number;
  className?: string;
}

export function SkeletonBlock({
  width = 200,
  height = 20,
  radius,
  baseColor = "oklch(0.92 0 0)",
  speed = 1,
  flexShrink = 1,
  className,
}: SkeletonBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = `${1.8 / speed}s`;
    el.style.animation = `skeleton-shimmer ${duration} ease-in-out infinite`;
  }, [speed]);

  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      <div
        ref={ref}
        className={className}
        style={{
          background: baseColor,
          borderRadius: radius ?? 6,
          flexShrink,
          height,
          width,
        }}
      />
    </>
  );
}
