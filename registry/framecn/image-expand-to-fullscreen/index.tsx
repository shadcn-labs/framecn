"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface ImageExpandRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ImageExpandToFullscreenProps {
  from?: ImageExpandRect;
  to?: ImageExpandRect;
  borderRadiusFrom?: number;
  borderRadiusTo?: number;
  morphAt?: number;
  imageColorA?: string;
  imageColorB?: string;
  imageColorC?: string;
  feedBackground?: string;
  editorBackground?: string;
  accent?: string;
  postAuthor?: string;
  postBody?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_FROM: ImageExpandRect = {
  height: 200,
  left: 460,
  top: 280,
  width: 360,
};

const DEFAULT_TO: ImageExpandRect = {
  height: 480,
  left: 200,
  top: 120,
  width: 880,
};

export const ImageExpandToFullscreen = ({
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  borderRadiusFrom = 12,
  borderRadiusTo = 16,
  morphAt = 30,
  imageColorA = "#ff6b6b",
  imageColorB = "#845ec2",
  imageColorC = "#4d8dff",
  feedBackground = "#f4f4f5",
  editorBackground = "#0a0a0a",
  accent = "#fafafa",
  postAuthor = "Maya Larsson",
  postBody = "Sunset over the old harbor — color graded straight out of camera.",
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: ImageExpandToFullscreenProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const morphMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const imageGradient = `linear-gradient(135deg, ${imageColorA}, ${imageColorB}, ${imageColorC})`;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-img-expand-feed {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes framecn-img-expand-editor {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-img-expand-img {
            0% { left: ${from.left}px; top: ${from.top}px; width: ${from.width}px; height: ${from.height}px; border-radius: ${borderRadiusFrom}px; }
            100% { left: ${to.left}px; top: ${to.top}px; width: ${to.width}px; height: ${to.height}px; border-radius: ${borderRadiusTo}px; }
          }
          @keyframes framecn-img-expand-toolbar {
            from { opacity: 0; transform: translateY(-100%); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Feed background */}
        <div
          style={{
            animation: `framecn-img-expand-feed ${morphMs * 0.5}ms ease-out ${morphAt * frameMs}ms forwards`,
            background: feedBackground,
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Editor background */}
        <div
          style={{
            animation: `framecn-img-expand-editor ${morphMs * 0.5}ms ease-in ${morphAt * frameMs}ms backwards`,
            background: editorBackground,
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Fake post card */}
        <div
          style={{
            animation: `framecn-img-expand-feed ${morphMs * 0.5}ms ease-out ${morphAt * frameMs}ms forwards`,
            background: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 30px 80px rgba(15, 15, 25, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            left: 380,
            opacity: 1,
            padding: 24,
            position: "absolute",
            top: 140,
            width: 520,
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
            <div
              style={{
                background: imageGradient,
                borderRadius: 999,
                height: 44,
                width: 44,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  color: "#0a0a0a",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                {postAuthor}
              </div>
              <div style={{ color: "#71717a", fontSize: 12 }}>2h ago</div>
            </div>
          </div>
          <div
            style={{
              color: "#27272a",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {postBody}
          </div>
          <div
            style={{
              background: "transparent",
              borderRadius: 12,
              height: 200,
              width: "100%",
            }}
          />
          <div style={{ display: "flex", gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: "#f4f4f5",
                  borderRadius: 8,
                  height: 28,
                  width: 28,
                }}
              />
            ))}
          </div>
        </div>

        {/* Morphing image */}
        <div
          style={{
            animation: `framecn-img-expand-img ${morphMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphAt * frameMs}ms backwards`,
            background: imageGradient,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "absolute",
          }}
        />

        {/* Top toolbar */}
        <div
          style={{
            WebkitBackdropFilter: "blur(20px)",
            alignItems: "center",
            animation: `framecn-img-expand-toolbar ${morphMs * 0.5}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphAt * frameMs + morphMs * 0.5}ms backwards`,
            backdropFilter: "blur(20px)",
            background: "rgba(15, 15, 18, 0.6)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            height: 64,
            justifyContent: "space-between",
            left: 0,
            padding: "0 24px",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                height: 32,
                width: 32,
              }}
            />
            <div
              style={{
                color: accent,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              Editor
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  height: 32,
                  width: 32,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom toolbar */}
        <div
          style={{
            WebkitBackdropFilter: "blur(20px)",
            alignItems: "center",
            animation: `framecn-img-expand-toolbar ${morphMs * 0.5}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphAt * frameMs + morphMs * 0.5}ms backwards`,
            backdropFilter: "blur(20px)",
            background: "rgba(15, 15, 18, 0.6)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            bottom: 0,
            display: "flex",
            gap: 14,
            height: 80,
            justifyContent: "center",
            left: 0,
            padding: "0 24px",
            position: "absolute",
            right: 0,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                background: i === 2 ? accent : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                height: 44,
                width: 44,
              }}
            />
          ))}
        </div>
      </>
    </Timegroup>
  );
};
