import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS } from "@/lib/customizer-config";

export const changelogBiteConfig: ComponentConfig = {
  componentName: "ChangelogBite",
  compositionHeight: 1080,
  compositionWidth: 1080,
  controls: {
    accent: { default: "#FFB38E", label: "Accent", type: "color" },
    background: { default: "#141318", label: "Background", type: "color" },
    cardBackground: {
      default: "rgba(20, 19, 24, 0.92)",
      label: "Card background",
      type: "text",
    },
    format: {
      default: "square",
      label: "Format",
      options: ["square", "portrait"],
      type: "select",
    },
    label: { default: "New", label: "Label", type: "text" },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    title: { default: "Inline diff view", label: "Title", type: "text" },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/changelog-bite",
};
