import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const chatToPreviewLayoutConfig: ComponentConfig = {
  componentName: "ChatToPreviewLayout",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    endChatRatio: {
      default: 0.25,
      label: "End chat ratio",
      max: 0.9,
      min: 0.1,
      step: 0.05,
      type: "number",
    },
    startChatRatio: {
      default: 0.5,
      label: "Start chat ratio",
      max: 0.9,
      min: 0.1,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 150,
  fps: FPS,
  importPath: "@/components/framecn/chat-to-preview-layout",
};
