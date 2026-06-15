import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionKineticSlamConfig: ComponentConfig = {
  componentName: "CaptionKineticSlam",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    color: { default: "#ffffff", label: "Color", type: "color" },
    fontSize: {
      default: 120,
      label: "Font size",
      max: 240,
      min: 48,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: "900",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/kinetic-slam",
};
