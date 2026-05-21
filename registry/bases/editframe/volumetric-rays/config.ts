import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const volumetricRaysConfig: ComponentConfig = {
  componentName: "VolumetricRays",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    fontSize: {
      default: 240,
      label: "Font size",
      max: 400,
      min: 48,
      step: 8,
      type: "number",
    },
    fontWeight: {
      default: 800,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    intensity: {
      default: 1,
      label: "Intensity",
      max: 3,
      min: 0.1,
      step: 0.1,
      type: "number",
    },
    rayColor: { default: "#fcd34d", label: "Ray color", type: "color" },
    textColor: { default: "#050505", label: "Text color", type: "color" },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/framecn/volumetric-rays",
};
