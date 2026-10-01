import { useTheme } from "next-themes";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";

import { getDefaults } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { buildParsers } from "@/lib/url";
import { resolved, THEME } from "@/lib/video-theme";
import type { Mode } from "@/lib/video-theme";

export type QueryStatesSetter = (
  value: Partial<Record<string, unknown>> | null
) => unknown;

export const useCustomizer = (
  name: string,
  config: ComponentConfig
): {
  componentProps: Record<string, unknown>;
  isDefault: boolean;
  setValues: QueryStatesSetter;
  values: Record<string, unknown>;
} => {
  const { resolvedTheme } = useTheme();
  const { parsers, urlKeys } = useMemo(
    () => buildParsers(name, config.controls),
    [name, config.controls]
  );

  const defaults = useMemo(
    () => getDefaults(config.controls),
    [config.controls]
  );

  const [values, setValues] = useQueryStates(parsers, {
    clearOnDefault: true,
    shallow: true,
    urlKeys,
  });

  const isDefault = useMemo(
    () => Object.entries(defaults).every(([k, v]) => values[k] === v),
    [defaults, values]
  );

  const componentProps = useMemo(() => {
    const mode: Mode = resolvedTheme === "dark" ? "dark" : "light";

    // If the user hasn't changed background from its config default, use the theme
    const bgDefault = config.controls.background?.default;
    const bgFromUrl =
      values.background === bgDefault ? undefined : values.background;
    const background =
      bgFromUrl ??
      resolved(mode, THEME.background.light, THEME.background.dark);

    const color =
      values.color ?? resolved(mode, THEME.text.light, THEME.text.dark);

    return {
      ...values,
      background,
      color,
      durationInFrames: config.durationInFrames,
      fps: config.fps,
      height: config.compositionHeight,
      width: config.compositionWidth,
    };
  }, [values, config, resolvedTheme]);

  return {
    componentProps,
    isDefault,
    setValues: setValues as QueryStatesSetter,
    values: values as Record<string, unknown>,
  };
};
