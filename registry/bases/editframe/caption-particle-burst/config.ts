import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionParticleBurstConfig: ComponentConfig = {
  componentName: "CaptionParticleBurst",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    burstColor: { default: "#fbbf24", label: "Burst color", type: "color" },
    color: { default: "#ffffff", label: "Text color", type: "color" },
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
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/caption-particle-burst",
};
