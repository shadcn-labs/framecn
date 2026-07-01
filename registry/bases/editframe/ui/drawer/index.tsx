"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  drawerKeyframes,
  drawerAnimation,
} from "@/registry/bases/editframe/ui/drawer/use-drawer-transition";

export type DrawerState = "open" | "closed";

export interface DrawerProps {
  state?: DrawerState;
  from?: DrawerState;
  title?: string;
  description?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

export interface DrawerStyle {
  overlayOpacity: number;
  panelOpacity: number;
  panelTranslateY: number;
}

export interface DrawerStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  radius: number;
}

export const drawerStyleContext = (
  theme: FramecnTheme
): DrawerStyleContext => ({
  background: theme.popover,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
  radius: theme.radius,
});

export const drawerStyle = (
  state: DrawerState,
  _ctx: DrawerStyleContext
): DrawerStyle => {
  switch (state) {
    case "open": {
      return { overlayOpacity: 0.6, panelOpacity: 1, panelTranslateY: 0 };
    }
    default: {
      return { overlayOpacity: 0, panelOpacity: 0, panelTranslateY: 400 };
    }
  }
};

export const Drawer = ({
  state = "open",
  from,
  title = "Move Goal",
  description = "Set your daily activity goal.",
  theme: themeOverride,
  className,
  duration = "12frames",
}: DrawerProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = drawerStyleContext(theme);
  const v = drawerStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? drawerStyle(from, ctx) : v;
  const anim = hasAnimation
    ? drawerAnimation(from, state, duration, fromStyle, v)
    : { overlay: "none", panel: "none" };

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
      {hasAnimation && <style>{drawerKeyframes(fromStyle, v)}</style>}
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
          borderBottomLeftRadius: ctx.radius,
          borderBottomRightRadius: ctx.radius,
          bottom: 0,
          boxShadow: "0 -4px 6px -1px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          left: 0,
          opacity: v.panelOpacity,
          padding: 24,
          position: "absolute",
          transform: `translateY(${v.panelTranslateY}px)`,
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            borderRadius: 4,
            height: 4,
            left: "50%",
            position: "absolute",
            top: 8,
            transform: "translateX(-50%)",
            width: 32,
          }}
        />
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
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            style={{
              background: "transparent",
              border: `1px solid ${ctx.border}`,
              borderRadius: theme.radius,
              color: ctx.foreground,
              cursor: "pointer",
              flex: 1,
              fontSize: 14,
              fontWeight: 500,
              padding: "10px 0",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              background: theme.primary,
              border: "none",
              borderRadius: theme.radius,
              color: theme.primaryForeground,
              cursor: "pointer",
              flex: 1,
              fontSize: 14,
              fontWeight: 500,
              padding: "10px 0",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
