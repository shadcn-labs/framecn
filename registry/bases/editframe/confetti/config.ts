import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const confettiConfig: ComponentConfig = {
  componentName: "Confetti",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    gravity: {
      default: 0.45,
      label: "Gravity",
      max: 2,
      min: 0,
      step: 0.05,
      type: "number",
    },
    particleCount: {
      default: 80,
      label: "Particle count",
      max: 120,
      min: 10,
      step: 5,
      type: "number",
    },
    power: {
      default: 17,
      label: "Power",
      max: 40,
      min: 1,
      step: 1,
      type: "number",
    },
    seed: {
      default: 1,
      label: "Seed",
      max: 100,
      min: 1,
      step: 1,
      type: "number",
    },
    size: {
      default: 13,
      label: "Particle size",
      max: 30,
      min: 4,
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
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/confetti",
};
