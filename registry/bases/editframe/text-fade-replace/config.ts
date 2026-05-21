import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const textFadeReplaceConfig: ComponentConfig = {
  componentName: "TextFadeReplace",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 48,
      label: "Font size",
      max: 120,
      min: 16,
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
    from: {
      default: "Hello",
      label: "From text",
      type: "text",
    },
    to: {
      default: "World",
      label: "To text",
      type: "text",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/text-fade-replace",
};
