import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionPillKaraokeConfig: ComponentConfig = {
  componentName: "CaptionPillKaraoke",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    activeColor: { default: "#1a1a1a", label: "Active color", type: "color" },
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    dimColor: { default: "#a6a6a6", label: "Dim color", type: "color" },
    fontSize: {
      default: 60,
      label: "Font size",
      max: 120,
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
    pillColor: { default: "#e7e5e7", label: "Pill color", type: "color" },
    wordsPerSegment: {
      default: 6,
      label: "Words per segment",
      max: 10,
      min: 2,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/pill-karaoke",
};
