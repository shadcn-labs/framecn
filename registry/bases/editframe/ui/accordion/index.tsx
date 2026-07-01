"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  accordionKeyframes,
  accordionAnimation,
} from "@/registry/bases/editframe/ui/accordion/use-accordion-transition";

export type AccordionState = "opened" | "closed";

type AccordionVariant = "default" | "ghost";

export interface AccordionProps {
  state?: AccordionState;
  from?: AccordionState;
  title?: string;
  content?: string;
  contentHeight?: number;
  variant?: AccordionVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const CARD_WIDTH = 440;

interface VariantTokens {
  bordered: boolean;
  closedBg: string;
  openBg: string;
}
const variantTokens = (
  variant: AccordionVariant,
  theme: FramecnTheme
): VariantTokens => {
  const variants = {
    default: {
      bordered: true,
      closedBg: theme.background,
      openBg: mixOklch(theme.background, theme.muted, 0.5),
    },
    ghost: {
      bordered: false,
      closedBg: theme.background,
      openBg: mixOklch(theme.background, theme.muted, 0.25),
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
  const tokens = variantTokens(variant, theme);
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
  from,
  title = "Is it accessible?",
  content = "Yes. It adheres to the WAI-ARIA design pattern.",
  contentHeight = 64,
  variant = "default",
  theme: themeOverride,
  className,
  duration = "14frames",
}: AccordionProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = accordionStyleContext(variant, theme);
  const v = accordionStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const anim = hasAnimation
    ? accordionAnimation(from, state, duration)
    : "none";

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
      <style>{accordionKeyframes(ctx)}</style>
      <div
        className={className}
        style={{
          animation: hasAnimation ? anim : undefined,
          background: v.background,
          border: ctx.bordered
            ? `1px solid ${ctx.border}`
            : "1px solid transparent",
          borderRadius: theme.radius,
          overflow: "hidden",
          width: CARD_WIDTH,
        }}
      >
        <div
          style={{
            alignItems: "center",
            color: ctx.foreground,
            display: "flex",
            fontSize: 15,
            fontWeight: 500,
            gap: 24,
            justifyContent: "space-between",
            letterSpacing: "-0.01em",
            padding: 16,
          }}
        >
          <span>{title}</span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              animation: hasAnimation ? anim : undefined,
              flexShrink: 0,
              transform: `rotate(${v.chevronRotation}deg)`,
            }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke={ctx.mutedForeground}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
              color: ctx.mutedForeground,
              fontSize: 14,
              lineHeight: 1.5,
              padding: "0 16px 16px",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
