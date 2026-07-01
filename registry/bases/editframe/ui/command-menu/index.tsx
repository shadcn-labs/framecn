"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  commandMenuKeyframes,
  commandMenuAnimation,
} from "@/registry/bases/editframe/ui/command-menu/use-command-menu-transition";

export type CommandMenuState = "open" | "closed";

export interface CommandMenuProps {
  state?: CommandMenuState;
  from?: CommandMenuState;
  placeholder?: string;
  groups?: { label: string; items: string[] }[];
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const MENU_WIDTH = 480;
const MENU_HEIGHT = 340;

export interface CommandMenuStyle {
  backdropOpacity: number;
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
}

export const commandMenuStyle = (state: CommandMenuState): CommandMenuStyle => {
  switch (state) {
    case "open": {
      return {
        backdropOpacity: 0.6,
        panelOpacity: 1,
        panelScale: 1,
        panelTranslateY: 0,
      };
    }
    default: {
      return {
        backdropOpacity: 0,
        panelOpacity: 0,
        panelScale: 0.96,
        panelTranslateY: -8,
      };
    }
  }
};

export function CommandMenu({
  state = "closed",
  from,
  placeholder = "Search commands...",
  groups = [
    {
      label: "Suggestions",
      items: ["Calendar", "Search Emoji", "Calculator"],
    },
  ],
  theme: themeOverride,
  className,
  duration = "12frames",
}: CommandMenuProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = commandMenuStyle(state);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? commandMenuStyle(from) : v;
  const anim = hasAnimation
    ? commandMenuAnimation(from, state, duration, fromStyle, v)
    : { backdrop: "none", panel: "none" };

  const isOpen = state === "open";

  return (
    <div
      style={{
        alignItems: "center",
        background: "transparent",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      {hasAnimation && <style>{commandMenuKeyframes(fromStyle, v)}</style>}
      <div
        style={{
          animation: hasAnimation ? anim.backdrop : undefined,
          background: "black",
          height: "100%",
          left: 0,
          opacity: v.backdropOpacity,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />
      <div
        className={className}
        style={{
          animation: hasAnimation ? anim.panel : undefined,
          background: theme.popover,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.radius,
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.25)",
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          height: MENU_HEIGHT,
          left: "50%",
          opacity: v.panelOpacity,
          overflow: "hidden",
          position: "absolute",
          top: "20%",
          transform: `translateX(-50%) translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
          transformOrigin: "top",
          width: MENU_WIDTH,
          zIndex: 50,
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            gap: 8,
            padding: "12px 16px",
          }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke={theme.mutedForeground} strokeWidth="2" />
            <path d="M16 16l4 4" stroke={theme.mutedForeground} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span
            style={{
              color: theme.mutedForeground,
              fontSize: 14,
              flex: 1,
            }}
          >
            {placeholder}
          </span>
          <span
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 4,
              color: theme.mutedForeground,
              fontSize: 11,
              padding: "2px 6px",
            }}
          >
            ESC
          </span>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 4,
          }}
        >
          {groups.map((group) => (
            <div key={group.label} style={{ padding: "4px 0" }}>
              <span
                style={{
                  color: theme.mutedForeground,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  padding: "4px 8px",
                  textTransform: "uppercase",
                }}
              >
                {group.label}
              </span>
              {group.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  style={{
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    borderRadius: theme.radius,
                    color: theme.foreground,
                    cursor: "pointer",
                    display: "flex",
                    fontSize: 14,
                    gap: 8,
                    height: 36,
                    padding: "0 8px",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
