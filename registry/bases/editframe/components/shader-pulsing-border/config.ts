import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderPulsingBorderConfig: ComponentConfig = {
  componentName: "ShaderPulsingBorder",
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
    roundness: {
      default: 0.25,
      label: "Roundness",
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
    thickness: {
      default: 0.1,
      label: "Thickness",
      max: 0.5,
      min: 0.02,
      step: 0.02,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-pulsing-border",
};
