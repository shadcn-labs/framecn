"use client";

import { createContext, useContext, useMemo } from "react";

import { THEME } from "@/lib/video-theme";
import type { Mode } from "@/lib/video-theme";

export interface ThemeColors {
  background: string;
  text: string;
  muted: string;
  subtle: string;
  border: string;
  shadow: string;
}

const defaultColors: ThemeColors = {
  background: THEME.background.light,
  border: THEME.border.light,
  muted: THEME.muted.light,
  shadow: THEME.shadow.light,
  subtle: THEME.subtle.light,
  text: THEME.text.light,
};

const ThemeContext = createContext<ThemeColors>(defaultColors);

export const VideoThemeProvider = ({
  mode = "light",
  children,
}: {
  mode?: Mode;
  children: React.ReactNode;
}) => {
  const colors = useMemo<ThemeColors>(
    () => ({
      background:
        mode === "dark" ? THEME.background.dark : THEME.background.light,
      border: mode === "dark" ? THEME.border.dark : THEME.border.light,
      muted: mode === "dark" ? THEME.muted.dark : THEME.muted.light,
      shadow: mode === "dark" ? THEME.shadow.dark : THEME.shadow.light,
      subtle: mode === "dark" ? THEME.subtle.dark : THEME.subtle.light,
      text: mode === "dark" ? THEME.text.dark : THEME.text.light,
    }),
    [mode]
  );

  return <ThemeContext value={colors}>{children}</ThemeContext>;
};

export const useVideoTheme = (): ThemeColors => useContext(ThemeContext);
