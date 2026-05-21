import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const animatedBarChartConfig: ComponentConfig = {
  componentName: "AnimatedBarChart",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    barColor: { default: "#0ea5e9", label: "Bar color", type: "color" },
    gap: {
      default: 16,
      label: "Gap",
      max: 80,
      min: 0,
      step: 2,
      type: "number",
    },
    staggerFrames: {
      default: 6,
      label: "Stagger frames",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/animated-bar-chart",
};
