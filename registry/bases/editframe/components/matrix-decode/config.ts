import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const matrixDecodeConfig: ComponentConfig = {
  componentName: "MatrixDecode",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    charset: {
      default: "!@#$%^&*()_+-=<>?/\\|",
      label: "Charset",
      type: "text",
    },
    color: { default: "#22c55e", label: "Color", type: "color" },
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
    revealDuration: {
      default: 60,
      label: "Reveal duration",
      max: 240,
      min: 10,
      step: 1,
      type: "number",
    },
    text: { default: "DECRYPTED", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/matrix-decode",
};
