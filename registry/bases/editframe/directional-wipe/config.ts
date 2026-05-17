import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const directionalWipeConfig: ComponentConfig = {
  componentName: "DirectionalWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    direction: {
      default: "left",
      label: "Direction",
      options: ["left", "right", "up", "down"],
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
      default: 20,
      label: "Transition duration",
      max: 60,
      min: 4,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/directional-wipe",
};
