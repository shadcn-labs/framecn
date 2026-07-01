"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface MorphingModalRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface MorphingModalProps {
  from?: MorphingModalRect;
  to?: MorphingModalRect;
  borderRadiusFrom?: number;
  borderRadiusTo?: number;
  morphAt?: number;
  background?: string;
  cardColor?: string;
  textColor?: string;
  mutedColor?: string;
  source?: ReactNode;
  modal?: ReactNode;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_FROM: MorphingModalRect = {
  height: 200,
  left: 460,
  top: 260,
  width: 360,
};

const DEFAULT_TO: MorphingModalRect = {
  height: 600,
  left: 80,
  top: 60,
  width: 1120,
};

export const MorphingModal = ({
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  borderRadiusFrom = 24,
  borderRadiusTo = 0,
  morphAt = 30,
  background = "#050505",
  cardColor = "#0a0a0a",
  textColor = "#fafafa",
  mutedColor = "#71717a",
  source,
  modal,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: MorphingModalProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const morphStartMs = morphAt * frameMs;
  const morphMs = (((durationInFrames * 0.67) / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    background,
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-morph-card {
            0% { left: ${from.left}px; top: ${from.top}px; width: ${from.width}px; height: ${from.height}px; border-radius: ${borderRadiusFrom}px; }
            100% { left: ${to.left}px; top: ${to.top}px; width: ${to.width}px; height: ${to.height}px; border-radius: ${borderRadiusTo}px; }
          }
          @keyframes framecn-morph-source {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes framecn-morph-modal {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          @keyframes framecn-morph-backdrop {
            from { background: rgba(0,0,0,0); }
            to { background: rgba(0,0,0,0.8); }
          }
        `}</style>

        {/* Backdrop */}
        <div
          style={{
            animation: `framecn-morph-backdrop ${morphMs}ms ease-out ${morphStartMs}ms backwards`,
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Source content */}
        <div
          style={{
            animation: `framecn-morph-source ${morphMs * 0.33}ms ease-out ${morphStartMs}ms forwards`,
            inset: 0,
            position: "absolute",
          }}
        >
          {source ?? (
            <div
              style={{
                background: cardColor,
                borderRadius: borderRadiusFrom,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                height: from.height,
                justifyContent: "flex-end",
                left: from.left,
                padding: 28,
                position: "absolute",
                top: from.top,
                width: from.width,
              }}
            >
              <div
                style={{
                  color: textColor,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Compose video
              </div>
              <div style={{ color: mutedColor, fontSize: 14 }}>
                Click to start a new project
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <div
          style={{
            animation: `framecn-morph-modal ${morphMs * 0.67}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphStartMs + morphMs * 0.33}ms backwards`,
            inset: 0,
            position: "absolute",
          }}
        >
          {modal ?? (
            <div
              style={{
                background: cardColor,
                borderRadius: borderRadiusTo,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                height: to.height,
                left: to.left,
                padding: 64,
                position: "absolute",
                top: to.top,
                width: to.width,
              }}
            >
              <div
                style={{
                  color: textColor,
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                New project
              </div>
              <div
                style={{
                  color: mutedColor,
                  fontSize: 20,
                  lineHeight: 1.55,
                  maxWidth: 720,
                }}
              >
                Pick a template, drop your assets, and ship a 30s video in under
                five minutes. Everything renders deterministically.
              </div>
              <div
                style={{
                  background: textColor,
                  borderRadius: 12,
                  color: cardColor,
                  display: "inline-flex",
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 12,
                  padding: "12px 22px",
                }}
              >
                Get started
              </div>
            </div>
          )}
        </div>
      </>
    </Timegroup>
  );
};
