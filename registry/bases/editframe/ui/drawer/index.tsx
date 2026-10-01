"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type DrawerState = "opened" | "closed";

export interface DrawerProps {
  state?: DrawerState;
  style?: DrawerStyle;
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const DRAWER_HEIGHT = 320;
const MAX_OVERLAY_ALPHA = 0.5;

export interface DrawerStyle {
  overlayOpacity: number;
  panelOpacity: number;
  panelTranslateY: number;
}

export interface DrawerStyleContext {
  popoverBg: string;
  popoverFg: string;
  mutedFg: string;
  border: string;
  radius: number;
  actionBg: string;
  actionFg: string;
  cancelFg: string;
}

export const drawerStyleContext = (
  theme: FramecnTheme
): DrawerStyleContext => ({
  actionBg: theme.primary,
  actionFg: theme.primaryForeground,
  border: theme.border,
  cancelFg: theme.foreground,
  mutedFg: theme.mutedForeground,
  popoverBg: theme.popover,
  popoverFg: theme.popoverForeground,
  radius: theme.radius,
});

export const drawerStyle = (
  state: DrawerState,
  _ctx: DrawerStyleContext
): DrawerStyle => {
  switch (state) {
    case "opened": {
      return {
        overlayOpacity: 1,
        panelOpacity: 1,
        panelTranslateY: 0,
      };
    }
    default: {
      return {
        overlayOpacity: 0,
        panelOpacity: 0,
        panelTranslateY: DRAWER_HEIGHT,
      };
    }
  }
};

export const Drawer = ({
  state = "closed",
  style,
  title = "Edit profile",
  description = "Make changes to your profile here. Click save when you're done.",
  actionLabel = "Save changes",
  cancelLabel = "Cancel",
  theme: themeOverride,
  className,
}: DrawerProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = drawerStyleContext(theme);
  const v = style ?? drawerStyle(state, ctx);
  const buttonBase: React.CSSProperties = {
    alignItems: "center",
    borderRadius: ctx.radius,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: 15,
    fontWeight: 500,
    height: 40,
    justifyContent: "center",
    letterSpacing: "-0.01em",
    padding: "0 20px",
  };
  return (
    <div
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        position: "absolute",
      }}
    >
      <div
        style={{
          background: `rgba(0, 0, 0, ${MAX_OVERLAY_ALPHA * v.overlayOpacity})`,
          inset: 0,
          position: "absolute",
        }}
      />

      <div
        className={className}
        style={{
          alignItems: "center",
          background: ctx.popoverBg,
          borderTop: `1px solid ${ctx.border}`,
          borderTopLeftRadius: ctx.radius + 6,
          borderTopRightRadius: ctx.radius + 6,
          bottom: 0,
          boxShadow: "0 -24px 48px -12px rgba(0,0,0,0.25)",
          color: ctx.popoverFg,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: DRAWER_HEIGHT,
          left: 0,
          opacity: v.panelOpacity,
          padding: 24,
          position: "absolute",
          right: 0,
          transform: `translateY(${v.panelTranslateY}px)`,
        }}
      >
        <div
          style={{
            background: ctx.border,
            borderRadius: 999,
            height: 5,
            marginBottom: 8,
            width: 40,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 440,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div style={{ color: ctx.mutedFg, fontSize: 14, lineHeight: 1.5 }}>
            {description}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              style={{
                ...buttonBase,
                background: "transparent",
                border: `1px solid ${ctx.border}`,
                color: ctx.cancelFg,
              }}
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              style={{
                ...buttonBase,
                background: ctx.actionBg,
                border: "1px solid transparent",
                color: ctx.actionFg,
              }}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
