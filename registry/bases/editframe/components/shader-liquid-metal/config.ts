import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderLiquidMetalConfig: ComponentConfig = {
  componentName: "ShaderLiquidMetal",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#2a2a30", label: "Background", type: "color" },
    colorTint: { default: "#8a8a95", label: "Tint", type: "color" },
    contour: {
      default: 0.4,
      label: "Contour",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    distortion: {
      default: 0.1,
      label: "Distortion",
      max: 0.5,
      min: 0,
      step: 0.01,
      type: "number",
    },
    repetition: {
      default: 1.5,
      label: "Repetition",
      max: 6,
      min: 1,
      step: 0.5,
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
  importPath: "@/components/framecn/shader-liquid-metal",
};
