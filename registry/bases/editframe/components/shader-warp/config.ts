import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderWarpConfig: ComponentConfig = {
  componentName: "ShaderWarp",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    distortion: {
      default: 0.2,
      label: "Distortion",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    proportion: {
      default: 0.5,
      label: "Proportion",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    softness: {
      default: 1,
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
    swirl: {
      default: 0.4,
      label: "Swirl",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-warp",
};
