import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const gridPixelateWipeConfig: ComponentConfig = {
  componentName: "GridPixelateWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    cellFadeFrames: {
      default: 4,
      label: "Cell fade (frames)",
      max: 20,
      min: 1,
      step: 1,
      type: "number",
    },
    cols: {
      default: 12,
      label: "Columns",
      max: 32,
      min: 2,
      step: 1,
      type: "number",
    },
    pattern: {
      default: "wave",
      label: "Pattern",
      options: ["wave", "diagonal", "spiral"],
      type: "select",
    },
    rows: {
      default: 7,
      label: "Rows",
      max: 24,
      min: 2,
      step: 1,
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
  importPath: "@/components/framecn/grid-pixelate-wipe",
};
