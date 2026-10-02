export type { Step } from "./types";
export {
  clamp01,
  framesFor,
  revealCount,
  revealedText,
  useTypewriter,
} from "./timeline";
export type { TypewriterOptions, TypewriterState } from "./timeline";
export { mixOklch, oklchToRgb, parseColor, rgbToOklch, toCss } from "./color";
export {
  defaultDarkTheme,
  defaultLightTheme,
  FramecnUIProvider,
  useFramecnTheme,
  useFramecnMode,
  resolveFramecnTheme,
  BASE_COLOR_NAMES,
  THEME_NAMES,
} from "./theme";
export type { FramecnTheme, FramecnUIProviderProps } from "./theme";
export { easings, springs } from "./motion";
export type { EasingName, SpringName } from "./motion";
export { FramecnIcon, ICON_LIBRARIES } from "./icons";
export type { FramecnIconName, FramecnIconProps, IconLibrary } from "./icons";
export type { BaseColorName, ThemeName } from "./theme";
