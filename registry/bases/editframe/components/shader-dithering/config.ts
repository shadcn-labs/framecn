import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderDitheringConfig: ComponentConfig = {
  componentName: "ShaderDithering",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    colorFront: { default: "#6a6a85", label: "Front", type: "color" },
    size: {
      default: 2,
      label: "Dot Size",
      max: 8,
      min: 1,
      step: 1,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 4,
      min: 0.1,
      step: 0.1,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-dithering",
};
