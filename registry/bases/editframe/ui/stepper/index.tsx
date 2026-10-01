"use client";

import { clamp01, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export interface StepperStyle {
  position: number;
}

export type StepperOrientation = "horizontal" | "vertical";

export interface StepperProps {
  steps?: string[];
  activeIndex?: number;
  style?: StepperStyle;
  orientation?: StepperOrientation;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const DEFAULT_STEPS = ["Account", "Plan", "Done"];
const CIRCLE = 36;
const CHECK_PATH_LENGTH = 14;

export interface StepperStyleContext {
  primary: string;
  primaryFg: string;
  mutedBg: string;
  border: string;
  mutedFg: string;
  foreground: string;
}

export const stepperStyleContext = (
  theme: FramecnTheme
): StepperStyleContext => ({
  border: theme.border,
  foreground: theme.foreground,
  mutedBg: theme.muted,
  mutedFg: theme.mutedForeground,
  primary: theme.primary,
  primaryFg: theme.primaryForeground,
});

export const stepperStyle = (activeIndex: number): StepperStyle => ({
  position: activeIndex,
});

export const stepCircleAt = (
  i: number,
  position: number
): {
  fill: number;
  checkDraw: number;
  active: boolean;
} => {
  const fill = clamp01(position - i);
  const checkDraw = fill;
  const active = Math.floor(position) === i && fill < 1;
  return { active, checkDraw, fill };
};

export const connectorFillAt = (i: number, position: number): number =>
  clamp01(position - i);

export const Stepper = ({
  steps = DEFAULT_STEPS,
  activeIndex = 0,
  style,
  orientation: _orientation = "horizontal",
  theme: themeOverride,
  className,
}: StepperProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = stepperStyleContext(theme);
  const v = style ?? stepperStyle(activeIndex);
  const { position } = v;
  return (
    <div
      className={className}
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
      <div style={{ alignItems: "flex-start", display: "flex" }}>
        {steps.map((label, i) => {
          const { fill, checkDraw, active } = stepCircleAt(i, position);
          const completed = fill >= 1;
          const circleBg = mixOklch(ctx.mutedBg, ctx.primary, fill);
          const circleBorder = mixOklch(ctx.border, ctx.primary, fill);
          const numberOpacity = 1 - checkDraw;
          const numberColor =
            active || completed ? ctx.foreground : ctx.mutedFg;
          const isLast = i === steps.length - 1;
          return (
            <div
              key={label}
              style={{ alignItems: "flex-start", display: "flex" }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: CIRCLE + 24,
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: circleBg,
                    border: `2px solid ${active ? ctx.primary : circleBorder}`,
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    display: "flex",
                    height: CIRCLE,
                    justifyContent: "center",
                    position: "relative",
                    width: CIRCLE,
                  }}
                >
                  <span
                    style={{
                      color: numberColor,
                      fontSize: 14,
                      fontWeight: 600,
                      opacity: numberOpacity,
                      position: "absolute",
                    }}
                  >
                    {i + 1}
                  </span>

                  <svg
                    width={CIRCLE}
                    height={CIRCLE}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke={ctx.primaryFg}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={CHECK_PATH_LENGTH}
                      strokeDasharray={CHECK_PATH_LENGTH}
                      strokeDashoffset={CHECK_PATH_LENGTH * (1 - checkDraw)}
                    />
                  </svg>
                </div>
                <span
                  style={{
                    color: active || completed ? ctx.foreground : ctx.mutedFg,
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div
                  style={{
                    background: ctx.border,
                    height: 2,
                    marginTop: CIRCLE / 2 - 1,
                    overflow: "hidden",
                    position: "relative",
                    width: 64,
                  }}
                >
                  <div
                    style={{
                      background: ctx.primary,
                      bottom: 0,
                      left: 0,
                      position: "absolute",
                      top: 0,
                      width: `${connectorFillAt(i, position) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
