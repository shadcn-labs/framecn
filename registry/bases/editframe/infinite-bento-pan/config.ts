import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const infiniteBentoPanConfig: ComponentConfig = {
  componentName: "InfiniteBentoPan",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#7c3aed",
      label: "Accent color",
      type: "color",
    },
    panSpeed: {
      default: 1,
      label: "Pan speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 300,
  fps: FPS,
  importPath: "@/components/framecn/infinite-bento-pan",
};
