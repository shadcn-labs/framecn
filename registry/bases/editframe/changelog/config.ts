import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS } from "@/lib/customizer-config";

export const changelogConfig: ComponentConfig = {
  componentName: "Changelog",
  compositionHeight: 1080,
  compositionWidth: 1920,
  controls: {
    accent: { default: "#FFB38E", label: "Accent color", type: "color" },
    background: { default: "#0d0c10", label: "Background", type: "color" },
    cardBackground: {
      default: "rgba(18,17,22,0.97)",
      label: "Card background",
      type: "text",
    },
    heading: { default: "Changelog", label: "Heading", type: "text" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    tagline: { default: "What's new", label: "Tagline", type: "text" },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/framecn/changelog",
};
