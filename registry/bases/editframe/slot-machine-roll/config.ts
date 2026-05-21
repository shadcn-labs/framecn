import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const slotMachineRollConfig: ComponentConfig = {
  componentName: "SlotMachineRoll",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#ffffff", label: "Background", type: "color" },
    color: { default: "#171717", label: "Text color", type: "color" },
    fontSize: {
      default: 120,
      label: "Font size",
      max: 200,
      min: 24,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: 700,
      label: "Font weight",
      max: 900,
      min: 100,
      step: 100,
      type: "number",
    },
    from: {
      default: "$99",
      label: "From text",
      type: "text",
    },
    to: {
      default: "$199",
      label: "To text",
      type: "text",
    },
  },
  durationInFrames: 45,
  fps: FPS,
  importPath: "@/components/framecn/slot-machine-roll",
};
