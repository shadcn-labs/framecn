import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const caretConfig: ComponentConfig = {
  componentName: "Caret",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    blink: { default: true, label: "Blink", type: "boolean" },
    blinkPerSecond: {
      default: 1,
      label: "Blink/sec",
      max: 4,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    color: { default: "#1F1E1D", label: "Color", type: "color" },
    height: {
      default: 28,
      label: "Height",
      max: 80,
      min: 8,
      step: 2,
      type: "number",
    },
    radius: {
      default: 1,
      label: "Radius",
      max: 8,
      min: 0,
      step: 1,
      type: "number",
    },
    width: {
      default: 3,
      label: "Width",
      max: 8,
      min: 1,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/caret",
};
