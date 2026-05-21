export type ControlType =
  | { type: "text"; default: string; label: string }
  | {
      type: "number";
      default: number;
      min: number;
      max: number;
      step: number;
      label: string;
    }
  | { type: "color"; default: string; label: string }
  | { type: "select"; default: string; options: string[]; label: string }
  | { type: "boolean"; default: boolean; label: string };

export type ControlConfig = Record<string, ControlType>;

export interface ComponentConfig {
  controls: ControlConfig;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
  importPath: string;
  componentName: string;
}

export const FPS = 30;
export const W = 1280;
export const H = 720;
export const FONT_WEIGHT_OPTIONS = ["400", "500", "600", "700"];

export const SHARED_CONTROLS: ControlConfig = {
  speed: {
    default: 1,
    label: "Speed",
    max: 3,
    min: 0.25,
    step: 0.25,
    type: "number",
  },
};

export const getDefaults = (
  controls: ControlConfig
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, ctrl] of Object.entries(controls)) {
    out[key] = ctrl.default;
  }
  return out;
};
