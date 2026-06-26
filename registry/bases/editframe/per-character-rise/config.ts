import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const perCharacterRiseConfig: ComponentConfig = {
  componentName: "PerCharacterRise",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
    distance: {
      default: 32,
      label: "Distance (px)",
      max: 80,
      min: 10,
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
    text: { default: "Rise up letters", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/per-character-rise",
};
