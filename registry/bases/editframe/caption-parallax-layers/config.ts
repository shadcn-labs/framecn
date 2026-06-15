import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionParallaxLayersConfig: ComponentConfig = {
  componentName: "CaptionParallaxLayers",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    behindColor: {
      default: "#a78bfa",
      label: "Behind layer color",
      type: "color",
    },
    color: { default: "#ffffff", label: "Front color", type: "color" },
    fontSize: {
      default: 56,
      label: "Font size",
      max: 120,
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
  importPath: "@/components/framecn/caption-parallax-layers",
};
