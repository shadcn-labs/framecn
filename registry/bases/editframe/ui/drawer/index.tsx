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
  muted: string;
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
  muted: theme.muted,
  mutedFg: theme.mutedForeground,
  popoverBg: theme.background,
  popoverFg: theme.foreground,
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
  const theme = useFramecnTheme(themeOverride);
  const ctx = drawerStyleContext(theme);
  const v = style ?? drawerStyle(state, ctx);
  const buttonBase: React.CSSProperties = {
    alignItems: "center",
    borderRadius: Math.max(0, ctx.radius - 2),
    cursor: "pointer",
    display: "inline-flex",
    fontSize: 14,
    fontWeight: 500,
    height: 36,
    justifyContent: "center",
    lineHeight: "20px",
    padding: "0 16px",
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
          borderTopLeftRadius: ctx.radius,
          borderTopRightRadius: ctx.radius,
          bottom: 0,
          boxSizing: "border-box",
          color: ctx.popoverFg,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: DRAWER_HEIGHT,
          left: 0,
          maxHeight: "80%",
          opacity: v.panelOpacity,
          padding: 16,
          position: "absolute",
          right: 0,
          transform: `translateY(${v.panelTranslateY}px)`,
        }}
      >
        <div
          style={{
            background: ctx.muted,
            borderRadius: 999,
            height: 8,
            marginBottom: 8,
            width: 100,
          }}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            gap: 6,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "24px",
            }}
          >
            {title}
          </div>
          <div style={{ color: ctx.mutedFg, fontSize: 14, lineHeight: "20px" }}>
            {description}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: "auto",
            }}
          >
            <button
              type="button"
              style={{
                ...buttonBase,
                background: ctx.popoverBg,
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
