import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderGodRaysConfig: ComponentConfig = {
  componentName: "ShaderGodRays",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    bloom: {
      default: 0.4,
      label: "Bloom",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    density: {
      default: 0.3,
      label: "Density",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    intensity: {
      default: 0.8,
      label: "Intensity",
      max: 2,
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
  importPath: "@/components/framecn/shader-god-rays",
};
