import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const aiGenerateOverlayConfig: ComponentConfig = {
  componentName: "AIGenerateOverlay",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#a78bfa", label: "Accent color", type: "color" },
    background: { default: "#050505", label: "Background", type: "color" },
    blurPeakFrame: {
      default: 40,
      label: "Blur peak frame",
      max: 100,
      min: 0,
      step: 1,
      type: "number",
    },
    blurStartFrame: {
      default: 20,
      label: "Blur start frame",
      max: 100,
      min: 0,
      step: 1,
      type: "number",
    },
    maxBlur: {
      default: 20,
      label: "Max blur",
      max: 50,
      min: 0,
      step: 1,
      type: "number",
    },
    revealStartFrame: {
      default: 110,
      label: "Reveal start frame",
      max: 200,
      min: 0,
      step: 1,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/ai-generate-overlay",
};
