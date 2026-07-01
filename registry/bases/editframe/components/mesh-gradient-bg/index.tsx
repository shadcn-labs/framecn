"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface MeshGradientBgProps {
  colors?: string[];
  speed?: number;
  blur?: number;
  background?: string;
  className?: string;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

export const MeshGradientBg = ({
  colors = ["#ff0080", "#7928ca", "#00d4ff", "#ffb800"],
  speed = 1,
  blur = 80,
  background = "#0a0a0a",
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: MeshGradientBgProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const cycleMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  // Create blob animations with different phases
  const blobs = colors.map((color, i) => {
    // offset each blob's animation
    const phase = i * 1.57;
    return { color, index: i, phase };
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
          @keyframes framecn-mesh-blob {
            0% { transform: translate(0%, 0%) scale(1); }
            25% { transform: translate(20%, -15%) scale(1.1); }
            50% { transform: translate(-10%, 20%) scale(0.9); }
            75% { transform: translate(-20%, -10%) scale(1.05); }
            100% { transform: translate(0%, 0%) scale(1); }
          }
        `}</style>
        {blobs.map((blob) => (
          <div
            key={`blob-${blob.index}`}
            style={{
              animation: `framecn-mesh-blob ${cycleMs + blob.phase * 1000}ms linear infinite`,
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              borderRadius: "50%",
              filter: `blur(${blur}px)`,
              height: "55%",
              left: `${30 + blob.index * 15}%`,
              mixBlendMode: "screen",
              position: "absolute",
              top: `${20 + blob.index * 20}%`,
              transformOrigin: "center",
              width: "55%",
            }}
          />
        ))}
      </>
    </Timegroup>
  );
};
