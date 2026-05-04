import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const pricingTierFocusConfig: ComponentConfig = {
  componentName: "PricingTierFocus",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: {
      default: "#22c55e",
      label: "Accent color",
      type: "color",
    },
    focusedTier: {
      default: "1",
      label: "Focused tier",
      options: ["0", "1", "2"],
      type: "select",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/pricing-tier-focus",
};
