import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const simulatedCursorConfig: ComponentConfig = {
  componentName: "SimulatedCursor",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    color: { default: "#ffffff", label: "Cursor color", type: "color" },
    size: {
      default: 32,
      label: "Cursor size",
      max: 64,
      min: 16,
      step: 4,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/simulated-cursor",
};
