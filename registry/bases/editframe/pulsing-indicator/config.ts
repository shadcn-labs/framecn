import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const pulsingIndicatorConfig: ComponentConfig = {
  componentName: "PulsingIndicator",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "white", label: "Background", type: "color" },
    color: { default: "#22c55e", label: "Dot color", type: "color" },
    period: {
      default: 8,
      label: "Period (frames)",
      max: 30,
      min: 2,
      step: 1,
      type: "number",
    },
    size: {
      default: 16,
      label: "Size",
      max: 64,
      min: 4,
      step: 2,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/pulsing-indicator",
};
