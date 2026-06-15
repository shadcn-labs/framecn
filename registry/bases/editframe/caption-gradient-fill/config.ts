import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionGradientFillConfig: ComponentConfig = {
  componentName: "CaptionGradientFill",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    fontSize: {
      default: 80,
      label: "Font size",
      max: 160,
      min: 24,
      step: 2,
      type: "number",
    },
    fontWeight: {
      default: "700",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    fromColor: { default: "#fe9f1b", label: "Gradient start", type: "color" },
    midColor: { default: "#ff2063", label: "Gradient mid", type: "color" },
    toColor: { default: "#ef7aff", label: "Gradient end", type: "color" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/caption-gradient-fill",
};
