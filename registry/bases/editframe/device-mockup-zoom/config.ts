import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const deviceMockupZoomConfig: ComponentConfig = {
  componentName: "DeviceMockupZoom",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#fafafa", label: "Background", type: "color" },
    device: {
      default: "laptop",
      label: "Device",
      options: ["laptop", "phone"],
      type: "select",
    },
    frameColor: { default: "#1f1f1f", label: "Frame color", type: "color" },
    screenColor: { default: "#0a0a0a", label: "Screen color", type: "color" },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/device-mockup-zoom",
};
