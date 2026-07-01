"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  popoverAnimation,
  popoverKeyframes,
} from "@/registry/bases/editframe/ui/popover/use-popover-transition";

export type PopoverState = "open" | "closed";

export interface PopoverStyle {
  opacity: number;
  scale: number;
  translate: number;
}

export interface PopoverStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  shadow: string;
}

export interface PopoverProps {
  state?: PopoverState;
  from?: PopoverState;
  title?: string;
  content?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const POPOVER_WIDTH = 300;

export const popoverStyleContext = (
  theme: FramecnTheme
): PopoverStyleContext => ({
  background: theme.popover,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
  shadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
});

export const popoverStyle = (
  state: PopoverState,
  _ctx: PopoverStyleContext
): PopoverStyle => {
  switch (state) {
    case "open": {
      return { opacity: 1, scale: 1, translate: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.96, translate: -4 };
    }
  }
};

export const Popover = ({
  state = "open",
  from,
  title = "Hover Preview",
  content = "This popover appears on hover with smooth animation.",
  theme: themeOverride,
  className,
  duration = "10frames",
}: PopoverProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = popoverStyleContext(theme);
  const v = popoverStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? popoverStyle(from, ctx) : v;
  const anim = hasAnimation
    ? popoverAnimation(from, state, duration, fromStyle, v)
    : { opacity: "none", transform: "none" };

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
      {hasAnimation && <style>{popoverKeyframes(fromStyle, v)}</style>}
      <div
        className={className}
        style={{
          animation: hasAnimation
            ? `${anim.opacity}, ${anim.transform}`
            : undefined,
          background: ctx.background,
          border: `1px solid ${ctx.border}`,
          borderRadius: theme.radius,
          boxShadow: ctx.shadow,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: v.opacity,
          padding: 16,
          transform: `translateY(${v.translate}px) scale(${v.scale})`,
          transformOrigin: "bottom center",
          width: POPOVER_WIDTH,
        }}
      >
        {title !== undefined && (
          <span
            style={{
              color: ctx.foreground,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>
        )}
        {content !== undefined && (
          <span
            style={{
              color: ctx.mutedForeground,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {content}
          </span>
        )}
      </div>
    </div>
  );
};
