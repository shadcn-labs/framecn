import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const shimmerSweepConfig: ComponentConfig = {
  componentName: "ShimmerSweep",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    baseColor: { default: "#3f3f46", label: "Base color", type: "color" },
    fontSize: {
      default: 96,
      label: "Font size",
      max: 200,
      min: 16,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 700,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    shineColor: { default: "#fafafa", label: "Shine color", type: "color" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    text: {
      default: "SHIMMER",
      label: "Text",
      type: "text",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/shimmer-sweep",
};
