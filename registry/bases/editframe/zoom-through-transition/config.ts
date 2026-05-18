import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const zoomThroughTransitionConfig: ComponentConfig = {
  componentName: "ZoomThroughTransition",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "white", label: "Background", type: "color" },
    targetScale: {
      default: 20,
      label: "Target scale",
      max: 100,
      min: 2,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/zoom-through-transition",
};
