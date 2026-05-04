import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const successConfettiConfig: ComponentConfig = {
  componentName: "SuccessConfetti",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#fafafa", label: "Background", type: "color" },
    count: {
      default: 60,
      label: "Particle count",
      max: 200,
      min: 10,
      step: 10,
      type: "number",
    },
    gravity: {
      default: 0.4,
      label: "Gravity",
      max: 2,
      min: 0,
      step: 0.1,
      type: "number",
    },
    seed: { default: "remocn", label: "Random seed", type: "text" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    text: { default: "Merged!", label: "Text", type: "text" },
    textColor: { default: "#171717", label: "Text color", type: "color" },
    velocity: {
      default: 12,
      label: "Particle speed",
      max: 30,
      min: 4,
      step: 2,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/success-confetti",
};
