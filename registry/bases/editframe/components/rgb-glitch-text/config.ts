import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const rgbGlitchTextConfig: ComponentConfig = {
  componentName: "RGBGlitchText",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 96,
      label: "Font size",
      max: 200,
      min: 16,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 700,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    glitchAt: {
      default: 20,
      label: "Glitch start frame",
      max: 100,
      min: 0,
      step: 1,
      type: "number",
    },
    glitchDuration: {
      default: 8,
      label: "Glitch duration (frames)",
      max: 30,
      min: 2,
      step: 1,
      type: "number",
    },
    intensity: {
      default: 6,
      label: "Intensity",
      max: 20,
      min: 1,
      step: 1,
      type: "number",
    },
    seed: {
      default: "glitch",
      label: "Seed",
      type: "text",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    text: {
      default: "GLITCH",
      label: "Text",
      type: "text",
    },
  },
  durationInFrames: 60,
  fps: FPS,
  importPath: "@/components/framecn/rgb-glitch-text",
};
