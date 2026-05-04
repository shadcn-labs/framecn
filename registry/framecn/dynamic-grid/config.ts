import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const dynamicGridConfig: ComponentConfig = {
  componentName: "DynamicGrid",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    cellSize: {
      default: 40,
      label: "Cell size",
      max: 160,
      min: 8,
      step: 4,
      type: "number",
    },
    direction: {
      default: "diagonal",
      label: "Direction",
      options: ["diagonal", "horizontal", "vertical"],
      type: "select",
    },
    lineColor: { default: "#27272a", label: "Line color", type: "color" },
    speed: {
      default: 0.5,
      label: "Speed",
      max: 4,
      min: 0,
      step: 0.1,
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/dynamic-grid",
};
