import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const dataFlowPipesConfig: ComponentConfig = {
  componentName: "DataFlowPipes",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#050505", label: "Background", type: "color" },
    nodeColor: { default: "#0a0a0a", label: "Node color", type: "color" },
    pipeColor: { default: "#1f1f23", label: "Pipe color", type: "color" },
    pulseColor: { default: "#22d3ee", label: "Pulse color", type: "color" },
    pulseDuration: {
      default: 36,
      label: "Pulse duration",
      max: 120,
      min: 8,
      step: 1,
      type: "number",
    },
    pulseLength: {
      default: 60,
      label: "Pulse length",
      max: 200,
      min: 10,
      step: 5,
      type: "number",
    },
    textColor: { default: "#fafafa", label: "Text color", type: "color" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/data-flow-pipes",
};
