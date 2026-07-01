import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const rollingNumberConfig: ComponentConfig = {
  componentName: "RollingNumber",
  compositionHeight: H,
  compositionWidth: W,
  controls: {},
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/rolling-number",
};
