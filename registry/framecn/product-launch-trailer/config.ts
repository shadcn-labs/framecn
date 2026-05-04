import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const productLaunchTrailerConfig: ComponentConfig = {
  componentName: "ProductLaunchTrailer",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentLavender: {
      default: "#D4B3FF",
      label: "Accent lavender",
      type: "color",
    },
    accentMint: { default: "#A1EEBD", label: "Accent mint", type: "color" },
    accentPeach: { default: "#FFB38E", label: "Accent peach", type: "color" },
    background: { default: "#141318", label: "Background", type: "color" },
    logoLabel: { default: "R", label: "Logo label", type: "text" },
    productName: { default: "Remocn", label: "Product name", type: "text" },
    versionLabel: {
      default: "v1.0 is live",
      label: "Version label",
      type: "text",
    },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/remocn/product-launch-trailer",
};
