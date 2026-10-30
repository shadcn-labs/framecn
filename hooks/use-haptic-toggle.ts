"use client";

import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { HapticInput } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

const hapticsEnabledAtom = atomWithStorage("haptics-enabled", false);

export const useHapticsEnabled = () => useAtom(hapticsEnabledAtom);

/** Haptic trigger that no-ops while the user has haptics turned off. */
export const useHaptic = () => {
  const hapticsEnabled = useAtomValue(hapticsEnabledAtom);
  const { trigger } = useWebHaptics();

  return useCallback(
    (input: HapticInput = "light") => {
      if (hapticsEnabled) {
        void trigger(input);
      }
    },
    [hapticsEnabled, trigger]
  );
};

export const useHapticsToggle = () => {
  const [hapticsEnabled, setHapticsEnabled] = useAtom(hapticsEnabledAtom);
  const { trigger: hapticTrigger } = useWebHaptics();

  const toggleHaptics = useCallback(() => {
    setHapticsEnabled(!hapticsEnabled);
    void hapticTrigger("light");
  }, [hapticsEnabled, setHapticsEnabled, hapticTrigger]);

  useHotkeys(
    "h",
    () => toggleHaptics(),
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
      preventDefault: true,
    },
    [toggleHaptics]
  );

  return { hapticsEnabled, toggleHaptics };
};
