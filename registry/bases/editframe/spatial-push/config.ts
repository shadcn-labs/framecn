import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const spatialPushConfig: ComponentConfig = {
  componentName: "SpatialPush",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#000000", label: "Background", type: "color" },
    direction: {
      default: "up",
      label: "Direction",
      options: ["up", "down", "left", "right"],
      type: "select",
    },
    transitionDuration: {
      default: 30,
      label: "Transition duration (frames)",
      max: 60,
      min: 10,
      step: 5,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/spatial-push",
};
