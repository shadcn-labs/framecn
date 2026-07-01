import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS } from "@/lib/customizer-config";

export const landingCodeShowcaseConfig: ComponentConfig = {
  componentName: "LandingCodeShowcase",
  compositionHeight: 900,
  compositionWidth: 2080,
  controls: {
    accentColor: {
      default: "#FFB38E",
      label: "Accent color",
      type: "color",
    },
  },
  durationInFrames: 720,
  fps: FPS,
  importPath: "@/components/framecn/landing-code-showcase",
};
