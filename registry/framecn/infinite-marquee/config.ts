import type { ComponentConfig } from "@/lib/customizer-config";
import { FONT_WEIGHT_OPTIONS, FPS, H, W } from "@/lib/customizer-config";

export const infiniteMarqueeConfig: ComponentConfig = {
  componentName: "InfiniteMarquee",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#fafafa", label: "Background", type: "color" },
    color: { default: "#171717", label: "Color", type: "color" },
    fontSize: {
      default: 120,
      label: "Font size",
      max: 240,
      min: 12,
      step: 1,
      type: "number",
    },
    fontWeight: {
      default: "900",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    pixelsPerFrame: {
      default: 4,
      label: "Pixels / frame",
      max: 30,
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
    },
    stroke: { default: false, label: "Stroke", type: "boolean" },
    strokeColor: { default: "#171717", label: "Stroke color", type: "color" },
    text: { default: "ship · build · animate · ", label: "Text", type: "text" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/infinite-marquee",
};
