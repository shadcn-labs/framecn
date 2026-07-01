"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  alertDialogKeyframes,
  alertDialogAnimation,
} from "@/registry/bases/editframe/ui/alert-dialog/use-alert-dialog-transition";

export type AlertDialogState = "open" | "closed";

export interface AlertDialogProps {
  state?: AlertDialogState;
  from?: AlertDialogState;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const DIALOG_WIDTH = 420;

export interface AlertDialogStyle {
  overlayOpacity: number;
  popupOpacity: number;
  popupScale: number;
  popupTranslateY: number;
}

export interface AlertDialogStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
}

export const alertDialogStyleContext = (
  theme: FramecnTheme
): AlertDialogStyleContext => ({
  background: theme.popover,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
});

export const alertDialogStyle = (
  state: AlertDialogState,
  _ctx: AlertDialogStyleContext
): AlertDialogStyle => {
  switch (state) {
    case "open": {
      return {
        overlayOpacity: 0.6,
        popupOpacity: 1,
        popupScale: 1,
        popupTranslateY: 0,
      };
    }
    default: {
      return {
        overlayOpacity: 0,
        popupOpacity: 0,
        popupScale: 0.96,
        popupTranslateY: 8,
      };
    }
  }
};

export function AlertDialog({
  state = "open",
  from,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  cancelLabel = "Cancel",
  confirmLabel = "Continue",
  theme: themeOverride,
  className,
  duration = "12frames",
}: AlertDialogProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = alertDialogStyleContext(theme);
  const v = alertDialogStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? alertDialogStyle(from, ctx) : v;
  const anim = hasAnimation
    ? alertDialogAnimation(from, state, duration, fromStyle, v)
    : { overlay: "none", popup: "none" };

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
      {hasAnimation && <style>{alertDialogKeyframes(fromStyle, v)}</style>}
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
          animation: hasAnimation ? anim.popup : undefined,
          background: ctx.background,
          border: `1px solid ${ctx.border}`,
          borderRadius: theme.radius,
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: v.popupOpacity,
          padding: 24,
          position: "relative",
          transform: `translateY(${v.popupTranslateY}px) scale(${v.popupScale})`,
          width: DIALOG_WIDTH,
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
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <button
            type="button"
            style={{
              background: "transparent",
              border: `1px solid ${ctx.border}`,
              borderRadius: theme.radius,
              color: ctx.foreground,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            style={{
              background: theme.destructive,
              border: "none",
              borderRadius: theme.radius,
              color: theme.destructiveForeground,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
