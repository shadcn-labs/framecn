"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  alertDialogStyle,
  alertDialogStyleContext,
} from "@/registry/bases/editframe/ui/alert-dialog";
import type {
  AlertDialogState,
  AlertDialogStyle,
} from "@/registry/bases/editframe/ui/alert-dialog";

export const DEFAULT_DURATION = 12;

export const tweenAlertDialogStyle = (
  a: AlertDialogStyle,
  b: AlertDialogStyle,
  t: number
): AlertDialogStyle => ({
  overlayOpacity: a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
  popupOpacity: a.popupOpacity + (b.popupOpacity - a.popupOpacity) * t,
  popupScale: a.popupScale + (b.popupScale - a.popupScale) * t,
  popupTranslateY:
    a.popupTranslateY + (b.popupTranslateY - a.popupTranslateY) * t,
});

export interface AlertDialogTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useAlertDialogTransition = (
  steps: Step<AlertDialogState>[],
  opts: AlertDialogTransitionOptions = {}
): AlertDialogStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = alertDialogStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenAlertDialogStyle(
    alertDialogStyle(from, ctx),
    alertDialogStyle(to, ctx),
    t
  );
};
