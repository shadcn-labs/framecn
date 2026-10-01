import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const spinnerConfig: ComponentConfig = {
  componentName: "Spinner",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    size: {
      default: 20,
      label: "Size",
      max: 64,
      min: 8,
      step: 2,
      type: "number",
    },
    strokeWidth: {
      default: 2.5,
      label: "Stroke width",
      max: 6,
      min: 1,
      step: 0.5,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/spinner",
};
