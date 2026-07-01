"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  stepperStyleAt,
  tweenStepperStyle,
} from "@/registry/bases/editframe/ui/stepper/use-stepper-transition";
import type {
  StepperStep,
  StepperTransitionOptions,
} from "@/registry/bases/editframe/ui/stepper/use-stepper-transition";

export interface StepperStyle {
  position: number;
}

export interface StepperProps {
  steps?: string[];
  current?: number;
  from?: number;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  speed?: number;
  className?: string;
  duration?: string;
}

export function Stepper({
  steps = ["Account", "Profile", "Billing", "Done"],
  current = 0,
  from,
  theme: themeOverride,
  primary,
  speed = 1,
  className,
  duration = "24frames",
}: StepperProps) {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;
  const fromProgress = from !== undefined && steps.length > 1
    ? from / (steps.length - 1)
    : undefined;

  const trackHeight = 4;
  const progressPercent = progress * 100;

  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 0,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            background: theme.muted,
            borderRadius: 999,
            height: trackHeight,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              background: theme.primary,
              borderRadius: 999,
              height: "100%",
              width: `${progressPercent}%`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {steps.map((label, i) => {
            const isActive = i <= current;
            return (
              <div
                key={label}
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: isActive ? theme.primary : theme.muted,
                    border: `2px solid ${isActive ? theme.primary : theme.border}`,
                    borderRadius: "50%",
                    color: isActive ? theme.primaryForeground : theme.mutedForeground,
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 24,
                    justifyContent: "center",
                    width: 24,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    color: isActive ? theme.foreground : theme.mutedForeground,
                    fontSize: 12,
                    fontWeight: isActive ? 500 : 400,
                    textAlign: "center",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
