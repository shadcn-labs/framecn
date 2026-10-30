"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useHaptic } from "@/hooks/use-haptic-toggle";
import { useMetaColor } from "@/hooks/use-meta-color";

export const useThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor, metaColor } = useMetaColor();
  const haptic = useHaptic();

  useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  const toggleTheme = useCallback(() => {
    haptic();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme, haptic]);

  useHotkeys(
    "d",
    () => toggleTheme(),
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
      preventDefault: true,
    },
    [toggleTheme]
  );

  return { toggleTheme };
};
