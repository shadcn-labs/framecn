import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const morphingModalConfig: ComponentConfig = {
  componentName: "MorphingModal",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    borderRadiusFrom: {
      default: 24,
      label: "Radius from",
      max: 80,
      min: 0,
      step: 1,
      type: "number",
    },
    borderRadiusTo: {
      default: 0,
      label: "Radius to",
      max: 80,
      min: 0,
      step: 1,
      type: "number",
    },
    cardColor: { default: "#0a0a0a", label: "Card color", type: "color" },
    morphAt: {
      default: 30,
      label: "Morph at (frame)",
      max: 240,
      min: 0,
      step: 1,
      type: "number",
    },
    mutedColor: { default: "#71717a", label: "Muted color", type: "color" },
    textColor: { default: "#fafafa", label: "Text color", type: "color" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/morphing-modal",
};
