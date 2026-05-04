import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const chromaticAberrationWipeConfig: ComponentConfig = {
  componentName: "ChromaticAberrationWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    aberrationOffset: {
      default: 8,
      label: "Aberration offset (px)",
      max: 24,
      min: 2,
      step: 1,
      type: "number",
    },
    direction: {
      default: "left",
      label: "Direction",
      options: ["left", "right"],
      type: "select",
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
      default: 7,
      label: "Transition duration",
      max: 16,
      min: 4,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/chromatic-aberration-wipe",
};
