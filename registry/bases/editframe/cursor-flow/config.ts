import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const cursorFlowConfig: ComponentConfig = {
  componentName: "CursorFlow",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    cursorColor: { default: "#fafafa", label: "Cursor color", type: "color" },
    cursorSize: {
      default: 28,
      label: "Cursor size",
      max: 64,
      min: 12,
      step: 1,
      type: "number",
    },
    segmentDuration: {
      default: 36,
      label: "Segment duration",
      max: 120,
      min: 8,
      step: 1,
      type: "number",
    },
    showTargets: { default: true, label: "Show targets", type: "boolean" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/cursor-flow",
};
