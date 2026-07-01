import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const backdropConfig: ComponentConfig = {
  componentName: "Backdrop",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: {
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      label: "Background",
      type: "text",
    },
    padding: {
      default: 10,
      label: "Padding (%)",
      max: 40,
      min: 0,
      step: 1,
      type: "number",
    },
    radius: {
      default: 4,
      label: "Border radius (%)",
      max: 50,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/backdrop",
};
