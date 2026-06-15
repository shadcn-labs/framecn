import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionEditorialEmphasisConfig: ComponentConfig = {
  componentName: "CaptionEditorialEmphasis",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#f5f0d0", label: "Text color", type: "color" },
    emphasisScale: {
      default: 2,
      label: "Emphasis scale",
      max: 3,
      min: 1.2,
      step: 0.1,
      type: "number",
    },
    fontSize: {
      default: 56,
      label: "Font size",
      max: 120,
      min: 24,
      step: 2,
      type: "number",
    },
    fontWeight: {
      default: "400",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/editorial-emphasis",
};
