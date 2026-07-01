"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DefaultChat = () => {
  const messages = [
    { from: "user", text: "Build me a landing page" },
    { from: "ai", text: "Sure — what should it feature?" },
    { from: "user", text: "Hero, pricing, footer." },
    { from: "ai", text: "On it. Generating now..." },
  ];
  return (
    <div
      style={{
        background: "#111",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_FAMILY,
        gap: 12,
        inset: 0,
        padding: 24,
        position: "absolute",
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Chat
      </div>
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            alignSelf: m.from === "user" ? "flex-end" : "flex-start",
            background: m.from === "user" ? "#0ea5e9" : "#262626",
            borderRadius: 14,
            color: "white",
            fontSize: 14,
            maxWidth: "85%",
            padding: "10px 14px",
          }}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
};

const DefaultPreview = () => (
  <div
    style={{
      background: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT_FAMILY,
      inset: 0,
      position: "absolute",
    }}
  >
    <div
      style={{
        alignItems: "center",
        background: "#f4f4f5",
        borderBottom: "1px solid #e4e4e7",
        display: "flex",
        gap: 6,
        height: 36,
        padding: "0 12px",
      }}
    >
      <div
        style={{
          background: "#ef4444",
          borderRadius: 999,
          height: 10,
          width: 10,
        }}
      />
      <div
        style={{
          background: "#f59e0b",
          borderRadius: 999,
          height: 10,
          width: 10,
        }}
      />
      <div
        style={{
          background: "#22c55e",
          borderRadius: 999,
          height: 10,
          width: 10,
        }}
      />
    </div>
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: 16,
        padding: 32,
      }}
    >
      <div
        style={{
          color: "#0a0a0a",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        Ship faster.
      </div>
      <div style={{ color: "#71717a", fontSize: 16, maxWidth: 360 }}>
        The fastest way to launch your idea. Built with Editframe.
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          background: "#0a0a0a",
          borderRadius: 10,
          color: "white",
          display: "inline-flex",
          fontSize: 14,
          fontWeight: 600,
          marginTop: 12,
          padding: "10px 18px",
        }}
      >
        Get started
      </div>
    </div>
  </div>
);

export interface ChatToPreviewLayoutProps {
  chat?: ReactNode;
  preview?: ReactNode;
  startChatRatio?: number;
  endChatRatio?: number;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const ChatToPreviewLayout = ({
  chat,
  preview,
  startChatRatio = 0.5,
  endChatRatio = 0.25,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: ChatToPreviewLayoutProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const morphStartMs = (durationInFrames * 0.1 * frameMs) / safeSpeed;
  const morphEndMs = (durationInFrames * 0.7 * frameMs) / safeSpeed;
  const morphDurationMs = morphEndMs - morphStartMs;

  const startBasis = `${startChatRatio * 100}%`;
  const endBasis = `${endChatRatio * 100}%`;

  const containerStyle: CSSProperties = {
    background,
    display: "flex",
    gap: 16,
    height,
    overflow: "hidden",
    padding: 32,
    position: "relative",
    width,
  };

  const CHAT_INNER_MIN = 520;
  const PREVIEW_INNER_MIN = 720;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-chat-preview-chat {
            from { flex-basis: ${startBasis}; }
            to { flex-basis: ${endBasis}; }
          }
          @keyframes framecn-chat-preview-preview {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-chat-preview-chat ${morphDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphStartMs}ms backwards`,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            flexBasis: startBasis,
            flexGrow: 0,
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              inset: 0,
              minWidth: CHAT_INNER_MIN,
              position: "absolute",
            }}
          >
            {chat ?? <DefaultChat />}
          </div>
        </div>
        <div
          style={{
            animation: `framecn-chat-preview-preview ${morphDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${morphStartMs}ms backwards`,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            flexBasis: `calc(100% - ${endBasis})`,
            flexGrow: 0,
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              inset: 0,
              minWidth: PREVIEW_INNER_MIN,
              position: "absolute",
            }}
          >
            {preview ?? <DefaultPreview />}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
