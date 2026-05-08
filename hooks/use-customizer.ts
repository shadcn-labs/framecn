import { useQueryStates } from "nuqs";
import { useMemo } from "react";

import { getDefaults } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { buildParsers } from "@/lib/url";

type QueryStatesSetter = (
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

  const componentProps = useMemo(
    () => ({
      ...values,
      durationInFrames: config.durationInFrames,
      fps: config.fps,
      height: config.compositionHeight,
      width: config.compositionWidth,
    }),
    [values, config]
  );

  return {
    componentProps,
    isDefault,
    setValues: setValues as QueryStatesSetter,
    values: values as Record<string, unknown>,
  };
};
