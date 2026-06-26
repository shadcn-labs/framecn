import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const springScaleInConfig: ComponentConfig = {
  componentName: "SpringScaleIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
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
    scaleFrom: {
      default: 0.7,
      label: "Scale from",
      max: 0.99,
      min: 0.3,
      step: 0.01,
      type: "number",
    },
    staggerDelay: {
      default: 3,
      label: "Stagger delay (frames)",
      max: 10,
      min: 1,
      step: 1,
      type: "number",
    },
    text: { default: "Spring scale in", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/spring-scale-in",
};
