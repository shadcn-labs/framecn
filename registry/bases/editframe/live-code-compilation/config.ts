import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const liveCodeCompilationConfig: ComponentConfig = {
  componentName: "LiveCodeCompilation",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#3b82f6",
      label: "Accent color",
      type: "color",
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
  durationInFrames: 260,
  fps: FPS,
  importPath: "@/components/framecn/live-code-compilation",
};
