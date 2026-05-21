import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const typewriterConfig: ComponentConfig = {
  componentName: "Typewriter",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    charsPerSecond: {
      default: 20,
      label: "Chars / sec",
      max: 60,
      min: 4,
      step: 1,
      type: "number",
    },
    color: { default: "#171717", label: "Color", type: "color" },
    cursor: { default: true, label: "Show cursor", type: "boolean" },
    cursorColor: { default: "#171717", label: "Cursor color", type: "color" },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 160,
      min: 12,
      step: 1,
      type: "number",
    },
    fontWeight: {
      default: "600",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    text: {
      default: "console.log('hello, world')",
      label: "Text",
      type: "text",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/typewriter",
};
