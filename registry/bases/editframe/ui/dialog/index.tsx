"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  dialogKeyframes,
  dialogAnimation,
} from "@/registry/bases/editframe/ui/dialog/use-dialog-transition";

export type DialogState = "open" | "closed";

export interface DialogProps {
  state?: DialogState;
  from?: DialogState;
  title?: string;
  description?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const DIALOG_WIDTH = 420;

export interface DialogStyle {
  overlayOpacity: number;
  popupOpacity: number;
  popupScale: number;
  popupTranslateY: number;
}

export interface DialogStyleContext {
  background: string;
  border: string;
  foreground: string;
  mutedForeground: string;
}

export const dialogStyleContext = (
  theme: FramecnTheme
): DialogStyleContext => ({
  background: theme.popover,
  border: theme.border,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
});

export const dialogStyle = (
  state: DialogState,
  _ctx: DialogStyleContext
): DialogStyle => {
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

export const Dialog = ({
  state = "open",
  from,
  title = "Edit profile",
  description = "Make changes to your profile here.",
  theme: themeOverride,
  className,
  duration = "12frames",
}: DialogProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = dialogStyleContext(theme);
  const v = dialogStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? dialogStyle(from, ctx) : v;
  const anim = hasAnimation
    ? dialogAnimation(from, state, duration, fromStyle, v)
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
      {hasAnimation && <style>{dialogKeyframes(fromStyle, v)}</style>}
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
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
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
              fontSize: 18,
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
            height: 100,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
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
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
