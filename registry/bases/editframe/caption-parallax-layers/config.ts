import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const captionParallaxLayersConfig: ComponentConfig = {
  componentName: "CaptionParallaxLayers",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    behindColor: {
      default: "#e50914",
      label: "Behind layer color",
      type: "color",
    },
    behindFontSize: {
      default: 220,
      label: "Behind font size",
      max: 320,
      min: 80,
      step: 4,
      type: "number",
    },
    color: { default: "#eeeeee", label: "Front color", type: "color" },
    frontFontSize: {
      default: 130,
      label: "Front font size",
      max: 200,
      min: 40,
      step: 2,
      type: "number",
    },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/framecn/caption-parallax-layers",
};
