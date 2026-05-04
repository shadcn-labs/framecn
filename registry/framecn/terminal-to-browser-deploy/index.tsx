"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface TerminalToBrowserDeployProps {
  siteUrl?: string;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const fps = 30;
const durationInFrames = 210;

const MacDots = ({ size = 12 }: { size?: number }) => (
  <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <div
        key={c}
        style={{
          background: c,
          borderRadius: "50%",
          height: size,
          opacity: 0.85,
          width: size,
        }}
      />
    ))}
  </div>
);

const TerminalHeader = () => (
  <div
    style={{
      alignItems: "center",
      background: "rgba(255,255,255,0.02)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      height: 36,
      paddingLeft: 14,
    }}
  >
    <MacDots />
    <div
      style={{
        color: "rgba(255,255,255,0.45)",
        flex: 1,
        fontFamily: MONO_FAMILY,
        fontSize: 12,
        marginRight: 56,
        textAlign: "center",
      }}
    >
      ~/project — zsh
    </div>
  </div>
);

export const TerminalToBrowserDeploy = ({
  siteUrl = "https://app.example.com",
  accentColor = "#22c55e",
  _speed = 1,
  fps: _fps = fps,
  durationInFrames: _durationInFrames = durationInFrames,
  className,
}: TerminalToBrowserDeployProps) => {
  const durationMs = (_durationInFrames / _fps) * 1000;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: "#050505",
          fontFamily: FONT_FAMILY,
          inset: 0,
          overflow: "hidden",
          position: "absolute",
        } as CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-terminal-typewriter-1 {
            0%, 9.5% { opacity: 0; }
            10% { opacity: 1; width: 0; }
            45% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-typewriter-2 {
            0%, 34.5% { opacity: 0; }
            35% { opacity: 1; width: 0; }
            65% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-typewriter-3 {
            0%, 54.5% { opacity: 0; }
            55% { opacity: 1; width: 0; }
            85% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-typewriter-4 {
            0%, 74.5% { opacity: 0; }
            75% { opacity: 1; width: 0; }
            95% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-typewriter-5 {
            0%, 94.5% { opacity: 0; }
            95% { opacity: 1; width: 0; }
            115% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-typewriter-6 {
            0%, 119.5% { opacity: 0; }
            120% { opacity: 1; width: 0; }
            150% { width: 100%; }
            100% { width: 100%; }
          }

          @keyframes framecn-terminal-collapse {
            0%, 73.8% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0px);
            }
            82.4% {
              opacity: 0.35;
              transform: scale(0.8);
              filter: blur(10px);
            }
            100% {
              opacity: 0.35;
              transform: scale(0.8);
              filter: blur(10px);
            }
          }

          @keyframes framecn-browser-entry {
            0%, 75.7% {
              opacity: 0;
              transform: scale(0.3);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .framecn-terminal-line {
            white-space: pre;
            overflow: hidden;
            display: inline-block;
          }

          .framecn-cursor {
            display: inline-block;
            width: 8px;
            height: 18px;
            background: rgba(255,255,255,0.85);
            vertical-align: text-bottom;
            margin-left: 2px;
            animation: framecn-blink 0.6s step-end infinite;
          }

          @keyframes framecn-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* subtle backdrop */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, #0f172a 0%, #050505 70%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Terminal */}
        <div
          style={{
            animation: `framecn-terminal-collapse ${durationMs}ms ease-in-out forwards`,
            background: "rgba(15,15,17,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            height: 360,
            left: 230,
            overflow: "hidden",
            position: "absolute",
            top: 180,
            transformOrigin: "center center",
            width: 820,
          }}
        >
          <TerminalHeader />
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: MONO_FAMILY,
              fontSize: 16,
              lineHeight: "30px",
              padding: "22px 22px",
            }}
          >
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-1 ${durationMs}ms steps(16, end) forwards`,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              $ pnpm deploy
            </div>
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-2 ${durationMs}ms steps(22, end) forwards`,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              → Building project...
            </div>
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-3 ${durationMs}ms steps(22, end) forwards`,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              → Bundling assets...
            </div>
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-4 ${durationMs}ms steps(23, end) forwards`,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              → Optimizing images...
            </div>
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-5 ${durationMs}ms steps(14, end) forwards`,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              → Uploading...
            </div>
            <div
              className="framecn-terminal-line"
              style={{
                animation: `framecn-terminal-typewriter-6 ${durationMs}ms steps(26, end) forwards`,
                color: accentColor,
              }}
            >
              ✓ Deployed to {siteUrl}
              <span className="framecn-cursor" />
            </div>
          </div>
        </div>

        {/* Browser window — emerges from terminal */}
        <div
          style={{
            animation: `framecn-browser-entry ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            height: 560,
            left: 150,
            overflow: "hidden",
            position: "absolute",
            top: 80,
            transformOrigin: "20% 48%",
            width: 980,
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              alignItems: "center",
              background: "rgba(20,20,22,0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 14,
              height: 44,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <MacDots />
            <div
              style={{
                alignItems: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 13,
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                flex: 1,
                fontFamily: MONO_FAMILY,
                fontSize: 12,
                height: 26,
                justifyContent: "center",
              }}
            >
              {siteUrl}
            </div>
            <div style={{ width: 60 }} />
          </div>
          {/* Page */}
          <div
            style={{
              alignItems: "flex-start",
              background:
                "linear-gradient(180deg, #0a0a0a 0%, #111118 60%, #0a0a0a 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              inset: "44px 0 0 0",
              padding: "60px 80px",
              position: "absolute",
            }}
          >
            {/* nav */}
            <div
              style={{
                alignItems: "center",
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                fontFamily: FONT_FAMILY,
                fontSize: 14,
                justifyContent: "space-between",
                left: 80,
                position: "absolute",
                right: 80,
                top: 22,
              }}
            >
              <div style={{ color: "white", fontWeight: 600 }}>Acme</div>
              <div style={{ display: "flex", gap: 24 }}>
                <span>Features</span>
                <span>Pricing</span>
                <span>Docs</span>
              </div>
            </div>

            {/* abstract shape */}
            <div
              style={{
                background: `radial-gradient(circle at 30% 30%, ${accentColor}55, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(20px)",
                height: 280,
                position: "absolute",
                right: 60,
                top: 120,
                width: 280,
              }}
            />
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                border: `1px solid ${accentColor}55`,
                borderRadius: 24,
                height: 200,
                position: "absolute",
                right: 100,
                top: 160,
                transform: "rotate(12deg)",
                width: 200,
              }}
            />

            <div
              style={{
                color: accentColor,
                fontFamily: FONT_FAMILY,
                fontSize: 14,
                fontWeight: 500,
                marginTop: 50,
              }}
            >
              Now live
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                maxWidth: 560,
              }}
            >
              Ship faster.
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              From commit to global edge in seconds. No config. No drama.
            </div>
            <button
              type="button"
              style={{
                background: accentColor,
                border: "none",
                borderRadius: 10,
                boxShadow: `0 10px 30px ${accentColor}40`,
                color: "#0a0a0a",
                fontFamily: FONT_FAMILY,
                fontSize: 15,
                fontWeight: 600,
                marginTop: 8,
                padding: "14px 28px",
              }}
            >
              Get started →
            </button>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
