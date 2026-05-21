import type { ComponentConfig } from "@/lib/customizer-config";
import { FPS, H, W } from "@/lib/customizer-config";

export const imageExpandToFullscreenConfig: ComponentConfig = {
  componentName: "ImageExpandToFullscreen",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accent: { default: "#fafafa", label: "Accent", type: "color" },
    borderRadiusFrom: {
      default: 12,
      label: "Radius from",
      max: 40,
      min: 0,
      step: 1,
      type: "number",
    },
    borderRadiusTo: {
      default: 16,
      label: "Radius to",
      max: 40,
      min: 0,
      step: 1,
      type: "number",
    },
    editorBackground: {
      default: "#0a0a0a",
      label: "Editor background",
      type: "color",
    },
    feedBackground: {
      default: "#f4f4f5",
      label: "Feed background",
      type: "color",
    },
    imageColorA: { default: "#ff6b6b", label: "Image color A", type: "color" },
    imageColorB: { default: "#845ec2", label: "Image color B", type: "color" },
    imageColorC: { default: "#4d8dff", label: "Image color C", type: "color" },
    morphAt: {
      default: 30,
      label: "Morph at (frame)",
      max: 240,
      min: 0,
      step: 1,
      type: "number",
    },
    postAuthor: {
      default: "Maya Larsson",
      label: "Post author",
      type: "text",
    },
    postBody: {
      default:
        "Sunset over the old harbor — color graded straight out of camera.",
      label: "Post body",
      type: "text",
    },
  },
  durationInFrames: 180,
  fps: FPS,
  importPath: "@/components/framecn/image-expand-to-fullscreen",
};
