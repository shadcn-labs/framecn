import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderSwirlConfig: ComponentConfig = {
  componentName: "ShaderSwirl",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    bandCount: {
      default: 4,
      label: "Bands",
      max: 12,
      min: 1,
      step: 1,
      type: "number",
    },
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    softness: {
      default: 0.2,
      label: "Softness",
      max: 1,
      min: 0,
      step: 0.05,
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
    twist: {
      default: 0.1,
      label: "Twist",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-swirl",
};
