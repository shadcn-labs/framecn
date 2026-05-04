import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const meshGradientBgConfig: ComponentConfig = {
  componentName: "MeshGradientBg",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    blur: {
      default: 80,
      label: "Blur",
      max: 200,
      min: 20,
      step: 4,
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 4,
      min: 0,
      step: 0.1,
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/mesh-gradient-bg",
};
