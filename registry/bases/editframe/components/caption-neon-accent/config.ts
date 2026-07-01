import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionNeonAccentConfig: ComponentConfig = {
  componentName: "CaptionNeonAccent",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: { default: "#a855f7", label: "Accent color", type: "color" },
    accentScale: {
      default: 1.5,
      label: "Accent size scale",
      max: 2.5,
      min: 1.2,
      step: 0.1,
      type: "number",
    },
    color: { default: "#ffffff", label: "Word color", type: "color" },
    fontSize: {
      default: 64,
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
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/caption-neon-accent",
};
