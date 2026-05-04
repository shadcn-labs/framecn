"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface AIGenerationCanvasProps {
  prompt?: string;
  accentColor?: string;
  cardCount?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const MiniBarChart = ({ accentColor }: { accentColor: string }) => {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.5, 0.95, 0.65];
  return (
    <div
      style={{
        alignItems: "flex-end",
        display: "flex",
        gap: 6,
        height: 60,
        marginTop: 12,
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            background: accentColor,
            borderRadius: 3,
            flex: 1,
            height: `${h * 100}%`,
            opacity: 0.3 + h * 0.7,
          }}
        />
      ))}
    </div>
  );
};

const MiniRows = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 12,
    }}
  >
    {[0.9, 0.7, 0.85, 0.6].map((w, i) => (
      <div
        key={i}
        style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: 4,
          height: 8,
          width: `${w * 100}%`,
        }}
      />
    ))}
  </div>
);

const StatBlock = ({
  accentColor,
  value,
}: {
  accentColor: string;
  value: string;
}) => (
  <div style={{ marginTop: 8 }}>
    <div
      style={{
        color: "white",
        fontFamily: FONT_FAMILY,
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: "-0.03em",
      }}
    >
      {value}
    </div>
    <div
      style={{
        color: accentColor,
        fontSize: 12,
        fontWeight: 500,
        marginTop: 2,
      }}
    >
      +12.4% this week
    </div>
  </div>
);

const CardContent = ({
  index,
  accentColor,
}: {
  index: number;
  accentColor: string;
}) => {
  const titles = [
    "Revenue",
    "Active Users",
    "Sessions",
    "Conversion",
    "Retention",
    "Latency",
  ];
  const values = ["$48.2k", "12,840", "9.1k", "3.8%", "76%", "142ms"];
  const variant = index % 3;

  let content;
  if (variant === 0) {
    content = (
      <>
        <StatBlock
          accentColor={accentColor}
          value={values[index % values.length]}
        />
        <MiniBarChart accentColor={accentColor} />
      </>
    );
  } else if (variant === 1) {
    content = (
      <>
        <StatBlock
          accentColor={accentColor}
          value={values[index % values.length]}
        />
        <MiniRows />
      </>
    );
  } else {
    content = (
      <>
        <MiniBarChart accentColor={accentColor} />
        <MiniRows />
      </>
    );
  }

  return (
    <div style={{ height: "100%", padding: 18, width: "100%" }}>
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: FONT_FAMILY,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {titles[index % titles.length]}
      </div>
      {content}
    </div>
  );
};

export const AIGenerationCanvas = ({
  prompt = "Generate a dashboard",
  accentColor = "#7c3aed",
  cardCount = 4,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  className,
}: AIGenerationCanvasProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  // Phase boundaries (as percentages)
  const P1_END = (40 / durationInFrames) * 100;
  const P2_END = (70 / durationInFrames) * 100;
  const P3_END = (100 / durationInFrames) * 100;
  const phase4Start = (100 / durationInFrames) * 100;

  const style = {
    background: "#0a0a0a",
    fontFamily: FONT_FAMILY,
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-ai-canvas-typewriter {
            from {
              max-width: 0;
            }
            ${P1_END}% {
              max-width: 640px;
            }
            ${P2_END}% {
              max-width: 1200px;
            }
            100% {
              max-width: 1200px;
            }
          }

          @keyframes framecn-ai-canvas-input-transform {
            from {
              top: 320px;
              width: 640px;
              height: 80px;
              margin-left: -320px;
              border-radius: 16px;
              font-size: 24px;
              box-shadow: 0 0 0 6px ${accentColor}11, 0 30px 80px rgba(0,0,0,0.6);
            }
            ${P2_END}% {
              top: 40px;
              width: 1200px;
              height: 56px;
              margin-left: -600px;
              border-radius: 12px;
              font-size: 14px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            }
            100% {
              top: 40px;
              width: 1200px;
              height: 56px;
              margin-left: -600px;
              border-radius: 12px;
              font-size: 14px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            }
          }

          @keyframes framecn-ai-canvas-skeleton-fade {
            from {
              opacity: 0;
            }
            ${P2_END}% {
              opacity: 0;
            }
            ${P3_END}% {
              opacity: 1;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes framecn-ai-canvas-card-flip {
            from {
              transform: rotateY(0deg);
            }
            50% {
              transform: rotateY(90deg);
            }
            100% {
              transform: rotateY(180deg);
            }
          }

          @keyframes framecn-ai-canvas-shimmer {
            from {
              background-position: -200% 0;
            }
            to {
              background-position: 200% 0;
            }
          }

          @keyframes framecn-ai-canvas-cursor-blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }

          @keyframes framecn-ai-canvas-status-fade {
            from {
              opacity: 0;
            }
            ${P2_END}% {
              opacity: 0;
            }
            ${P3_END}% {
              opacity: 1;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>

        {/* Subtle grid backdrop */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            inset: 0,
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            position: "absolute",
          }}
        />

        {/* Prompt input — centered then transforms to header */}
        <div
          style={{
            alignItems: "center",
            animation: `framecn-ai-canvas-input-transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            backdropFilter: "blur(12px)",
            background: "rgba(20,20,22,0.85)",
            border: `1px solid ${accentColor}55`,
            borderRadius: 16,
            display: "flex",
            height: 80,
            left: "50%",
            marginLeft: -320,
            padding: "0 20px",
            position: "absolute",
            top: 320,
            width: 640,
          }}
        >
          {/* Sparkle icon */}
          <div
            style={{
              alignItems: "center",
              color: accentColor,
              display: "flex",
              flexShrink: 0,
              height: 20,
              justifyContent: "center",
              marginRight: 12,
              width: 20,
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
            </svg>
          </div>
          <div
            style={{
              animation: `framecn-ai-canvas-typewriter ${durationMs * 0.3}ms steps(${prompt.length}) forwards`,
              color: "white",
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {prompt}
            <span
              style={{
                animation: `framecn-ai-canvas-cursor-blink 0.8s ease-in-out infinite`,
                background: accentColor,
                display: "inline-block",
                height: 24,
                marginLeft: 2,
                verticalAlign: "middle",
                width: 2,
              }}
            />
          </div>
          <div
            style={{
              alignItems: "center",
              animation: `framecn-ai-canvas-status-fade ${durationMs}ms ease-out forwards`,
              display: "flex",
              gap: 8,
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                background: accentColor,
                borderRadius: 4,
                boxShadow: `0 0 12px ${accentColor}`,
                height: 8,
                width: 8,
              }}
            />
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Generating
            </div>
          </div>
        </div>

        {/* Skeleton + content cards grid (Phase 3 onward) */}
        <div
          style={{
            animation: `framecn-ai-canvas-skeleton-fade ${durationMs}ms ease-out forwards`,
            bottom: 40,
            display: "grid",
            gap: 20,
            gridTemplateColumns: `repeat(${Math.min(cardCount, 4)}, 1fr)`,
            left: 40,
            position: "absolute",
            right: 40,
            top: 130,
          }}
        >
          {Array.from({ length: cardCount }).map((_, i) => (
            <div
              key={i}
              style={{
                perspective: 1200,
                position: "relative",
              }}
            >
              <div
                style={{
                  animation: `framecn-ai-canvas-card-flip ${900 - i * 100}ms cubic-bezier(0.16, 1, 0.3, 1) ${phase4Start}ms backwards`,
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  width: "100%",
                }}
              >
                {/* Skeleton face */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    background: "#141416",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    inset: 0,
                    overflow: "hidden",
                    position: "absolute",
                  }}
                >
                  {/* Shimmer overlay */}
                  <div
                    style={{
                      animation: "framecn-ai-canvas-shimmer 2s linear infinite",
                      background: `linear-gradient(110deg, transparent 0%, transparent 30%, ${accentColor}22 45%, transparent 60%, transparent 100%)`,
                      backgroundSize: "200% 100%",
                      inset: 0,
                      position: "absolute",
                    }}
                  />
                  <div style={{ padding: 18 }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        height: 10,
                        width: "40%",
                      }}
                    />
                    <div
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 6,
                        height: 28,
                        marginTop: 14,
                        width: "70%",
                      }}
                    />
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 6,
                        height: 60,
                        marginTop: 16,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                {/* Content face */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    background: "#141416",
                    border: `1px solid ${accentColor}33`,
                    borderRadius: 14,
                    boxShadow: `0 0 0 1px ${accentColor}22, 0 20px 40px rgba(0,0,0,0.4)`,
                    inset: 0,
                    overflow: "hidden",
                    position: "absolute",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardContent index={i} accentColor={accentColor} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
