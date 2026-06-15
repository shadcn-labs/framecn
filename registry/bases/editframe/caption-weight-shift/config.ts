import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const captionWeightShiftConfig: ComponentConfig = {
  componentName: "CaptionWeightShift",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    activeColor: {
      default: "#ffffff",
      label: "Active word color",
      type: "color",
    },
    color: { default: "#ffffff", label: "Base color", type: "color" },
    dimColor: {
      default: "rgba(255,255,255,0.35)",
      label: "Dim word color",
      type: "color",
    },
    fontSize: {
      default: 72,
      label: "Font size",
      max: 160,
      min: 24,
      step: 2,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/caption-weight-shift",
};
