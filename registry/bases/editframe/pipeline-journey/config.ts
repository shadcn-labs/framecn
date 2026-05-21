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
  },
  durationInFrames: 200,
  fps: FPS,
  importPath: "@/components/framecn/pipeline-journey",
};
