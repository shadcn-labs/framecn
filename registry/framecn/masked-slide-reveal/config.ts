import type { ComponentConfig } from "@/lib/customizer-config";
import { FONT_WEIGHT_OPTIONS, FPS, H, W } from "@/lib/customizer-config";

export const maskedSlideRevealConfig: ComponentConfig = {
  componentName: "MaskedSlideReveal",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Color", type: "color" },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 160,
      min: 12,
      step: 1,
      type: "number",
    },
    fontWeight: {
      default: "700",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
    },
    staggerDelay: {
      default: 3,
      label: "Stagger delay",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
    text: { default: "Reveal from the mask", label: "Text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/masked-slide-reveal",
};
