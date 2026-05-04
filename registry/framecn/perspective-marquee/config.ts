import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const perspectiveMarqueeConfig: ComponentConfig = {
  componentName: "PerspectiveMarquee",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    color: { default: "#fafafa", label: "Color", type: "color" },
    fadeColor: { default: "#050505", label: "Fade color", type: "color" },
    fontSize: {
      default: 84,
      label: "Font size",
      max: 200,
      min: 24,
      step: 2,
      type: "number",
    },
    fontWeight: {
      default: "700",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    perspective: {
      default: 1200,
      label: "Perspective",
      max: 3000,
      min: 400,
      step: 50,
      type: "number",
    },
    pixelsPerFrame: {
      default: 2,
      label: "Pixels / frame",
      max: 10,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    rotateX: {
      default: 8,
      label: "Rotate X (deg)",
      max: 30,
      min: -30,
      step: 1,
      type: "number",
    },
    rotateY: {
      default: -28,
      label: "Rotate Y (deg)",
      max: 60,
      min: -60,
      step: 1,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
    },
  },
  durationInFrames: 300,
  fps: FPS,
  importPath: "@/components/framecn/perspective-marquee",
};
