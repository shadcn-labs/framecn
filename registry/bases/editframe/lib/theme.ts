"use client";

import { createContext, createElement, useContext } from "react";
import type { ReactNode } from "react";

import { FramecnIconProvider } from "./icons";
import type { IconLibrary } from "./icons";
import { themePresets } from "./theme-presets";
import type { BaseColorName, ThemeName } from "./theme-presets";

export { BASE_COLOR_NAMES, THEME_NAMES } from "./theme-presets";
export type { BaseColorName, ThemeName } from "./theme-presets";

export interface FramecnTheme {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: number;
}

export const defaultLightTheme: FramecnTheme = {
  accent: "oklch(0.97 0 0)",
  accentForeground: "oklch(0.205 0 0)",
  background: "oklch(1 0 0)",
  border: "oklch(0.922 0 0)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.145 0 0)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(0.985 0 0)",
  foreground: "oklch(0.145 0 0)",
  input: "oklch(0.922 0 0)",
  muted: "oklch(0.97 0 0)",
  mutedForeground: "oklch(0.556 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  radius: 10,
  ring: "oklch(0.708 0 0)",
  secondary: "oklch(0.97 0 0)",
  secondaryForeground: "oklch(0.205 0 0)",
};

export const defaultDarkTheme: FramecnTheme = {
  accent: "oklch(0.269 0 0)",
  accentForeground: "oklch(0.985 0 0)",
  background: "oklch(0.145 0 0)",
  border: "oklch(1 0 0 / 10%)",
  card: "oklch(0.205 0 0)",
  cardForeground: "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  destructiveForeground: "oklch(0.985 0 0)",
  foreground: "oklch(0.985 0 0)",
  input: "oklch(1 0 0 / 15%)",
  muted: "oklch(0.269 0 0)",
  mutedForeground: "oklch(0.708 0 0)",
  popover: "oklch(0.205 0 0)",
  popoverForeground: "oklch(0.985 0 0)",
  primary: "oklch(0.922 0 0)",
  primaryForeground: "oklch(0.205 0 0)",
  radius: 10,
  ring: "oklch(0.556 0 0)",
  secondary: "oklch(0.269 0 0)",
  secondaryForeground: "oklch(0.985 0 0)",
};

interface FramecnThemeContextValue {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  baseColor?: BaseColorName;
  themeName?: ThemeName;
}

const FramecnThemeContext = createContext<FramecnThemeContextValue>({});

export interface FramecnUIProviderProps {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  baseColor?: BaseColorName;
  themeName?: ThemeName;
  iconLibrary?: IconLibrary;
  children: ReactNode;
}

export const FramecnUIProvider = ({
  theme,
  mode,
  baseColor,
  themeName,
  iconLibrary = "lucide",
  children,
}: FramecnUIProviderProps) =>
  createElement(
    FramecnThemeContext.Provider,
    { value: { baseColor, mode, theme, themeName } },
    createElement(FramecnIconProvider, { library: iconLibrary }, children)
  );

export const useFramecnMode = (
  fallback: "light" | "dark" = "light"
): "light" | "dark" => useContext(FramecnThemeContext).mode ?? fallback;

export const resolveFramecnTheme = (
  mode: "light" | "dark",
  baseColor: BaseColorName = "neutral",
  themeName: ThemeName = baseColor
): FramecnTheme => ({
  ...(mode === "dark" ? defaultDarkTheme : defaultLightTheme),
  ...themePresets[baseColor][mode],
  ...themePresets[themeName][mode],
});

export const useFramecnTheme = (
  override?: Partial<FramecnTheme>,
  modeOverride?: "light" | "dark"
): FramecnTheme => {
  const ctx = useContext(FramecnThemeContext);
  const mode = ctx.mode ?? modeOverride ?? "light";
  const base = resolveFramecnTheme(mode, ctx.baseColor, ctx.themeName);
  return { ...base, ...ctx.theme, ...override };
};
