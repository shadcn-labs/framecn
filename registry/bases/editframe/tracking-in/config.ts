import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const trackingInConfig: ComponentConfig = {
  componentName: "TrackingIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "white", label: "Background", type: "color" },
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 96,
      label: "Font size",
      max: 200,
      min: 16,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 700,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    startBlur: {
      default: 12,
      label: "Start blur",
      max: 50,
      min: 0,
      step: 1,
      type: "number",
    },
    startTracking: {
      default: 0.5,
      label: "Start tracking",
      max: 2,
      min: -0.1,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/tracking-in",
};
