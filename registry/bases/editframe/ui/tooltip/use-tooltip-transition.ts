import type { TooltipState } from "@/registry/bases/editframe/ui/tooltip";

export const DEFAULT_DURATION = 8;

export const getEasingFunction = (t: number): number => 1 - (1 - t) ** 3;

export const getTooltipAnimation = (
  from: TooltipState,
  duration: number = DEFAULT_DURATION
): {
  animationName: string;
  animationDuration: string;
  animationTimingFunction: string;
  animationFillMode: string;
} => {
  if (from === "hidden") {
    return {
      animationDuration: `${duration / 60}s`,
      animationFillMode: "forwards",
      animationName: "ef-tooltip-show",
      animationTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
    };
  }

  return {
    animationDuration: `${duration / 60}s`,
    animationFillMode: "forwards",
    animationName: "ef-tooltip-hide",
    animationTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
  };
};

export const getTooltipKeyframes = (): string => `
    @keyframes ef-tooltip-show {
      0% {
        opacity: 0;
        transform: translate(0, 4px) scale(0.96);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
    }
    @keyframes ef-tooltip-hide {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(0, 4px) scale(0.96);
      }
    }
  `;
