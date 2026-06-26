import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const microScaleFadeConfig: ComponentConfig = {
  componentName: "MicroScaleFade",
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
    scaleFrom: {
      default: 0.96,
      label: "Scale from",
      max: 1,
      min: 0.5,
      step: 0.01,
      type: "number",
    },
    text: { default: "Scale fade in", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/micro-scale-fade",
};
