"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultScreen = () => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)",
      color: "white",
      display: "flex",
      fontFamily: FONT_FAMILY,
      fontSize: 32,
      fontWeight: 700,
      inset: 0,
      justifyContent: "center",
      letterSpacing: "-0.03em",
      position: "absolute",
    }}
  >
    Your UI
  </div>
);

export interface DeviceMockupZoomProps {
  children?: ReactNode;
  device?: "laptop" | "phone";
  frameColor?: string;
  screenColor?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const DeviceMockupZoom = ({
  children,
  device = "laptop",
  frameColor = "#1f1f1f",
  screenColor = "#0a0a0a",
  background = "#fafafa",
  speed = 1,
  fps = 30,
  durationInFrames = 120,
  width = 1280,
  height = 720,
  className,
}: DeviceMockupZoomProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const scaleDurationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const screen = children ?? <DefaultScreen />;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height,
    justifyContent: "center",
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
          @keyframes framecn-device-zoom {
            from { transform: scale(2); }
            to { transform: scale(1); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-device-zoom ${scaleDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1) backwards`,
            transformOrigin: "center center",
          }}
        >
          {device === "laptop" ? (
            <div style={{ position: "relative" }}>
              {/* Screen body */}
              <div
                style={{
                  background: frameColor,
                  borderRadius: 16,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
                  height: 440,
                  padding: 16,
                  width: 720,
                }}
              >
                <div
                  style={{
                    background: screenColor,
                    borderRadius: 6,
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {screen}
                </div>
              </div>
              {/* Base */}
              <div
                style={{
                  background: frameColor,
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                  height: 18,
                  marginLeft: -50,
                  marginTop: -2,
                  width: 820,
                }}
              />
              <div
                style={{
                  background: "#0a0a0a",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  height: 6,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: -1,
                  width: 120,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                background: frameColor,
                borderRadius: 44,
                boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
                height: 560,
                padding: 14,
                position: "relative",
                width: 280,
              }}
            >
              <div
                style={{
                  background: screenColor,
                  borderRadius: 32,
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                }}
              >
                {screen}
              </div>
              <div
                style={{
                  background: "#0a0a0a",
                  borderRadius: 14,
                  height: 22,
                  left: "50%",
                  position: "absolute",
                  top: 22,
                  transform: "translateX(-50%)",
                  width: 90,
                }}
              />
            </div>
          )}
        </div>
      </>
    </Timegroup>
  );
};
