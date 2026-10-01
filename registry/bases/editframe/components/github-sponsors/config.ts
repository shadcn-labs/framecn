import type { ComponentConfig } from "@/lib/customizer-config";
import { H, W, FPS } from "@/lib/customizer-config";

export const githubSponsorsConfig: ComponentConfig = {
  componentName: "GithubSponsors",
  compositionHeight: H,
  compositionWidth: W,
  controls: {},
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/github-sponsors",
};
