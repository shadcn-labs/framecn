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
  },
  durationInFrames: 260,
  fps: FPS,
  importPath: "@/components/framecn/live-code-compilation",
};
