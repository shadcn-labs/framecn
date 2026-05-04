import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const frostedGlassWipeConfig: ComponentConfig = {
  componentName: "FrostedGlassWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    glassBlur: {
      default: 24,
      label: "Glass blur (px)",
      max: 48,
      min: 4,
      step: 1,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    transitionDuration: {
      default: 30,
      label: "Transition duration",
      max: 90,
      min: 10,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/frosted-glass-wipe",
};
