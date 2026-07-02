import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderSmokeRingConfig: ComponentConfig = {
  componentName: "ShaderSmokeRing",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    radius: {
      default: 0.25,
      label: "Radius",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
    scale: {
      default: 0.8,
      label: "Scale",
      max: 2,
      min: 0.3,
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
    thickness: {
      default: 0.65,
      label: "Thickness",
      max: 1.5,
      min: 0.1,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-smoke-ring",
};
