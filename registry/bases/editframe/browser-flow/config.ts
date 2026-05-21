import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const browserFlowConfig: ComponentConfig = {
  componentName: "BrowserFlow",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    url: {
      default: "framecn.dev",
      label: "URL",
      type: "text",
    },
  },
  durationInFrames: 270,
  fps: FPS,
  importPath: "@/components/framecn/browser-flow",
};
