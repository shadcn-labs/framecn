"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface BentoItem {
  title: string;
  body?: string;
  span?: 1 | 2;
}

export interface StaggeredBentoGridProps {
  items?: BentoItem[];
  staggerDelay?: number;
  columns?: number;
  background?: string;
  cardColor?: string;
  textColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS: BentoItem[] = [
  { body: "Built on Editframe", span: 2, title: "Fast" },
  { body: "Spring physics", title: "Animated" },
  { body: "Drop-in blocks", title: "Composable" },
  { body: "Tailwind ready", title: "Themed" },
  { body: "First-class TS", title: "Typed" },
  { body: "MIT licensed", span: 2, title: "Open" },
  { body: "Zero runtime cost", title: "Tiny" },
];

export const StaggeredBentoGrid = ({
  items = DEFAULT_ITEMS,
  staggerDelay = 8,
  columns = 3,
  background = "#0a0a0a",
  cardColor = "#1a1a1a",
  textColor = "white",
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: StaggeredBentoGridProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const staggerMs = (staggerDelay * frameMs) / speed;
  const cardAnimationDurationMs = 600;

  const containerStyle = {
    alignItems: "center",
    background,
    display: "flex",
    inset: 0,
    justifyContent: "center",
    padding: 64,
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
          @keyframes framecn-bento-card-enter {
            from {
              opacity: 0;
              transform: scale(0.85);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            maxWidth: 1100,
            width: "100%",
          }}
        >
          {items.map((item, index) => {
            const animationDelay = index * staggerMs;
            return (
              <div
                key={index}
                style={{
                  animation: `framecn-bento-card-enter ${cardAnimationDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}ms backwards`,
                  background: cardColor,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  gridColumn: `span ${item.span ?? 1}`,
                  justifyContent: "flex-end",
                  minHeight: 140,
                  padding: 24,
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  style={{
                    color: textColor,
                    fontFamily: FONT_FAMILY,
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                {item.body ? (
                  <div
                    style={{
                      color: textColor,
                      fontFamily: FONT_FAMILY,
                      fontSize: 16,
                      fontWeight: 400,
                      opacity: 0.6,
                    }}
                  >
                    {item.body}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
