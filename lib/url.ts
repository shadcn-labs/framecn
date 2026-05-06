import type { GenericParserBuilder } from "nuqs";
import {
  parseAsString,
  parseAsFloat,
  parseAsBoolean,
  parseAsStringLiteral,
} from "nuqs";

import type { ControlConfig } from "./customizer-config";

export const urlToName = (url: string) => url.replace(/(^\w+:|^)\/\//, "");

export const addQueryParams = (
  urlString: string,
  query: Record<string, string>
): string => {
  try {
    const url = new URL(urlString);

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  } catch {
    return urlString;
  }
};

export type ParsersMap = Record<string, GenericParserBuilder<unknown>>;
export type UrlKeysMap = Record<string, string>;

export const buildParsers = (
  name: string,
  controls: ControlConfig
): { parsers: ParsersMap; urlKeys: UrlKeysMap } => {
  const parsers: ParsersMap = {};
  const urlKeys: UrlKeysMap = {};

  for (const [key, ctrl] of Object.entries(controls)) {
    urlKeys[key] = `${name}-${key}`;

    switch (ctrl.type) {
      case "text":
      case "color": {
        parsers[key] = parseAsString.withDefault(
          ctrl.default
        ) as GenericParserBuilder<unknown>;
        break;
      }
      case "number": {
        parsers[key] = parseAsFloat.withDefault(
          ctrl.default
        ) as GenericParserBuilder<unknown>;
        break;
      }
      case "select": {
        parsers[key] = parseAsStringLiteral(ctrl.options).withDefault(
          ctrl.default
        ) as GenericParserBuilder<unknown>;
        break;
      }
      case "boolean": {
        parsers[key] = parseAsBoolean.withDefault(
          ctrl.default
        ) as GenericParserBuilder<unknown>;
        break;
      }
      default: {
        break;
      }
    }
  }

  return { parsers, urlKeys };
};
