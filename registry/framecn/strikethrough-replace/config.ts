import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const strikethroughReplaceConfig: ComponentConfig = {
  componentName: "StrikethroughReplace",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 48,
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
    from: { default: "Old text", label: "From text", type: "text" },
    lineColor: {
      default: "#ff5e3a",
      label: "Strikethrough color",
      type: "color",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    to: { default: "New text", label: "To text", type: "text" },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/strikethrough-replace",
};
