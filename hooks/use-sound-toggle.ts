"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

/** Same key and default as before the sound rewrite, so saved choices carry over. */
export const soundEnabledAtom = atomWithStorage("sound-enabled", false);

export const useSoundEnabled = () => useAtom(soundEnabledAtom);

/** `s` toggles interface sounds; mount once, outside any popover. */
export const useSoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useAtom(soundEnabledAtom);

  const toggleSound = useCallback(
    () => setSoundEnabled(!soundEnabled),
    [soundEnabled, setSoundEnabled]
  );

  useHotkeys(
    "s",
    () => toggleSound(),
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
      preventDefault: true,
    },
    [toggleSound]
  );

  return { soundEnabled, toggleSound };
};
