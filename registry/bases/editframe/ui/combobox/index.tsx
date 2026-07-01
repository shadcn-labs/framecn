"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  comboboxKeyframes,
  comboboxAnimation,
} from "@/registry/bases/editframe/ui/combobox/use-combobox-transition";

export type ComboboxState = "open" | "closed";

export type ComboboxVariant = "default" | "ghost";

export interface ComboboxProps {
  state?: ComboboxState;
  from?: ComboboxState;
  placeholder?: string;
  value?: string;
  options?: string[];
  variant?: ComboboxVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const COMBOBOX_WIDTH = 320;
const ITEM_HEIGHT = 36;

export interface ComboboxStyle {
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
}

export const comboboxStyle = (state: ComboboxState): ComboboxStyle => {
  switch (state) {
    case "open": {
      return { panelOpacity: 1, panelScale: 1, panelTranslateY: 0 };
    }
    default: {
      return { panelOpacity: 0, panelScale: 0.96, panelTranslateY: -4 };
    }
  }
};

export function Combobox({
  state = "closed",
  from,
  placeholder = "Select an option...",
  value,
  options = ["Option 1", "Option 2", "Option 3"],
  variant = "default",
  theme: themeOverride,
  className,
  duration = "12frames",
}: ComboboxProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = comboboxStyle(state);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? comboboxStyle(from) : v;
  const anim = hasAnimation
    ? comboboxAnimation(from, state, duration, fromStyle, v)
    : { panelOpacity: "none", panelTransform: "none" };

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
      {hasAnimation && <style>{comboboxKeyframes(fromStyle, v)}</style>}
      <div className={className} style={{ position: "relative", width: COMBOBOX_WIDTH }}>
        <button
          type="button"
          style={{
            alignItems: "center",
            background: theme.background,
            border: `1px solid ${theme.input}`,
            borderRadius: theme.radius,
            color: value ? theme.foreground : theme.mutedForeground,
            cursor: "pointer",
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            height: 40,
            justifyContent: "space-between",
            letterSpacing: "-0.01em",
            padding: "0 12px",
            width: "100%",
          }}
        >
          <span>{value ?? placeholder}</span>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
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
              overflow: "hidden",
              padding: 4,
              position: "absolute",
              top: 44,
              transform: `translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
              transformOrigin: "top",
              width: "100%",
              zIndex: 50,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                style={{
                  alignItems: "center",
                  background:
                    option === value ? theme.accent : "transparent",
                  border: "none",
                  borderRadius: theme.radius,
                  color:
                    option === value
                      ? theme.foreground
                      : theme.mutedForeground,
                  cursor: "pointer",
                  display: "flex",
                  fontSize: 14,
                  fontWeight: option === value ? 500 : 400,
                  height: ITEM_HEIGHT,
                  justifyContent: "flex-start",
                  letterSpacing: "-0.01em",
                  padding: "0 8px",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
