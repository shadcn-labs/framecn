import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const codeDiffWipeConfig: ComponentConfig = {
  componentName: "CodeDiffWipe",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#0ea5e9", label: "Accent", type: "color" },
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    language: { default: "tsx", label: "Language", type: "text" },
    showHandle: { default: true, label: "Show handle", type: "boolean" },
    transitionDuration: {
      default: 60,
      label: "Transition duration",
      max: 180,
      min: 8,
      step: 1,
      type: "number",
    },
    transitionStart: {
      default: 20,
      label: "Transition start",
      max: 120,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/code-diff-wipe",
};
