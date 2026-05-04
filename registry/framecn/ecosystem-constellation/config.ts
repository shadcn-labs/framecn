import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const ecosystemConstellationConfig: ComponentConfig = {
  componentName: "EcosystemConstellation",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#a855f7",
      label: "Accent color",
      type: "color",
    },
    centerLabel: {
      default: "V",
      label: "Center label",
      type: "text",
    },
    satelliteCount: {
      default: 6,
      label: "Satellite count",
      max: 8,
      min: 3,
      step: 1,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/framecn/ecosystem-constellation",
};
