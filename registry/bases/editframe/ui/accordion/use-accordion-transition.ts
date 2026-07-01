"use client";

import { easings, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { accordionStyleContext } from "@/registry/bases/editframe/ui/accordion";
import type {
  AccordionState,
  AccordionStyle,
  AccordionStyleContext,
} from "@/registry/bases/editframe/ui/accordion";

export const DEFAULT_DURATION = 14;

export const tweenAccordionStyle = (
  a: AccordionStyle,
  b: AccordionStyle,
  t: number
): AccordionStyle => ({
  background: mixOklch(a.background, b.background, t),
  chevronRotation:
    a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
  panelHeight: a.panelHeight + (b.panelHeight - a.panelHeight) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
});

export interface AccordionTransitionOptions {
  variant?: "default" | "ghost";
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export interface AccordionCssAnimation {
  keyframes: string;
  panelHeightFrom: number;
  panelHeightTo: number;
  panelOpacityFrom: number;
  panelOpacityTo: number;
  chevronRotationFrom: number;
  chevronRotationTo: number;
  backgroundFrom: string;
  backgroundTo: string;
}

const ACCORDION_CLOSED_STYLE: AccordionStyle = {
  background: "transparent",
  chevronRotation: 0,
  panelHeight: 0,
  panelOpacity: 0,
};

const ACCORDION_OPENED_STYLE: AccordionStyle = {
  background: "transparent",
  chevronRotation: 180,
  panelHeight: 1,
  panelOpacity: 1,
};
const accordionClosedStyle = (ctx: AccordionStyleContext): AccordionStyle => ({
  ...ACCORDION_CLOSED_STYLE,
  background: ctx.closedBg,
});
const accordionOpenedStyle = (ctx: AccordionStyleContext): AccordionStyle => ({
  ...ACCORDION_OPENED_STYLE,
  background: ctx.openBg,
});

export const accordionKeyframes = (ctx: AccordionStyleContext): string => {
  const closed = accordionClosedStyle(ctx);
  const opened = accordionOpenedStyle(ctx);
  return `
    @keyframes framecn-accordion-open {
      0% {
        --accordion-panel-height: ${closed.panelHeight};
        --accordion-panel-opacity: ${closed.panelOpacity};
        --accordion-chevron-rotation: ${closed.chevronRotation}deg;
        background: ${closed.background};
      }
      100% {
        --accordion-panel-height: ${opened.panelHeight};
        --accordion-panel-opacity: ${opened.panelOpacity};
        --accordion-chevron-rotation: ${opened.chevronRotation}deg;
        background: ${opened.background};
      }
    }
    @keyframes framecn-accordion-close {
      0% {
        --accordion-panel-height: ${opened.panelHeight};
        --accordion-panel-opacity: ${opened.panelOpacity};
        --accordion-chevron-rotation: ${opened.chevronRotation}deg;
        background: ${opened.background};
      }
      100% {
        --accordion-panel-height: ${closed.panelHeight};
        --accordion-panel-opacity: ${closed.panelOpacity};
        --accordion-chevron-rotation: ${closed.chevronRotation}deg;
        background: ${closed.background};
      }
    }
  `;
};

export const accordionAnimation = (
  from: AccordionState,
  to: AccordionState,
  duration: string
): string => {
  if (from === "closed" && to === "opened") {
    return `${duration} framecn-accordion-open ease-out forwards`;
  }
  if (from === "opened" && to === "closed") {
    return `${duration} framecn-accordion-close ease-out forwards`;
  }
  return "none";
};
