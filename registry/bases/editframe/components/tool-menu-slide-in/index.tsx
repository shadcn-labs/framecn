"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface ToolMenuSlideInProps {
  tools?: string[];
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_TOOLS = [
  { icon: "🔍", label: "Search", shortcut: "⌘K" },
  { icon: "📝", label: "Edit", shortcut: "⌘E" },
  { icon: "📎", label: "Attach", shortcut: "⌘U" },
  { icon: "🖼️", label: "Image", shortcut: "⌘I" },
  { icon: "📊", label: "Chart", shortcut: "⌘D" },
];

export const ToolMenuSlideIn = ({
  tools,
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: ToolMenuSlideInProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const menuItems = (tools ?? DEFAULT_TOOLS.map((t) => t.label)).map(
    (label) => {
      const item = DEFAULT_TOOLS.find((t) => t.label === label) ?? {
        icon: "•",
        label,
        shortcut: "",
      };
      return item;
    }
  );

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
          @keyframes framecn-tms-backdrop {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(8px); }
          }
          @keyframes framecn-tms-menu-in {
            from { opacity: 0; transform: translateY(-12px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-tms-item-in {
            from { opacity: 0; transform: translateX(-8px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {/* Background */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59,130,246,0.06), transparent 60%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Trigger button area */}
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "flex",
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              gap: 8,
              height: 44,
              padding: "0 16px",
              width: 280,
            }}
          >
            <span>🔧</span>
            <span>Tools</span>
            <span
              style={{
                marginLeft: "auto",
                opacity: 0.4,
              }}
            >
              ⌘T
            </span>
          </div>

          {/* Slide-in menu */}
          <div
            style={{
              animation: `framecn-tms-menu-in 400ms cubic-bezier(0.16, 1, 0.3, 1) ${(durationMs * 0.3) / safeSpeed}ms backwards`,
              background: "rgba(20,20,22,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              left: 0,
              overflow: "hidden",
              position: "absolute",
              top: 52,
              width: 280,
              zIndex: 10,
            }}
          >
            {/* Search header */}
            <div
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                padding: "12px 16px",
              }}
            >
              Type a tool name...
            </div>

            {/* Tool items */}
            {menuItems.map((tool, i) => (
              <div
                key={tool.label}
                style={{
                  alignItems: "center",
                  animation: `framecn-tms-item-in 300ms ease-out ${(durationMs * 0.4) / safeSpeed + i * 50}ms backwards`,
                  display: "flex",
                  fontFamily: FONT_FAMILY,
                  fontSize: 14,
                  gap: 10,
                  padding: "10px 16px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    height: 28,
                    width: 28,
                  }}
                >
                  {tool.icon}
                </span>
                <span style={{ color: "rgba(255,255,255,0.85)", flex: 1 }}>
                  {tool.label}
                </span>
                {tool.shortcut && (
                  <span
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {tool.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
