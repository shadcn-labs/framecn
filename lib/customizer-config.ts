export type BackdropFill =
  | { type: "color"; value: string }
  | { type: "gradient"; value: string }
  | { type: "image"; src: string; fit?: "cover" | "contain" };

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
  /**
   * Skip `SHARED_CONTROLS` for this component, for one that cannot honour
   * `speed` (it names its own rate prop instead).
   */
  omitSharedControls?: boolean;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
  /**
   * Composition size for the current control values, for components whose
   * frame changes with a control (e.g. a `format` select). Defaults to
   * `compositionWidth` × `compositionHeight`.
   */
  compositionSize?: (values: Record<string, unknown>) => {
    height: number;
    width: number;
  };
  /**
   * Composition length in frames for the current control values, for
   * components whose controls are the timing. Defaults to `durationInFrames`.
   */
  compositionDuration?: (values: Record<string, unknown>) => number;
  importPath: string;
  componentName: string;
  snippet?: (values: Record<string, unknown>) => string;
  previewBackdrop?: BackdropFill;
}

/** A composition's frame and length, resolved for the current control values. */
export interface Composition {
  durationInFrames: number;
  height: number;
  width: number;
}

export const resolveComposition = (
  config: ComponentConfig,
  values: Record<string, unknown>
): Composition => {
  const { height, width } = config.compositionSize?.(values) ?? {
    height: config.compositionHeight,
    width: config.compositionWidth,
  };
  return {
    durationInFrames:
      config.compositionDuration?.(values) ?? config.durationInFrames,
    height,
    width,
  };
};

export const FPS = 30;
export const W = 1280;
export const H = 720;
export const FONT_WEIGHT_OPTIONS = ["400", "500", "600", "700"];

export const SHARED_CONTROLS: ControlConfig = {
  speed: {
    default: 1,
    label: "Speed",
    max: 4,
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
