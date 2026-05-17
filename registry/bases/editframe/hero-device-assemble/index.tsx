"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const MockUI = ({ accentColor }: { accentColor: string }) => (
  <div
    style={{
      background: "#0b0b0f",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT_FAMILY,
      inset: 0,
      overflow: "hidden",
      position: "absolute",
    }}
  >
    {/* Title bar */}
    <div
      style={{
        alignItems: "center",
        background: "#111118",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        gap: 8,
        height: "10%",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          height: 10,
          width: 10,
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          height: 10,
          width: 10,
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          height: 10,
          width: 10,
        }}
      />
    </div>
    <div style={{ display: "flex", flex: 1 }}>
      {/* Sidebar */}
      <div
        style={{
          background: "#0e0e14",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 16,
          width: "22%",
        }}
      >
        <div
          style={{
            background: accentColor,
            borderRadius: 4,
            height: 12,
            opacity: 0.85,
            width: "70%",
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 4,
            height: 10,
            width: "85%",
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 4,
            height: 10,
            width: "60%",
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 4,
            height: 10,
            width: "75%",
          }}
        />
      </div>
      {/* Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: 4,
            height: 18,
            width: "40%",
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.18)",
            borderRadius: 4,
            height: 10,
            width: "65%",
          }}
        />
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "1fr 1fr 1fr",
            marginTop: 12,
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              height: 90,
            }}
          />
          <div
            style={{
              background: `linear-gradient(180deg, ${accentColor}33, ${accentColor}11)`,
              border: `1px solid ${accentColor}55`,
              borderRadius: 8,
              height: 90,
            }}
          />
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              height: 90,
            }}
          />
        </div>
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            flex: 1,
          }}
        />
      </div>
    </div>
  </div>
);

export interface HeroDeviceAssembleProps {
  assembleStart?: number;
  device?: "laptop" | "phone";
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const HeroDeviceAssemble = ({
  assembleStart = 0,
  device = "laptop",
  accentColor = "#22c55e",
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: HeroDeviceAssembleProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const assembleDelayMs = assembleStart * frameMs;
  const assembleMs = ((60 / fps) * 1000) / safeSpeed;
  const settleMs = ((45 / fps) * 1000) / safeSpeed;
  const shimmerMs = ((30 / fps) * 1000) / safeSpeed;

  const isPhone = device === "phone";
  const deviceW = isPhone ? 320 : 760;
  const deviceH = isPhone ? 640 : 470;
  const screenInset = isPhone ? 12 : 18;
  const bezelRadius = isPhone ? 36 : 14;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "radial-gradient(ellipse at center, #1a1a22 0%, #050507 70%)",
    display: "flex",
    fontFamily: FONT_FAMILY,
    height,
    justifyContent: "center",
    overflow: "hidden",
    perspective: 2000,
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
          @keyframes framecn-hero-assemble-lid {
            from { transform: translateZ(1000px); }
            to { transform: translateZ(0); }
          }
          @keyframes framecn-hero-assemble-base {
            from { transform: translateZ(-800px) rotateX(78deg); }
            to { transform: translateZ(0) rotateX(0deg); }
          }
          @keyframes framecn-hero-assemble-bezel {
            from { transform: translateZ(600px); }
            to { transform: translateZ(0); }
          }
          @keyframes framecn-hero-assemble-screen {
            from { transform: translateZ(300px); opacity: 0; }
            to { transform: translateZ(0); opacity: 1; }
          }
          @keyframes framecn-hero-shimmer {
            from { transform: translateX(-100%); }
            to { transform: translateX(200%); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-hero-assemble-lid ${assembleMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${assembleDelayMs}ms backwards`,
            height: deviceH,
            position: "relative",
            transformStyle: "preserve-3d",
            width: deviceW,
          }}
        >
          {/* Back lid */}
          <div
            style={{
              animation: `framecn-hero-assemble-lid ${assembleMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${assembleDelayMs}ms backwards`,
              background: "linear-gradient(180deg, #1f2128 0%, #0e1014 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: bezelRadius + 4,
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
              inset: -4,
              position: "absolute",
            }}
          />

          {/* Keyboard / chassis base - laptop only */}
          {!isPhone && (
            <div
              style={{
                animation: `framecn-hero-assemble-base ${assembleMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${assembleDelayMs}ms backwards`,
                background: "linear-gradient(180deg, #2a2d36 0%, #14161c 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0 0 12px 12px",
                bottom: -28,
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                height: 28,
                left: -40,
                position: "absolute",
                right: -40,
              }}
            />
          )}

          {/* Bezel frame */}
          <div
            style={{
              animation: `framecn-hero-assemble-bezel ${assembleMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${assembleDelayMs}ms backwards`,
              background: "#0a0a0d",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: bezelRadius,
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.04)",
              inset: 0,
              position: "absolute",
            }}
          />

          {/* UI screen */}
          <div
            style={{
              animation: `framecn-hero-assemble-screen ${assembleMs * 0.8}ms cubic-bezier(0.16, 1, 0.3, 1) ${assembleDelayMs + assembleMs * 0.2}ms backwards`,
              background: "black",
              borderRadius: bezelRadius - 6,
              inset: screenInset,
              overflow: "hidden",
              position: "absolute",
            }}
          >
            {/* Black panel during flight */}
            <div
              style={{
                animation: `framecn-hero-assemble-screen ${settleMs}ms ease-out ${assembleDelayMs + assembleMs}ms forwards`,
                inset: 0,
                position: "absolute",
              }}
            />
            {/* UI fades in */}
            <div
              style={{
                animation: `framecn-hero-assemble-screen ${shimmerMs}ms ease-out ${assembleDelayMs + assembleMs + settleMs}ms backwards`,
                inset: 0,
                position: "absolute",
              }}
            >
              <MockUI accentColor={accentColor} />
            </div>
            {/* Shimmer sweep */}
            <div
              style={{
                animation: `framecn-hero-shimmer ${shimmerMs}ms ease-in-out ${assembleDelayMs + assembleMs + settleMs + 100}ms backwards`,
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                inset: 0,
                mixBlendMode: "screen",
                pointerEvents: "none",
                position: "absolute",
              }}
            />
          </div>
        </div>
      </>
    </Timegroup>
  );
};
