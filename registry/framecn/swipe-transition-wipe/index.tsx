"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

export interface SwipeTransitionWipeProps {
  sceneA?: ReactNode;
  sceneB?: ReactNode;
  labelA?: string;
  labelB?: string;
  colorA1?: string;
  colorA2?: string;
  colorB1?: string;
  colorB2?: string;
  background?: string;
  direction?: "left" | "right";
  swipeAt?: number;
  parallaxFactor?: number;
  dimStrength?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultScene = ({
  label,
  c1,
  c2,
}: {
  label: string;
  c1: string;
  c2: string;
}) => (
  <div
    style={{
      alignItems: "center",
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 128,
      fontWeight: 700,
      inset: 0,
      justifyContent: "center",
      letterSpacing: "-0.05em",
      position: "absolute",
      textShadow: "0 8px 40px rgba(0,0,0,0.35)",
    }}
  >
    {label}
  </div>
);

const ParallaxBackground = ({ background }: { background: string }) => {
  const dots: { x: number; y: number }[] = [];
  const cols = 40;
  const rows = 12;
  const gapX = 64;
  const gapY = 64;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      dots.push({ x: c * gapX + 32, y: r * gapY + 32 });
    }
  }
  return (
    <div
      style={{
        background,
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: "200%",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ inset: 0, position: "absolute" }}
      >
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={2}
            fill="rgba(255,255,255,0.08)"
          />
        ))}
      </svg>
    </div>
  );
};

export const SwipeTransitionWipe = ({
  sceneA,
  sceneB,
  labelA = "First",
  labelB = "Second",
  colorA1 = "#0ea5e9",
  colorA2 = "#1e3a8a",
  colorB1 = "#f97316",
  colorB2 = "#9333ea",
  background = "#050505",
  direction = "left",
  swipeAt = 30,
  parallaxFactor = 0.6,
  dimStrength = 0.4,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: SwipeTransitionWipeProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  // 50 frames spring duration
  const swipeAnimationDurationMs = (50 * frameMs) / speed;
  const swipeDelayMs = (swipeAt * frameMs) / speed;

  const baseOffset = direction === "left" ? 0 : -100;
  const parallaxDelta = 50 * (direction === "left" ? -1 : 1) * parallaxFactor;

  const containerStyle = {
    background,
    inset: 0,
    overflow: "hidden",
    position: "absolute",
  } as CSSProperties;

  const sceneAContent = sceneA ?? (
    <DefaultScene label={labelA} c1={colorA1} c2={colorA2} />
  );
  const sceneBContent = sceneB ?? (
    <DefaultScene label={labelB} c1={colorB1} c2={colorB2} />
  );

  const orderedScenes =
    direction === "left"
      ? [sceneAContent, sceneBContent]
      : [sceneBContent, sceneAContent];

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-swipe-foreground-left {
            from { transform: translateX(0%); }
            to { transform: translateX(-100%); }
          }
          @keyframes framecn-swipe-foreground-right {
            from { transform: translateX(-100%); }
            to { transform: translateX(0%); }
          }
          @keyframes framecn-swipe-parallax {
            from { transform: translateX(0%); }
            to { transform: translateX(${parallaxDelta}%); }
          }
          @keyframes framecn-swipe-dim {
            from { opacity: 0; }
            to { opacity: ${dimStrength}; }
          }
        `}</style>
        {/* Parallax background layer */}
        <div
          style={{
            animation: `framecn-swipe-parallax ${swipeAnimationDurationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${swipeDelayMs}ms forwards`,
            inset: 0,
            position: "absolute",
            willChange: "transform",
          }}
        >
          <ParallaxBackground background={background} />
        </div>

        {/* Foreground slider */}
        <div
          style={{
            animation: `framecn-swipe-foreground-${direction} ${swipeAnimationDurationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${swipeDelayMs}ms forwards`,
            display: "flex",
            inset: 0,
            position: "absolute",
            transform: `translateX(${baseOffset}%)`,
            width: "200%",
            willChange: "transform",
          }}
        >
          {orderedScenes.map((scene, i) => {
            const isOutgoing =
              (direction === "left" && i === 0) ||
              (direction === "right" && i === 1);
            return (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                  width: "50%",
                }}
              >
                {scene}
                {isOutgoing && (
                  <div
                    style={{
                      animation: `framecn-swipe-dim ${swipeAnimationDurationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${swipeDelayMs}ms forwards`,
                      background: `rgba(0,0,0,0)`,
                      inset: 0,
                      pointerEvents: "none",
                      position: "absolute",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
