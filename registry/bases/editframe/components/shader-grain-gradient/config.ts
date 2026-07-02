import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderGrainGradientConfig: ComponentConfig = {
  componentName: "ShaderGrainGradient",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    intensity: {
      default: 0.2,
      label: "Intensity",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    noise: {
      default: 0.15,
      label: "Noise",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    softness: {
      default: 0.6,
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
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-grain-gradient",
};
