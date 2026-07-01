import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const softBlurInConfig: ComponentConfig = {
  componentName: "SoftBlurIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    blur: {
      default: 12,
      label: "Blur (px)",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 200,
      min: 24,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 600,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    text: { default: "Soft blur letters", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/soft-blur-in",
};
