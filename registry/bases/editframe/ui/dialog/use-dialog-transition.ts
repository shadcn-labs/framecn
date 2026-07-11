"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  dialogStyle,
  dialogStyleContext,
} from "@/registry/bases/editframe/ui/dialog";
import type {
  DialogState,
  DialogStyle,
} from "@/registry/bases/editframe/ui/dialog";

export const DEFAULT_DURATION = 12;

export const tweenDialogStyle = (
  a: DialogStyle,
  b: DialogStyle,
  t: number
): DialogStyle => ({
  overlayOpacity: a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
  popupOpacity: a.popupOpacity + (b.popupOpacity - a.popupOpacity) * t,
  popupScale: a.popupScale + (b.popupScale - a.popupScale) * t,
  popupTranslateY:
    a.popupTranslateY + (b.popupTranslateY - a.popupTranslateY) * t,
});

export interface DialogTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useDialogTransition = (
  steps: Step<DialogState>[],
  opts: DialogTransitionOptions = {}
): DialogStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = dialogStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenDialogStyle(dialogStyle(from, ctx), dialogStyle(to, ctx), t);
};
