import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const heroDeviceAssembleConfig: ComponentConfig = {
  componentName: "HeroDeviceAssemble",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#22c55e",
      label: "Accent color",
      type: "color",
    },
    assembleStart: {
      default: 0,
      label: "Assemble start",
      max: 60,
      min: 0,
      step: 1,
      type: "number",
    },
    device: {
      default: "laptop",
      label: "Device",
      options: ["laptop", "phone"],
      type: "select",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/hero-device-assemble",
};
