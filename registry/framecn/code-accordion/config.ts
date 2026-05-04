import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const codeAccordionConfig: ComponentConfig = {
  componentName: "CodeAccordion",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    cardColor: { default: "#0a0a0a", label: "Card color", type: "color" },
    collapseAt: {
      default: 30,
      label: "Collapse at (frame)",
      max: 240,
      min: 0,
      step: 1,
      type: "number",
    },
    fontSize: {
      default: 16,
      label: "Font size",
      max: 28,
      min: 10,
      step: 1,
      type: "number",
    },
    mutedColor: { default: "#52525b", label: "Muted color", type: "color" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    textColor: { default: "#e4e4e7", label: "Text color", type: "color" },
    title: { default: "process-orders.ts", label: "Title", type: "text" },
    width: {
      default: 720,
      label: "Width",
      max: 1100,
      min: 320,
      step: 10,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/code-accordion",
};
