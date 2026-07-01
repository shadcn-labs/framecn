import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderSimplexNoiseConfig: ComponentConfig = {
  componentName: "ShaderSimplexNoise",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    softness: {
      default: 0.1,
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
    stepsPerColor: {
      default: 2,
      label: "Steps",
      max: 6,
      min: 1,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-simplex-noise",
};
