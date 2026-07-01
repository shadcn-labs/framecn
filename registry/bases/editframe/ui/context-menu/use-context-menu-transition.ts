"use client";

import type {
  ContextMenuState,
  ContextMenuStyle,
} from "@/registry/bases/editframe/ui/context-menu";

export const DEFAULT_DURATION = 10;

export const tweenContextMenuStyle = (
  a: ContextMenuStyle,
  b: ContextMenuStyle,
  t: number
): ContextMenuStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export const contextMenuAnimation = (
  from: ContextMenuState,
  to: ContextMenuState,
  duration: number = DEFAULT_DURATION
): string => {
  const fromStyle =
    from === "opened"
      ? { opacity: 1, scale: 1, translateY: 0 }
      : { opacity: 0, scale: 0.95, translateY: -4 };
  const toStyle =
    to === "opened"
      ? { opacity: 1, scale: 1, translateY: 0 }
      : { opacity: 0, scale: 0.95, translateY: -4 };

  const keyframes = `
    @keyframes ef-context-menu-${from}-${to} {
      0% {
        opacity: ${fromStyle.opacity};
        transform: translateY(${fromStyle.translateY}px) scale(${fromStyle.scale});
      }
      100% {
        opacity: ${toStyle.opacity};
        transform: translateY(${toStyle.translateY}px) scale(${toStyle.scale});
      }
    }
  `;

  const styleId = `ef-context-menu-keyframes-${from}-${to}`;
  let styleEl = document.querySelector(`#${styleId}`);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = keyframes;
    document.head.append(styleEl);
  }

  return `ef-context-menu-${from}-${to} ${duration}ms ease-out forwards`;
};

export const useContextMenuAnimation = (
  from: ContextMenuState,
  to: ContextMenuState
): string | undefined => {
  if (from === to) {
    return undefined;
  }

  return contextMenuAnimation(from, to, DEFAULT_DURATION);
};
