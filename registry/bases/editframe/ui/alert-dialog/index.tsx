"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type AlertDialogState = "closed" | "opened";

export interface AlertDialogProps {
  state?: AlertDialogState;
  style?: AlertDialogStyle;
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const POPUP_WIDTH = 400;
const MAX_OVERLAY_ALPHA = 0.5;

export interface AlertDialogStyle {
  overlayOpacity: number;
  popupOpacity: number;
  popupScale: number;
  popupTranslateY: number;
}

export interface AlertDialogStyleContext {
  popoverBg: string;
  popoverFg: string;
  mutedFg: string;
  border: string;
  radius: number;
  actionBg: string;
  actionFg: string;
  cancelFg: string;
}

export const alertDialogStyleContext = (
  theme: FramecnTheme
): AlertDialogStyleContext => ({
  actionBg: theme.destructive,
  actionFg: theme.destructiveForeground,
  border: theme.border,
  cancelFg: theme.foreground,
  mutedFg: theme.mutedForeground,
  popoverBg: theme.popover,
  popoverFg: theme.popoverForeground,
  radius: theme.radius,
});

export const alertDialogStyle = (
  state: AlertDialogState,
  _ctx: AlertDialogStyleContext
): AlertDialogStyle => {
  switch (state) {
    case "opened": {
      return {
        overlayOpacity: 1,
        popupOpacity: 1,
        popupScale: 1,
        popupTranslateY: 0,
      };
    }
    default: {
      return {
        overlayOpacity: 0,
        popupOpacity: 0,
        popupScale: 0.95,
        popupTranslateY: 8,
      };
    }
  }
};

export const AlertDialog = ({
  state = "closed",
  style,
  title = "Delete account?",
  description = "This action cannot be undone. This will permanently remove your data from our servers.",
  actionLabel = "Delete",
  cancelLabel = "Cancel",
  theme: themeOverride,
  className,
}: AlertDialogProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = alertDialogStyleContext(theme);
  const v = style ?? alertDialogStyle(state, ctx);
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
        alignItems: "center",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
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
          background: ctx.popoverBg,
          border: `1px solid ${ctx.border}`,
          borderRadius: ctx.radius + 6,
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.25)",
          color: ctx.popoverFg,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: v.popupOpacity,
          padding: 24,
          position: "relative",
          transform: `translateY(${v.popupTranslateY}px) scale(${v.popupScale})`,
          width: POPUP_WIDTH,
        }}
      >
        <div
          style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}
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
  );
};
