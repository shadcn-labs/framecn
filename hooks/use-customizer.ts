import { useTheme } from "next-themes";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";

import { getDefaults, resolveComposition } from "@/lib/customizer-config";
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

    // Explicit composition colors belong to the video, not the surrounding UI theme.
    const background =
      values.background ??
      resolved(mode, THEME.background.light, THEME.background.dark);

    const color =
      values.color ?? resolved(mode, THEME.text.light, THEME.text.dark);

    // The resolved frame and length: components with a `format` control or
    // timing controls read them from these props.
    const { durationInFrames, height, width } = resolveComposition(
      config,
      values as Record<string, unknown>
    );

    return {
      ...values,
      background,
      color,
      durationInFrames,
      fps: config.fps,
      height,
      width,
    };
  }, [values, config, resolvedTheme]);

  return {
    componentProps,
    isDefault,
    setValues: setValues as QueryStatesSetter,
    values: values as Record<string, unknown>,
  };
};
