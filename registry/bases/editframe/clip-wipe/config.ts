import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionClipWipeConfig: ComponentConfig = {
  componentName: "CaptionClipWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
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
      default: "700",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    keywordColor: { default: "#FFD700", label: "Keyword color", type: "color" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/clip-wipe",
};
