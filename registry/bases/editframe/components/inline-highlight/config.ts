import { FONT_WEIGHT_OPTIONS, FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const inlineHighlightConfig: ComponentConfig = {
  componentName: "InlineHighlight",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    after: { default: ".", label: "After", type: "text" },
    baseColor: { default: "#171717", label: "Base color", type: "color" },
    before: { default: "Ship faster with ", label: "Before", type: "text" },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 160,
      min: 12,
      step: 1,
      type: "number",
    },
    fontWeight: {
      default: "600",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    highlight: { default: "framecn", label: "Highlight", type: "text" },
    highlightColor: {
      default: "#ff5e3a",
      label: "Highlight color",
      type: "color",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/inline-highlight",
};
