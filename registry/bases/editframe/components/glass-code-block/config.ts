import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const glassCodeBlockConfig: ComponentConfig = {
  componentName: "GlassCodeBlock",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    fontSize: {
      default: 16,
      label: "Font size",
      max: 28,
      min: 10,
      step: 1,
      type: "number",
    },
    glassColor: {
      default: "rgba(10, 10, 10, 0.6)",
      label: "Glass color",
      type: "text",
    },
    height: {
      default: 460,
      label: "Height",
      max: 700,
      min: 200,
      step: 10,
      type: "number",
    },
    showTrafficLights: {
      default: true,
      label: "Traffic lights",
      type: "boolean",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    staggerFrames: {
      default: 4,
      label: "Stagger frames",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
    title: { default: "hero.tsx", label: "Title", type: "text" },
    width: {
      default: 760,
      label: "Width",
      max: 1100,
      min: 300,
      step: 10,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/glass-code-block",
};
