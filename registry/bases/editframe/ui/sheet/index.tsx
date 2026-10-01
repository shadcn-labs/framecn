"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
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

const SHEET_WIDTH = 400;
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
  popoverBg: theme.popover,
  popoverFg: theme.popoverForeground,
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
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = sheetStyleContext(theme);
  const v = style ?? sheetStyle(state, ctx);
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
          background: ctx.popoverBg,
          borderLeft: `1px solid ${ctx.border}`,
          boxShadow: "-24px 0 48px -12px rgba(0,0,0,0.25)",
          color: ctx.popoverFg,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: "100%",
          opacity: v.panelOpacity,
          padding: 24,
          position: "absolute",
          right: 0,
          top: 0,
          transform: `translateX(${v.panelTranslateX}px)`,
          width: SHEET_WIDTH,
        }}
      >
        <button
          type="button"
          style={{
            alignItems: "center",
            background: "transparent",
            border: "none",
            borderRadius: ctx.radius,
            color: ctx.mutedFg,
            cursor: "pointer",
            display: "inline-flex",
            height: 28,
            justifyContent: "center",
            position: "absolute",
            right: 16,
            top: 16,
            width: 28,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6 6 18 M6 6 18 18"
              stroke={ctx.mutedFg}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            paddingRight: 28,
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
            marginTop: "auto",
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
