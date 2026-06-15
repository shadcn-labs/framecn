import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS, FONT_WEIGHT_OPTIONS } from "@/lib/customizer-config";

export const captionTextureConfig: ComponentConfig = {
  componentName: "CaptionTexture",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    fontSize: {
      default: 120,
      label: "Font size",
      max: 200,
      min: 40,
      step: 4,
      type: "number",
    },
    fontWeight: {
      default: "700",
      label: "Font weight",
      options: FONT_WEIGHT_OPTIONS,
      type: "select",
    },
    textureFrom: {
      default: "#ff6414",
      label: "Texture color A",
      type: "color",
    },
    textureMid: { default: "#ff2200", label: "Texture color B", type: "color" },
    textureTo: { default: "#ffd000", label: "Texture color C", type: "color" },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/texture",
};
