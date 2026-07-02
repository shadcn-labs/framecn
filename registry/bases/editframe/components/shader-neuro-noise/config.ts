import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderNeuroNoiseConfig: ComponentConfig = {
  componentName: "ShaderNeuroNoise",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    brightness: {
      default: 0.05,
      label: "Brightness",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    colorMid: { default: "#4a4a68", label: "Mid", type: "color" },
    contrast: {
      default: 0.3,
      label: "Contrast",
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
  importPath: "@/components/framecn/shader-neuro-noise",
};
