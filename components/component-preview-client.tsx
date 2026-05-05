"use client";

import { FitScale, TimelineRoot } from "@editframe/react";
import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
import {
  parseAsBoolean,
  parseAsFloat,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import type { GenericParserBuilder } from "nuqs";
import { useEffect, useMemo, useRef, useState } from "react";

import { ComponentCustomizer } from "@/components/component-customizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDefaults } from "@/lib/customizer-config";
import type { ComponentConfig, ControlConfig } from "@/lib/customizer-config";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

type ParsersMap = Record<string, GenericParserBuilder<unknown>>;
type UrlKeysMap = Record<string, string>;

const buildParsers = (
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

export const ComponentPreviewClient = ({
  name,
  config,
  Component,
  source,
  hideCode = false,
}: {
  name: string;
  config: ComponentConfig;
  // oxlint-disable-next-line typescript/no-explicit-any
  Component: React.ComponentType<any>;
  source: React.ReactNode;
  hideCode?: boolean;
}) => {
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

  // Compose the props passed to the underlying composition component:
  // the customizer-controlled values plus the static composition dimensions
  // and timing from config (so components that accept `width`/`height`/`fps`/
  // `durationInFrames` size themselves to the declared composition).
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

  // Wrap the registry component so TimelineRoot mounts a tree that includes
  // FitScale (so the explicit pixel-sized composition fits the preview box)
  // and the latest customizer props. The wrapped component is recreated when
  // props change so prop updates flow through to the timeline.
  const WrappedComponent = useMemo(() => {
    const W: React.ComponentType<{ id?: string }> = () => (
      <FitScale className="block size-full">
        <Component {...componentProps} />
      </FitScale>
    );
    W.displayName = `Preview(${config.componentName})`;
    return W;
  }, [Component, componentProps, config.componentName]);

  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (typeof window === "undefined") {
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    trackEvent({
      name: "customized_link_shared",
      properties: { component: name },
    });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setValues(null);
    trackEvent({
      name: "customizer_reset",
      properties: { component: name },
    });
  };

  const customizeTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  useEffect(() => {
    const timers = customizeTimers.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);
  const handleCustomizeChange = (key: string, value: unknown) => {
    setValues({ [key]: value } as Partial<Record<string, unknown>>);
    const existing = customizeTimers.current.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    customizeTimers.current.set(
      key,
      setTimeout(() => {
        trackEvent({
          name: "component_customized",
          properties: { component: name, prop: key },
        });
        customizeTimers.current.delete(key);
      }, 500)
    );
  };

  const previewSurface = (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
      <TimelineRoot
        component={WrappedComponent}
        id={`preview-${name}`}
        className="w-[1920px] h-[1080px]"
      />
    </div>
  );

  return (
    <div className="not-prose mb-6 flex w-full flex-col gap-4">
      {hideCode ? (
        previewSurface
      ) : (
        <Tabs defaultValue="preview" className="gap-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            {previewSurface}
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            {source}
          </TabsContent>
        </Tabs>
      )}

      <div className="overflow-hidden rounded-xl bg-muted">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Customize
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy share link"
              title="Copy share link"
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
                "hover:bg-background hover:text-foreground"
              )}
            >
              {copied ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <LinkIcon className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isDefault}
              aria-label="Reset to defaults"
              title="Reset to defaults"
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
                "hover:bg-background hover:text-foreground",
                "disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
              )}
            >
              <RotateCcwIcon className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="px-5 pb-5">
          <ComponentCustomizer
            controls={config.controls}
            values={values as Record<string, unknown>}
            onChange={handleCustomizeChange}
          />
        </div>
      </div>
    </div>
  );
};
