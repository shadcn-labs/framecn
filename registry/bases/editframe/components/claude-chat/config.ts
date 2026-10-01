import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const claudeChatConfig: ComponentConfig = {
  componentName: "ClaudeChat",
  compositionHeight: H,
  compositionWidth: W,
  controls: {},
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/claude-chat",
};
