import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const swipeTransitionWipeConfig: ComponentConfig = {
  componentName: "SwipeTransitionWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    colorA1: { default: "#0ea5e9", label: "Scene A color 1", type: "color" },
    colorA2: { default: "#1e3a8a", label: "Scene A color 2", type: "color" },
    colorB1: { default: "#f97316", label: "Scene B color 1", type: "color" },
    colorB2: { default: "#9333ea", label: "Scene B color 2", type: "color" },
    dimStrength: {
      default: 0.4,
      label: "Dim strength",
      max: 1,
      min: 0,
      step: 0.1,
      type: "number",
    },
    direction: {
      default: "left",
      label: "Direction",
      options: ["left", "right"],
      type: "select",
    },
    parallaxFactor: {
      default: 0.6,
      label: "Parallax factor",
      max: 1,
      min: 0,
      step: 0.1,
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
    swipeAt: {
      default: 30,
      label: "Swipe start frame",
      max: 60,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/swipe-transition-wipe",
};
