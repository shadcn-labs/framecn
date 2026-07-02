import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderPerlinNoiseConfig: ComponentConfig = {
  componentName: "ShaderPerlinNoise",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    colorFront: { default: "#6a6a85", label: "Front", type: "color" },
    proportion: {
      default: 0.35,
      label: "Proportion",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
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
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-perlin-noise",
};
