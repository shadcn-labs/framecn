import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const terminalSimulatorConfig: ComponentConfig = {
  componentName: "TerminalSimulator",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    charsPerFrame: {
      default: 1,
      label: "Chars / frame",
      max: 6,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    chromeColor: { default: "#1a1a1a", label: "Chrome color", type: "color" },
    chunkSize: {
      default: 1,
      label: "Chunk size",
      max: 20,
      min: 1,
      step: 1,
      type: "number",
    },
    fontSize: {
      default: 18,
      label: "Font size",
      max: 32,
      min: 10,
      step: 1,
      type: "number",
    },
    prompt: { default: "$", label: "Prompt", type: "text" },
    speed: {
      default: 1,
      label: "Speed",
      max: 5,
      min: 0.25,
      step: 0.25,
      type: "number",
    },
    title: { default: "~/projects/remocn", label: "Title", type: "text" },
  },
  durationInFrames: 240,
  fps: FPS,
  importPath: "@/components/remocn/terminal-simulator",
};
