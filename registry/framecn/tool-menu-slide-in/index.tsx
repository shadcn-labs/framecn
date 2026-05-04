"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface ToolMenuSlideInProps {
  panelStartFrame?: number;
  iconStagger?: number;
  iconCount?: number;
  accent?: string;
  panelColor?: string;
  background?: string;
  iconBg?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const ICON_GLYPHS = ["B", "S", "C", "P", "E", "T", "M", "L"];
const PANEL_SLIDE_DURATION = 22;

const FPS = 30;
const DURATION_IN_FRAMES = 90;

export const ToolMenuSlideIn = ({
  panelStartFrame = 18,
  iconStagger = 4,
  iconCount = 5,
  accent = "#a78bfa",
  panelColor = "rgba(18, 18, 22, 0.72)",
  background = "#070708",
  iconBg = "rgba(255,255,255,0.06)",
  _speed = 1,
  fps = FPS,
  durationInFrames = DURATION_IN_FRAMES,
  className,
}: ToolMenuSlideInProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const safeIconCount = Math.max(1, Math.min(8, Math.floor(iconCount)));

  const panelStartPercent = (panelStartFrame / durationInFrames) * 100;
  const panelSlideEndPercent =
    ((panelStartFrame + PANEL_SLIDE_DURATION) / durationInFrames) * 100;
  const _staggerMs = (iconStagger / fps) * 1000;

  const ICON_SIZE = 64;
  const ICON_GAP = 14;
  const PANEL_PADDING = 14;
  const panelInnerWidth =
    safeIconCount * ICON_SIZE + (safeIconCount - 1) * ICON_GAP;
  const panelWidth = panelInnerWidth + PANEL_PADDING * 2;
  const panelHeight = ICON_SIZE + PANEL_PADDING * 2;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          fontFamily: FONT_FAMILY,
          inset: 0,
          overflow: "hidden",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-panel-slide {
            ${panelStartPercent}% {
              opacity: 0;
              transform: translateX(-50%) translateY(120%);
            }
            ${panelSlideEndPercent}% {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          @keyframes framecn-icon-pop {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            60% {
              opacity: 1;
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

        {/* Top toolbar */}
        <div
          style={{
            alignItems: "center",
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            display: "flex",
            gap: 10,
            height: 44,
            left: 24,
            padding: "0 14px",
            position: "absolute",
            right: 24,
            top: 24,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              height: 10,
              width: 10,
            }}
          />
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              height: 10,
              width: 10,
            }}
          />
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              height: 10,
              width: 10,
            }}
          />
          <div
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: 12,
              letterSpacing: "0.02em",
              marginLeft: 16,
            }}
          >
            editor — untitled.png
          </div>
        </div>

        {/* Centered placeholder canvas */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -40px 80px rgba(0,0,0,0.45), 0 30px 80px rgba(0,0,0,0.5)",
            height: 420,
            left: "50%",
            overflow: "hidden",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -54%)",
            width: 720,
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(60% 80% at 50% 40%, rgba(255,255,255,0.06), transparent 70%)",
              inset: 0,
              position: "absolute",
            }}
          />
        </div>

        {/* The slide-in tool menu */}
        <div
          style={{
            WebkitBackdropFilter: "blur(20px)",
            alignItems: "center",
            animation: `framecn-panel-slide ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            backdropFilter: "blur(20px)",
            background: panelColor,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: panelHeight / 2,
            bottom: 60,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.08)",
            display: "flex",
            gap: ICON_GAP,
            height: panelHeight,
            left: "50%",
            padding: PANEL_PADDING,
            position: "absolute",
            width: panelWidth,
          }}
        >
          {Array.from({ length: safeIconCount }).map((_, i) => {
            const isActive = i === 0;
            const animationDelay =
              (panelStartFrame + PANEL_SLIDE_DURATION + iconStagger * i) *
              (1000 / fps);

            return (
              <div
                key={i}
                style={{
                  alignItems: "center",
                  animation: `framecn-icon-pop ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}ms forwards`,
                  background: isActive
                    ? `linear-gradient(180deg, ${accent}33, ${accent}14)`
                    : iconBg,
                  border: isActive
                    ? `1px solid ${accent}55`
                    : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  boxShadow: isActive
                    ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 24px ${accent}33`
                    : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 600,
                  height: ICON_SIZE,
                  justifyContent: "center",
                  letterSpacing: "-0.01em",
                  transformOrigin: "center",
                  width: ICON_SIZE,
                }}
              >
                {ICON_GLYPHS[i % ICON_GLYPHS.length]}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
