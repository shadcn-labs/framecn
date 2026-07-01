"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  selectAnimation,
  selectKeyframes,
} from "@/registry/bases/editframe/ui/select/use-select-transition";

export type SelectState = "open" | "closed";

export interface SelectStyle {
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
  chevronRotation: number;
}

export interface SelectStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  panelBg: string;
}

export interface SelectProps {
  state?: SelectState;
  from?: SelectState;
  value?: string;
  placeholder?: string;
  items?: string[];
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const SELECT_WIDTH = 280;

export const selectStyleContext = (
  theme: FramecnTheme
): SelectStyleContext => ({
  background: theme.background,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
  panelBg: theme.popover,
});

export const selectStyle = (
  state: SelectState,
  _ctx: SelectStyleContext
): SelectStyle => {
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

export const Select = ({
  state = "open",
  from,
  value = "option-1",
  placeholder = "Select an option",
  items = ["option-1", "option-2", "option-3"],
  theme: themeOverride,
  className,
  duration = "12frames",
}: SelectProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = selectStyleContext(theme);
  const v = selectStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? selectStyle(from, ctx) : v;
  const anim = hasAnimation
    ? selectAnimation(from, state, duration, fromStyle, v)
    : {
        chevronTransform: "none",
        panelOpacity: "none",
        panelTransform: "none",
      };

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
      {hasAnimation && <style>{selectKeyframes(fromStyle, v)}</style>}
      <div style={{ position: "relative", width: SELECT_WIDTH }}>
        <div
          className={className}
          style={{
            alignItems: "center",
            background: ctx.background,
            border: `1px solid ${ctx.border}`,
            borderRadius: theme.radius,
            color: value ? ctx.foreground : ctx.mutedForeground,
            cursor: "pointer",
            display: "flex",
            fontSize: 14,
            height: 40,
            justifyContent: "space-between",
            letterSpacing: "-0.01em",
            padding: "0 12px",
            width: "100%",
          }}
        >
          <span>{value ?? placeholder}</span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              animation: hasAnimation ? anim.chevronTransform : undefined,
              flexShrink: 0,
              transform: `rotate(${v.chevronRotation}deg)`,
            }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke={ctx.mutedForeground}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {hasAnimation && (
          <div
            style={{
              animation: `${anim.panelOpacity}, ${anim.panelTransform}`,
              background: ctx.panelBg,
              border: `1px solid ${ctx.border}`,
              borderRadius: theme.radius,
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              left: 0,
              marginTop: 4,
              opacity: v.panelOpacity,
              overflow: "hidden",
              position: "absolute",
              top: "100%",
              transform: `translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
              transformOrigin: "top center",
              width: "100%",
              zIndex: 1,
            }}
          >
            {items.map((item) => (
              <div
                key={item}
                style={{
                  background: item === value ? ctx.background : "transparent",
                  color: ctx.foreground,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: item === value ? 500 : 400,
                  letterSpacing: "-0.01em",
                  padding: "8px 12px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        {!hasAnimation && state === "open" && (
          <div
            style={{
              background: ctx.panelBg,
              border: `1px solid ${ctx.border}`,
              borderRadius: theme.radius,
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              left: 0,
              marginTop: 4,
              overflow: "hidden",
              position: "absolute",
              top: "100%",
              width: "100%",
              zIndex: 1,
            }}
          >
            {items.map((item) => (
              <div
                key={item}
                style={{
                  background: item === value ? ctx.background : "transparent",
                  color: ctx.foreground,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: item === value ? 500 : 400,
                  letterSpacing: "-0.01em",
                  padding: "8px 12px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
