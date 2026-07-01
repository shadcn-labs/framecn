import type { ComponentConfig } from "@/lib/customizer-config";
import { FONT_WEIGHT_OPTIONS, FPS, H, W } from "@/lib/customizer-config";

export const markerHighlightConfig: ComponentConfig = {
  componentName: "MarkerHighlight",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    after: { default: ".", label: "After", type: "text" },
    baseColor: { default: "#171717", label: "Base color", type: "color" },
    before: { default: "Made for ", label: "Before", type: "text" },
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
    highlight: { default: "builders", label: "Highlight", type: "text" },
    highlightedTextColor: {
      default: "#171717",
      label: "Highlighted text color",
      type: "color",
    },
    markerColor: { default: "#facc15", label: "Marker color", type: "color" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/marker-highlight",
};
