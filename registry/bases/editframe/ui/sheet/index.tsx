"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  sheetAnimation,
  sheetKeyframes,
} from "@/registry/bases/editframe/ui/sheet/use-sheet-transition";

export type SheetState = "open" | "closed";

export type SheetSide = "left" | "right";

export interface SheetStyle {
  overlayOpacity: number;
  panelOpacity: number;
  panelTranslateX: number;
}

export interface SheetStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
}

export interface SheetProps {
  state?: SheetState;
  from?: SheetState;
  side?: SheetSide;
  title?: string;
  description?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const SHEET_WIDTH = 360;

export const sheetStyleContext = (
  theme: FramecnTheme
): SheetStyleContext => ({
  background: theme.popover,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
});

export const sheetStyle = (
  state: SheetState,
  side: SheetSide,
  _ctx: SheetStyleContext
): SheetStyle => {
  const sign = side === "right" ? 1 : -1;
  switch (state) {
    case "open": {
      return { overlayOpacity: 0.6, panelOpacity: 1, panelTranslateX: 0 };
    }
    default: {
      return {
        overlayOpacity: 0,
        panelOpacity: 0,
        panelTranslateX: sign * SHEET_WIDTH,
      };
    }
  }
};

export function Sheet({
  state = "open",
  from,
  side = "right",
  title = "Settings",
  description = "Manage your account settings and preferences.",
  theme: themeOverride,
  className,
  duration = "12frames",
}: SheetProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = sheetStyleContext(theme);
  const v = sheetStyle(state, side, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? sheetStyle(from, side, ctx) : v;
  const anim = hasAnimation
    ? sheetAnimation(from, state, duration, fromStyle, v)
    : { overlay: "none", panel: "none" };

  const isRight = side === "right";

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
      {hasAnimation && <style>{sheetKeyframes(fromStyle, v)}</style>}
      <div
        style={{
          animation: hasAnimation ? anim.overlay : undefined,
          background: "black",
          borderRadius: 0,
          height: "100%",
          left: 0,
          opacity: v.overlayOpacity,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />
      <div
        className={className}
        style={{
          animation: hasAnimation ? anim.panel : undefined,
          background: ctx.background,
          [isRight ? "borderLeft" : "borderRight"]: `1px solid ${ctx.border}`,
          boxShadow: isRight
            ? "-4px 0 6px -1px rgba(0,0,0,0.1)"
            : "4px 0 6px -1px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "100%",
          [isRight ? "right" : "left"]: 0,
          opacity: v.panelOpacity,
          padding: 24,
          position: "absolute",
          top: 0,
          transform: `translateX(${v.panelTranslateX}px)`,
          width: SHEET_WIDTH,
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              color: ctx.foreground,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>
          <span
            style={{
              color: ctx.mutedForeground,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {description}
          </span>
        </div>
        <div
          style={{
            background: theme.muted,
            borderRadius: theme.radius,
            flex: 1,
          }}
        />
      </div>
    </div>
  );
}
