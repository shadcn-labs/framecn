import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const logoEnterConfig: ComponentConfig = {
  componentName: "LogoEnter",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    diameter: {
      default: 118,
      label: "Diameter (px)",
      max: 200,
      min: 40,
      step: 4,
      type: "number",
    },
    orientation: {
      default: "horizontal",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      type: "select",
    },
    overlap: {
      default: 38,
      label: "Overlap (px)",
      max: 80,
      min: 0,
      step: 2,
      type: "number",
    },
    ringColor: { default: "#ffffff", label: "Ring color", type: "color" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    stagger: {
      default: 7,
      label: "Stagger (frames)",
      max: 20,
      min: 1,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/logo-enter",
};
