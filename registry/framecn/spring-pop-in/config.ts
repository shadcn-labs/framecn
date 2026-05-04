import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const springPopInConfig: ComponentConfig = {
  componentName: "SpringPopIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#ffffff", label: "Background", type: "color" },
    damping: {
      default: 12,
      label: "Damping",
      max: 30,
      min: 1,
      step: 1,
      type: "number",
    },
    delayInFrames: {
      default: 0,
      label: "Delay (frames)",
      max: 60,
      min: 0,
      step: 5,
      type: "number",
    },
    mass: {
      default: 1,
      label: "Mass",
      max: 5,
      min: 0.1,
      step: 0.1,
      type: "number",
    },
    stiffness: {
      default: 100,
      label: "Stiffness",
      max: 300,
      min: 50,
      step: 10,
      type: "number",
    },
  },
  durationInFrames: 45,
  fps: FPS,
  importPath: "@/components/framecn/spring-pop-in",
};
