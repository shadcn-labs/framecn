"use client";

import { useEffect } from "react";

import { useHaptic } from "@/hooks/use-haptic-toggle";

// Actionable elements only: a bare `[data-slot]` also matches layout wrappers (cards, frames).
const INTERACTIVE =
  'button, a[href], [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], [role="option"], [role^="menuitem"], input[type="checkbox"], input[type="radio"]';

const TEXT_ENTRY =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable]';

const SELECTION =
  '[aria-pressed], [aria-checked], [role="tab"], [role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], input[type="checkbox"], input[type="radio"]';

/** Buzzes on presses of interactive elements while haptics are enabled. */
export const HapticEffects = () => {
  const haptic = useHaptic();

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) {
        return;
      }
      const target = event.target.closest("label")?.control ?? event.target;
      if (target.closest(TEXT_ENTRY)) {
        return;
      }
      const el = target.closest(INTERACTIVE);
      if (
        !el ||
        el.matches(':disabled, [aria-disabled="true"], [data-disabled]')
      ) {
        return;
      }
      haptic(el.matches(SELECTION) ? "selection" : "light");
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [haptic]);

  return null;
};
