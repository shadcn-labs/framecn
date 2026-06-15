import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionHighlightConfig: ComponentConfig = {
  componentName: "CaptionHighlight",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    color: { default: "#ffffff", label: "Word color", type: "color" },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 160,
      min: 24,
      step: 2,
      type: "number",
    },
    fontWeight: {
      default: "800",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    highlightColor: {
      default: "#ff1745",
      label: "Highlight color",
      type: "color",
    },
    wordsPerGroup: {
      default: 3,
      label: "Words per group",
      max: 5,
      min: 1,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/highlight",
};
