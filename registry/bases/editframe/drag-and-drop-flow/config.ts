import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const dragAndDropFlowConfig: ComponentConfig = {
  componentName: "DragAndDropFlow",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#0ea5e9", label: "Accent", type: "color" },
    background: { default: "#fafafa", label: "Background", type: "color" },
    dropzoneLabel: {
      default: "Drop file to upload",
      label: "Dropzone label",
      type: "text",
    },
    fileName: { default: "design.fig", label: "File name", type: "text" },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/drag-and-drop-flow",
};
