"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  dropdownMenuKeyframes,
  dropdownMenuAnimation,
} from "@/registry/bases/editframe/ui/dropdown-menu/use-dropdown-menu-transition";

export type DropdownMenuState = "open" | "closed";

export interface DropdownMenuProps {
  state?: DropdownMenuState;
  from?: DropdownMenuState;
  label?: string;
  items?: string[];
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

export interface DropdownMenuStyle {
  chevronRotation: number;
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
}

export const dropdownMenuStyle = (state: DropdownMenuState): DropdownMenuStyle => {
  switch (state) {
    case "open": {
      return {
        chevronRotation: 180,
        panelOpacity: 1,
        panelScale: 1,
        panelTranslateY: 0,
      };
    }
    default: {
      return {
        chevronRotation: 0,
        panelOpacity: 0,
        panelScale: 0.96,
        panelTranslateY: -4,
      };
    }
  }
};

export function DropdownMenu({
  state = "closed",
  from,
  label = "Options",
  items = ["Profile", "Settings", "Sign out"],
  theme: themeOverride,
  className,
  duration = "12frames",
}: DropdownMenuProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = dropdownMenuStyle(state);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? dropdownMenuStyle(from) : v;
  const anim = hasAnimation
    ? dropdownMenuAnimation(from, state, duration, fromStyle, v)
    : { chevronTransform: "none", panelOpacity: "none", panelTransform: "none" };

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
      {hasAnimation && <style>{dropdownMenuKeyframes(fromStyle, v)}</style>}
      <div className={className} style={{ position: "relative" }}>
        <button
          type="button"
          style={{
            alignItems: "center",
            background: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius,
            color: theme.foreground,
            cursor: "pointer",
            display: "inline-flex",
            fontSize: 14,
            fontWeight: 500,
            gap: 8,
            height: 40,
            justifyContent: "center",
            letterSpacing: "-0.01em",
            padding: "0 16px",
          }}
        >
          <span>{label}</span>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              animation: hasAnimation ? anim.chevronTransform : undefined,
              transform: `rotate(${v.chevronRotation}deg)`,
            }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke={theme.mutedForeground}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div
            style={{
              animation: hasAnimation
                ? `${anim.panelOpacity}, ${anim.panelTransform}`
                : undefined,
              background: theme.popover,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.radius,
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              left: 0,
              opacity: v.panelOpacity,
              padding: 4,
              position: "absolute",
              top: 44,
              transform: `translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
              transformOrigin: "top",
              width: 160,
              zIndex: 50,
            }}
          >
            {items.map((item) => (
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
                  fontWeight: 400,
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
        )}
      </div>
    </div>
  );
}
