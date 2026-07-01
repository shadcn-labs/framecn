"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  getTooltipAnimation,
  getTooltipKeyframes,
} from "@/registry/bases/editframe/ui/tooltip/use-tooltip-transition";

export type TooltipState = "hidden" | "visible";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  state?: TooltipState;
  from?: TooltipState;
  label?: string;
  placement?: TooltipPlacement;
  theme?: Partial<FramecnTheme>;
  speed?: number;
  className?: string;
  duration?: string;
  children?: React.ReactNode;
}

const placementOffset = (placement: TooltipPlacement): { x: number; y: number } => {
  switch (placement) {
    case "top":
      return { x: 0, y: -6 };
    case "bottom":
      return { x: 0, y: 6 };
    case "left":
      return { x: -6, y: 0 };
    case "right":
      return { x: 6, y: 0 };
    default:
      return { x: 0, y: -6 };
  }
};

export function Tooltip({
  state = "hidden",
  from,
  label = "",
  placement = "top",
  theme: themeOverride,
  speed = 1,
  className,
  duration,
  children,
}: TooltipProps) {
  const theme = useFramecnTheme(themeOverride, "light");

  const hasAnimation = from !== undefined && from !== state;
  const anim = hasAnimation
    ? getTooltipAnimation(from)
    : null;

  const offset = placementOffset(placement);
  const isVisible = state === "visible";

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
      }}
    >
      {children}
      <div
        style={{
          animation: anim
            ? `${anim.animationName} ${anim.animationDuration} ${anim.animationTimingFunction} ${anim.animationFillMode}`
            : undefined,
          background: theme.foreground,
          borderRadius: theme.radius,
          bottom: placement === "top" ? "100%" : undefined,
          color: theme.background,
          fontSize: 13,
          fontWeight: 500,
          left: placement === "right" ? "100%" : placement === "left" ? undefined : "50%",
          lineHeight: "1.4",
          marginBottom: placement === "top" ? 6 : 0,
          marginLeft: placement === "left" ? undefined : placement === "right" ? 6 : "-50%",
          marginRight: placement === "right" ? undefined : placement === "left" ? 6 : 0,
          marginTop: placement === "bottom" ? 6 : 0,
          opacity: isVisible ? 1 : 0,
          padding: "6px 12px",
          pointerEvents: "none",
          position: "absolute",
          top: placement === "bottom" ? "100%" : undefined,
          transform: hasAnimation
            ? undefined
            : `translate(${offset.x}px, ${offset.y}px)`,
          whiteSpace: "nowrap",
          zIndex: 50,
        }}
      >
        {label}
        <div
          style={{
            background: theme.foreground,
            borderRadius: 2,
            bottom: placement === "top" ? -4 : undefined,
            height: 8,
            left: "50%",
            position: "absolute",
            top: placement === "bottom" ? -4 : undefined,
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
          }}
        />
      </div>
    </div>
  );
}
