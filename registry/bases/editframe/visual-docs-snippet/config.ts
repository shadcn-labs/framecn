import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const visualDocsSnippetConfig: ComponentConfig = {
  componentName: "VisualDocsSnippet",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#FFB38E", label: "Accent color", type: "color" },
    background: { default: "#141318", label: "Background", type: "color" },
    clickFrame: {
      default: 110,
      label: "Click frame",
      max: 300,
      min: 30,
      step: 5,
      type: "number",
    },
  },
  durationInFrames: 300,
  fps: FPS,
  importPath: "@/components/framecn/visual-docs-snippet",
};
