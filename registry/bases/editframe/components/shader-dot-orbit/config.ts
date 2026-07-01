import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderDotOrbitConfig: ComponentConfig = {
  componentName: "ShaderDotOrbit",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    size: {
      default: 1,
      label: "Size",
      max: 3,
      min: 0.1,
      step: 0.1,
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
    spreading: {
      default: 1,
      label: "Spreading",
      max: 2,
      min: 0,
      step: 0.1,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/shader-dot-orbit",
};
