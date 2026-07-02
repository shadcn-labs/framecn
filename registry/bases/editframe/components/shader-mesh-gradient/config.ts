import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderMeshGradientConfig: ComponentConfig = {
  componentName: "ShaderMeshGradient",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    distortion: {
      default: 0.6,
      label: "Distortion",
      max: 1.5,
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
    swirl: {
      default: 0.1,
      label: "Swirl",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-mesh-gradient",
};
