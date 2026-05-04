import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const spotlightCardConfig: ComponentConfig = {
  componentName: "SpotlightCard",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    cardColor: { default: "#0a0a0a", label: "Card color", type: "color" },
    cardHeight: {
      default: 320,
      label: "Card height",
      max: 600,
      min: 200,
      step: 20,
      type: "number",
    },
    cardWidth: {
      default: 520,
      label: "Card width",
      max: 800,
      min: 300,
      step: 20,
      type: "number",
    },
    glowOpacity: {
      default: 0.08,
      label: "Glow opacity",
      max: 0.3,
      min: 0.02,
      step: 0.02,
      type: "number",
    },
    glowSize: {
      default: 600,
      label: "Glow size",
      max: 1000,
      min: 200,
      step: 50,
      type: "number",
    },
    mutedColor: { default: "#71717a", label: "Muted text", type: "color" },
    textColor: { default: "#fafafa", label: "Text color", type: "color" },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/spotlight-card",
};
