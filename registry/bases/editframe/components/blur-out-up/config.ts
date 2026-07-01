import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const blurOutUpConfig: ComponentConfig = {
  componentName: "BlurOutUp",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
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
    staggerDelay: {
      default: 4,
      label: "Stagger delay (frames)",
      max: 10,
      min: 1,
      step: 1,
      type: "number",
    },
    text: { default: "Words fade and blur", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/blur-out-up",
};
