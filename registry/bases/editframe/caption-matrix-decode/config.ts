import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionMatrixDecodeConfig: ComponentConfig = {
  componentName: "CaptionMatrixDecode",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#00ff41", label: "Text color", type: "color" },
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
  importPath: "@/components/framecn/caption-matrix-decode",
};
