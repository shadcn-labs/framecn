type ControlConfig =
  | {
      default: string;
      label: string;
      type: "color";
    }
  | {
      default: number;
      label: string;
      max?: number;
      min?: number;
      step?: number;
      type: "number";
    };

export interface ComponentConfig {
  componentName: string;
  compositionHeight: number;
  compositionWidth: number;
  controls: Record<string, ControlConfig>;
  durationInFrames: number;
  fps: number;
  importPath: string;
}

export const FPS = 30;
export const W = 1000;
export const H = 500;

export const animatedBarChartConfig: ComponentConfig = {
  componentName: "AnimatedBarChart",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    background: { default: "#0a0a0a", label: "Background", type: "color" },
    barColor: { default: "#0ea5e9", label: "Bar color", type: "color" },
    gap: {
      default: 16,
      label: "Gap",
      max: 80,
      min: 0,
      step: 2,
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
    staggerFrames: {
      default: 6,
      label: "Stagger frames",
      max: 30,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/animated-bar-chart",
};
