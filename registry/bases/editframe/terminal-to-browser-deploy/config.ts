import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const terminalToBrowserDeployConfig: ComponentConfig = {
  componentName: "TerminalToBrowserDeploy",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    accentColor: { default: "#22c55e", label: "Accent color", type: "color" },
    siteUrl: {
      default: "https://app.example.com",
      label: "Site URL",
      type: "text",
    },
  },
  durationInFrames: 210,
  fps: FPS,
  importPath: "@/components/framecn/terminal-to-browser-deploy",
};
