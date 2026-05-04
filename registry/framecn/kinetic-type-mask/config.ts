import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const kineticTypeMaskConfig: ComponentConfig = {
  componentName: "KineticTypeMask",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    holdFrames: {
      default: 12,
      label: "Hold frames",
      max: 60,
      min: 0,
      step: 1,
      type: "number",
    },
    maxScale: {
      default: 120,
      label: "Max scale",
      max: 300,
      min: 20,
      step: 5,
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
    text: { default: "NEXT", label: "Text", type: "text" },
    transitionDuration: {
      default: 24,
      label: "Transition duration",
      max: 60,
      min: 8,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/kinetic-type-mask",
};
