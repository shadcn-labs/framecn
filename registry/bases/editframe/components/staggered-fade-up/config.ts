import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const staggeredFadeUpConfig: ComponentConfig = {
  componentName: "StaggeredFadeUp",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
    distance: {
      default: 20,
      label: "Fade distance (px)",
      max: 100,
      min: 0,
      step: 2,
      type: "number",
    },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 200,
      min: 24,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 600,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
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
    staggerDelay: {
      default: 4,
      label: "Stagger delay (frames)",
      max: 20,
      min: 0,
      step: 1,
      type: "number",
    },
    text: { default: "Staggered fade up text", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/staggered-fade-up",
};
