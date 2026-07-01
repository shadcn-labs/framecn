"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  checkboxKeyframes,
  checkboxAnimation,
} from "@/registry/bases/editframe/ui/checkbox/use-checkbox-transition";

export type CheckboxState = "checked" | "unchecked";

export interface CheckboxProps {
  state?: CheckboxState;
  from?: CheckboxState;
  label?: string;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  className?: string;
  duration?: string;
}

const CHECKBOX_SIZE = 20;
const CHECK_PATH_LENGTH = 14;

export interface CheckboxStyle {
  boxBackground: string;
  boxBorderColor: string;
  checkDraw: number;
  checkOpacity: number;
  checkScale: number;
}

export interface CheckboxStyleContext {
  uncheckedBg: string;
  uncheckedBorder: string;
  checkedBg: string;
  checkedBorder: string;
  foreground: string;
  mutedForeground: string;
}

export const checkboxStyleContext = (
  theme: FramecnTheme
): CheckboxStyleContext => ({
  checkedBg: theme.primary,
  checkedBorder: theme.primary,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
  uncheckedBg: theme.background,
  uncheckedBorder: theme.input,
});

export const checkboxStyle = (
  state: CheckboxState,
  ctx: CheckboxStyleContext
): CheckboxStyle => {
  switch (state) {
    case "checked": {
      return {
        boxBackground: ctx.checkedBg,
        boxBorderColor: ctx.checkedBg,
        checkDraw: 1,
        checkOpacity: 1,
        checkScale: 1,
      };
    }
    default: {
      return {
        boxBackground: ctx.uncheckedBg,
        boxBorderColor: ctx.uncheckedBorder,
        checkDraw: 0,
        checkOpacity: 0,
        checkScale: 0.6,
      };
    }
  }
};

export const Checkbox = ({
  state = "unchecked",
  from,
  label = "Accept terms",
  theme: themeOverride,
  primary,
  className,
  duration = "10frames",
}: CheckboxProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );
  const ctx = checkboxStyleContext(theme);
  const v = checkboxStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const anim = hasAnimation
    ? checkboxAnimation(from, state, duration)
    : { box: "none", check: "none", draw: "none" };

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
      {hasAnimation && <style>{checkboxKeyframes(ctx)}</style>}
      <label
        className={className}
        style={{
          alignItems: "center",
          cursor: "pointer",
          display: "inline-flex",
          gap: 10,
          userSelect: "none",
        }}
      >
        <span
          style={{
            alignItems: "center",
            animation: hasAnimation ? anim.box : undefined,
            background: v.boxBackground,
            border: `1.5px solid ${v.boxBorderColor}`,
            borderRadius: 5,
            display: "flex",
            height: CHECKBOX_SIZE,
            justifyContent: "center",
            width: CHECKBOX_SIZE,
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              animation: hasAnimation
                ? `${anim.check}, ${anim.draw}`
                : undefined,
              opacity: v.checkOpacity,
              transform: `scale(${v.checkScale})`,
            }}
          >
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={CHECK_PATH_LENGTH}
              strokeDashoffset={(1 - v.checkDraw) * CHECK_PATH_LENGTH}
            />
          </svg>
        </span>
        <span
          style={{
            color: ctx.foreground,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </span>
      </label>
    </div>
  );
};
