import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const staggeredBentoGridConfig: ComponentConfig = {
  componentName: "StaggeredBentoGrid",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    cardColor: { default: "#1a1a1a", label: "Card color", type: "color" },
    columns: {
      default: 3,
      label: "Columns",
      max: 6,
      min: 1,
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
    staggerDelay: {
      default: 8,
      label: "Stagger delay (frames)",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
    textColor: { default: "white", label: "Text color", type: "color" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/staggered-bento-grid",
};
