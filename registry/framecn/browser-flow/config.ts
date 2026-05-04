import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const browserFlowConfig: ComponentConfig = {
  componentName: "BrowserFlow",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    url: {
      default: "remocn.dev",
      label: "URL",
      type: "text",
    },
  },
  durationInFrames: 270,
  fps: FPS,
  importPath: "@/components/framecn/browser-flow",
};
