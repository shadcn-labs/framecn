"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import type { switchStyleContext } from "@/registry/bases/editframe/ui/switch";
import { switchStyle } from "@/registry/bases/editframe/ui/switch";
import type {
  SwitchState,
  SwitchStyle,
} from "@/registry/bases/editframe/ui/switch";

export const DEFAULT_DURATION = 10;

export const tweenSwitchStyle = (
  a: SwitchStyle,
  b: SwitchStyle,
  t: number
): SwitchStyle => ({
  thumbOffset: a.thumbOffset + (b.thumbOffset - a.thumbOffset) * t,
  trackBackground: mixOklch(a.trackBackground, b.trackBackground, t),
});

export interface SwitchTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
}

export const switchTrackAnimation = (duration: number): string =>
  `ef-switch-track ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`;

export const switchThumbAnimation = (duration: number): string =>
  `ef-switch-thumb ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`;

export const getSwitchKeyframes = (
  from: SwitchState,
  to: SwitchState,
  ctx: ReturnType<typeof switchStyleContext>,
  travel: number
): string => {
  const fromStyle = switchStyle(from, ctx);
  const toStyle = switchStyle(to, ctx);
  const fromOffset = from === "checked" ? 1 : 0;
  const toOffset = to === "checked" ? 1 : 0;

  return `
    @keyframes ef-switch-track {
      0% {
        background-color: ${fromStyle.trackBackground};
      }
      100% {
        background-color: ${toStyle.trackBackground};
      }
    }
    @keyframes ef-switch-thumb {
      0% {
        transform: translateX(${fromOffset * travel}px);
      }
      100% {
        transform: translateX(${toOffset * travel}px);
      }
    }
  `;
};
