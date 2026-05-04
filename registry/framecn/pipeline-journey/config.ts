import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const pipelineJourneyConfig: ComponentConfig = {
  componentName: "PipelineJourney",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#22c55e",
      label: "Accent color",
      type: "color",
    },
    cardLabel: {
      default: "Build pipeline",
      label: "Card label",
      type: "text",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
    },
  },
  durationInFrames: 200,
  fps: FPS,
  importPath: "@/components/framecn/pipeline-journey",
};
