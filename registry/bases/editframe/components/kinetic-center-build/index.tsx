"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { Input } from "@/registry/bases/editframe/ui/input";
import { Button } from "@/registry/bases/editframe/ui/button";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

export interface KineticCenterBuildProps {
  accentColor?: string;
  projectName?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const BUILD_STEPS = [
  { label: "Install dependencies", icon: "📦", duration: 0.15 },
  { label: "Compile TypeScript", icon: "⚙️", duration: 0.2 },
  { label: "Bundle assets", icon: "📦", duration: 0.15 },
  { label: "Run tests", icon: "✅", duration: 0.15 },
  { label: "Deploy to edge", icon: "🚀", duration: 0.2 },
];

export function KineticCenterBuild({
  accentColor = "#22c55e",
  projectName = "my-app",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: KineticCenterBuildProps) {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#09090b",
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
          @keyframes framecn-kcb-pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes framecn-kcb-step-in {
            from { opacity: 0; transform: translateX(-12px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes framecn-kcb-check {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes framecn-kcb-orbit {
            from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
          }
        `}</style>

        {/* Background grid */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Center glow */}
        <div
          style={{
            background: `radial-gradient(circle at center, ${accentColor}22, transparent 60%)`,
            height: 400,
            position: "absolute",
            width: 400,
          }}
        />

        {/* Orbiting ring */}
        <div
          style={{
            animation: `framecn-kcb-orbit ${durationMs * 0.8}ms linear infinite`,
            borderRadius: "50%",
            border: `1px solid ${accentColor}33`,
            height: 360,
            position: "absolute",
            width: 360,
          }}
        >
          <div
            style={{
              background: accentColor,
              borderRadius: "50%",
              boxShadow: `0 0 20px ${accentColor}`,
              height: 12,
              position: "absolute",
              top: -6,
              left: "50%",
              marginLeft: -6,
              width: 12,
            }}
          />
        </div>

        {/* Main build panel */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 32,
            position: "relative",
            width: 480,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 12,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: `${accentColor}22`,
                borderRadius: 10,
                display: "flex",
                height: 40,
                justifyContent: "center",
                width: 40,
              }}
            >
              <span style={{ fontSize: 20 }}>🏗️</span>
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Building {projectName}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: MONO_FAMILY,
                  fontSize: 12,
                }}
              >
                Production build
              </div>
            </div>
          </div>

          {/* Steps */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {BUILD_STEPS.map((step, i) => {
              const stepStart = 0.1 + BUILD_STEPS.slice(0, i).reduce((s, e) => s + e.duration, 0);
              const stepEnd = stepStart + step.duration;
              return (
                <div
                  key={i}
                  style={{
                    alignItems: "center",
                    animation: `framecn-kcb-step-in 400ms ease-out ${(stepStart * durationMs) / safeSpeed}ms backwards`,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                    display: "flex",
                    gap: 12,
                    padding: "10px 14px",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{step.icon}</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      flex: 1,
                      fontFamily: FONT_FAMILY,
                      fontSize: 14,
                    }}
                  >
                    {step.label}
                  </span>
                  <div
                    style={{
                      animation: `framecn-kcb-check 300ms ease-out ${((stepEnd * durationMs) / safeSpeed) - 200}ms backwards`,
                      color: accentColor,
                      fontFamily: MONO_FAMILY,
                      fontSize: 12,
                    }}
                  >
                    ✓
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 4,
              height: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                animation: `framecn-kcb-pulse ${durationMs}ms ease-in-out forwards`,
                background: accentColor,
                borderRadius: 4,
                height: "100%",
                width: "100%",
              }}
            />
          </div>
        </div>
      </>
    </Timegroup>
  );
}
