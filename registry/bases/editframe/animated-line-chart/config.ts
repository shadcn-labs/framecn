import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const animatedLineChartConfig: ComponentConfig = {
  componentName: "AnimatedLineChart",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    gridColor: { default: "#27272a", label: "Grid color", type: "color" },
    showDot: { default: true, label: "Show leading dot", type: "boolean" },
    strokeColor: { default: "#22c55e", label: "Stroke color", type: "color" },
    strokeWidth: {
      default: 4,
      label: "Stroke width",
      max: 16,
      min: 1,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/animated-line-chart",
};
