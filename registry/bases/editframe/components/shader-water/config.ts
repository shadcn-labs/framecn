import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderWaterConfig: ComponentConfig = {
  componentName: "ShaderWater",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    caustic: {
      default: 0.08,
      label: "Caustic",
      max: 1,
      min: 0,
      step: 0.02,
      type: "number",
    },
    colorBack: { default: "#16202b", label: "Background", type: "color" },
    highlights: {
      default: 0.06,
      label: "Highlights",
      max: 1,
      min: 0,
      step: 0.02,
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
    waves: {
      default: 0.3,
      label: "Waves",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-water",
};
