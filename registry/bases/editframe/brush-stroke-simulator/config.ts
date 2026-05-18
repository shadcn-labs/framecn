import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const brushStrokeSimulatorConfig: ComponentConfig = {
  componentName: "BrushStrokeSimulator",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: {
      default: "#0a0a0a",
      label: "Background",
      type: "color",
    },
    baseColorA: {
      default: "#f4a261",
      label: "Base highlight",
      type: "color",
    },
    baseColorB: {
      default: "#e76f51",
      label: "Base shadow",
      type: "color",
    },
    brushSize: {
      default: 70,
      label: "Brush size",
      max: 200,
      min: 20,
      step: 2,
      type: "number",
    },
    cursorColor: {
      default: "#ffffff",
      label: "Cursor color",
      type: "color",
    },
    overlayColor: {
      default: "#1f1f23",
      label: "Overlay color",
      type: "color",
    },
    startFrame: {
      default: 12,
      label: "Start frame",
      max: 60,
      min: 0,
      step: 1,
      type: "number",
    },
    sweepDuration: {
      default: 150,
      label: "Sweep duration",
      max: 240,
      min: 60,
      step: 5,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/brush-stroke-simulator",
};
