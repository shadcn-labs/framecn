import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const toolMenuSlideInConfig: ComponentConfig = {
  componentName: "ToolMenuSlideIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#a78bfa", label: "Accent color", type: "color" },
    iconBg: {
      default: "rgba(255,255,255,0.06)",
      label: "Icon background",
      type: "color",
    },
    iconCount: {
      default: 5,
      label: "Icon count",
      max: 8,
      min: 1,
      step: 1,
      type: "number",
    },
    iconStagger: {
      default: 4,
      label: "Icon stagger (frames)",
      max: 15,
      min: 0,
      step: 1,
      type: "number",
    },
    panelColor: {
      default: "rgba(18, 18, 22, 0.72)",
      label: "Panel color",
      type: "color",
    },
    panelStartFrame: {
      default: 18,
      label: "Panel start frame",
      max: 60,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/tool-menu-slide-in",
};
