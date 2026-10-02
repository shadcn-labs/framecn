"use client";

import { FramecnIcon, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type AccordionState = "opened" | "closed";

type AccordionVariant = "default" | "ghost";

export interface AccordionProps {
  state?: AccordionState;
  style?: AccordionStyle;
  title?: string;
  content?: string;
  contentHeight?: number;
  variant?: AccordionVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const CARD_WIDTH = 440;

interface VariantTokens {
  bordered: boolean;
  closedBg: string;
  openBg: string;
}

const variantTokens = (variant: AccordionVariant): VariantTokens => {
  const variants = {
    default: {
      bordered: true,
      closedBg: "transparent",
      openBg: "transparent",
    },
    ghost: {
      bordered: false,
      closedBg: "transparent",
      openBg: "transparent",
    },
  };

  return variants[variant] ?? variants.default;
};

export interface AccordionStyle {
  panelHeight: number;
  panelOpacity: number;
  chevronRotation: number;
  background: string;
}

export interface AccordionStyleContext {
  bordered: boolean;
  closedBg: string;
  openBg: string;
  border: string;
  foreground: string;
  mutedForeground: string;
}

export const accordionStyleContext = (
  variant: AccordionVariant,
  theme: FramecnTheme
): AccordionStyleContext => {
  const tokens = variantTokens(variant);
  return {
    border: theme.border,
    bordered: tokens.bordered,
    closedBg: tokens.closedBg,
    foreground: theme.foreground,
    mutedForeground: theme.mutedForeground,
    openBg: tokens.openBg,
  };
};

export const accordionStyle = (
  state: AccordionState,
  ctx: AccordionStyleContext
): AccordionStyle => {
  switch (state) {
    case "opened": {
      return {
        background: ctx.openBg,
        chevronRotation: 180,
        panelHeight: 1,
        panelOpacity: 1,
      };
    }
    default: {
      return {
        background: ctx.closedBg,
        chevronRotation: 0,
        panelHeight: 0,
        panelOpacity: 0,
      };
    }
  }
};

export const Accordion = ({
  state = "closed",
  style,
  title = "Is it accessible?",
  content = "Yes. It adheres to the WAI-ARIA design pattern.",
  contentHeight = 64,
  variant = "default",
  theme: themeOverride,
  className,
}: AccordionProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = accordionStyleContext(variant, theme);
  const v = style ?? accordionStyle(state, ctx);
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
      <div
        className={className}
        style={{
          background: v.background,
          borderBottom: ctx.bordered ? `1px solid ${ctx.border}` : undefined,
          overflow: "hidden",
          width: CARD_WIDTH,
        }}
      >
        <div
          style={{
            alignItems: "flex-start",
            color: ctx.foreground,
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            gap: 16,
            justifyContent: "space-between",
            lineHeight: "20px",
            padding: "16px 0",
          }}
        >
          <span>{title}</span>
          <FramecnIcon
            name="ChevronDown"
            size={16}
            color={ctx.mutedForeground}
            style={{
              flexShrink: 0,
              transform: `translateY(2px) rotate(${v.chevronRotation}deg)`,
            }}
          />
        </div>

        <div
          style={{
            height: contentHeight * v.panelHeight,
            opacity: v.panelOpacity,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: ctx.foreground,
              fontSize: 14,
              lineHeight: 1.5,
              padding: "0 0 16px",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
