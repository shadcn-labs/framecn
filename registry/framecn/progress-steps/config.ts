import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const progressStepsConfig: ComponentConfig = {
  componentName: "ProgressSteps",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    activeColor: { default: "#22c55e", label: "Active color", type: "color" },
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    inactiveColor: {
      default: "#27272a",
      label: "Inactive color",
      type: "color",
    },
    orientation: {
      default: "horizontal",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      type: "select",
    },
    stepDuration: {
      default: 30,
      label: "Step duration",
      max: 120,
      min: 4,
      step: 1,
      type: "number",
    },
    textColor: { default: "#ffffff", label: "Text color", type: "color" },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/remocn/progress-steps",
};
