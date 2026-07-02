import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const shaderMetaballsConfig: ComponentConfig = {
  componentName: "ShaderMetaballs",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorBack: { default: "#12121a", label: "Background", type: "color" },
    count: {
      default: 10,
      label: "Count",
      max: 20,
      min: 1,
      step: 1,
      type: "number",
    },
    size: {
      default: 0.83,
      label: "Size",
      max: 1.5,
      min: 0.2,
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
  importPath: "@/components/framecn/shader-metaballs",
};
