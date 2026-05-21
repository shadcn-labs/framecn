import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const aiGenerationCanvasConfig: ComponentConfig = {
  componentName: "AIGenerationCanvas",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: { default: "#7c3aed", label: "Accent color", type: "color" },
    cardCount: {
      default: 4,
      label: "Card count",
      max: 8,
      min: 1,
      step: 1,
      type: "number",
    },
    prompt: {
      default: "Generate a dashboard",
      label: "Prompt text",
      type: "text",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/ai-generation-canvas",
};
