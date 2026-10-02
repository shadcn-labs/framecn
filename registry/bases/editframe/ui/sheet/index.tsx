"use client";

import { FramecnIcon, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type SheetState = "opened" | "closed";

export interface SheetProps {
  state?: SheetState;
  style?: SheetStyle;
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const SHEET_WIDTH = 384;
const MAX_OVERLAY_ALPHA = 0.5;

export interface SheetStyle {
  overlayOpacity: number;
  panelOpacity: number;
  panelTranslateX: number;
}

export interface SheetStyleContext {
  popoverBg: string;
  popoverFg: string;
  mutedFg: string;
  border: string;
  radius: number;
  actionBg: string;
  actionFg: string;
  cancelFg: string;
}

export const sheetStyleContext = (theme: FramecnTheme): SheetStyleContext => ({
  actionBg: theme.primary,
  actionFg: theme.primaryForeground,
  border: theme.border,
  cancelFg: theme.foreground,
  mutedFg: theme.mutedForeground,
  popoverBg: theme.background,
  popoverFg: theme.foreground,
  radius: theme.radius,
});

export const sheetStyle = (
  state: SheetState,
  _ctx: SheetStyleContext
): SheetStyle => {
  switch (state) {
    case "opened": {
      return {
        overlayOpacity: 1,
        panelOpacity: 1,
        panelTranslateX: 0,
      };
    }
    default: {
      return {
        overlayOpacity: 0,
        panelOpacity: 0,
        panelTranslateX: SHEET_WIDTH,
      };
    }
  }
};

export const Sheet = ({
  state = "closed",
  style,
  title = "Edit profile",
  description = "Make changes to your profile here. Click save when you're done.",
  actionLabel = "Save changes",
  cancelLabel = "Cancel",
  theme: themeOverride,
  className,
}: SheetProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = sheetStyleContext(theme);
  const v = style ?? sheetStyle(state, ctx);
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
          background: ctx.popoverBg,
          borderLeft: `1px solid ${ctx.border}`,
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
          boxSizing: "border-box",
          color: ctx.popoverFg,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          height: "100%",
          maxWidth: "75%",
          opacity: v.panelOpacity,
          padding: 16,
          position: "absolute",
          right: 0,
          top: 0,
          transform: `translateX(${v.panelTranslateX}px)`,
          width: SHEET_WIDTH,
        }}
      >
        <button
          type="button"
          aria-label="Close"
          style={{
            alignItems: "center",
            background: "transparent",
            border: "none",
            borderRadius: 2,
            color: ctx.popoverFg,
            cursor: "pointer",
            display: "inline-flex",
            height: 16,
            justifyContent: "center",
            opacity: 0.7,
            padding: 0,
            position: "absolute",
            right: 16,
            top: 16,
            width: 16,
          }}
        >
          <FramecnIcon name="X" size={16} />
        </button>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "24px",
            paddingRight: 28,
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
  );
};
