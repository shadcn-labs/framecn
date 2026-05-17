import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const dashboardPopulateConfig: ComponentConfig = {
  componentName: "DashboardPopulate",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#22c55e",
      label: "Accent color",
      type: "color",
    },
    kpiTarget: {
      default: 128_400,
      label: "KPI target",
      max: 1_000_000,
      min: 1000,
      step: 100,
      type: "number",
    },
    speed: {
      default: 1,
      label: "Speed",
      max: 3,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/dashboard-populate",
};
