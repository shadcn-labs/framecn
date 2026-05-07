"use client";

import { FitScale, TimelineRoot } from "@editframe/react";
import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { ComponentCustomizer } from "@/components/component-customizer";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useFeedback } from "@/hooks/use-feedback";
import { getDefaults } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import { trackEvent } from "@/lib/events";
import { buildParsers } from "@/lib/url";
import { cn } from "@/lib/utils";

const CopyLinkButton = ({
  isCopied,
  ...props
}: React.ComponentProps<typeof Button> & { isCopied: boolean }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-7 rounded-md"
        aria-label="Copy URL"
        title="Copy URL"
        {...props}
      >
        {isCopied ? <CheckIcon className="text-green-500" /> : <LinkIcon />}
      </Button>
    </TooltipTrigger>
    <TooltipContent className="pr-2 pl-3">
      <div className="flex items-center gap-3">
        {isCopied ? "Copied" : "Copy URL"}
        <Kbd>C</Kbd>
      </div>
    </TooltipContent>
  </Tooltip>
);

const ResetButton = ({ ...props }: React.ComponentProps<typeof Button>) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-7 rounded-md"
        aria-label="Reset to defaults"
        title="Reset to defaults"
        {...props}
      >
        <RotateCcwIcon />
      </Button>
    </TooltipTrigger>
    <TooltipContent className="pr-2 pl-3">
      <div className="flex items-center gap-3">
        Reset to defaults
        <Kbd>R</Kbd>
      </div>
    </TooltipContent>
  </Tooltip>
);

export const ComponentPreviewClient = ({
  name,
  config,
  Component,
  source,
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  config: ComponentConfig;
  // oxlint-disable-next-line typescript/no-explicit-any
  Component: React.ComponentType<any>;
  source: React.ReactNode;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const playCopy = useFeedback({ sound: "copy" });
  const playUndo = useFeedback({ sound: "undo" });
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => {
      playCopy();
      trackEvent({
        name: "customized_link_shared",
        properties: { component: name },
      });
    },
    timeout: 1500,
  });

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

  const WrappedComponent = useMemo(() => {
    const W: React.ComponentType<{ id?: string }> = () => (
      <FitScale className="block size-full">
        <Component {...componentProps} />
      </FitScale>
    );
    W.displayName = `Preview(${config.componentName})`;
    return W;
  }, [Component, componentProps, config.componentName]);

  const handleCopyLink = () => {
    copyToClipboard(window.location.href);
  };

  useHotkeys("c", () => handleCopyLink(), {
    enabled: !isCopied,
    preventDefault: true,
  });

  const handleReset = () => {
    playUndo();
    setValues(null);
    trackEvent({
      name: "customizer_reset",
      properties: { component: name },
    });
  };

  useHotkeys("r", () => handleReset(), {
    enabled: !isDefault,
    preventDefault: true,
  });

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

  // const previewSurface = (
  //   <Configuration signingURL="/api/sign-token">
  //     <TimelineRoot component={WrappedComponent} id={`preview-${name}`} />
  //   </Configuration>
  // );

  const previewSurface = (
    <div className="aspect-video w-full h-full overflow-hidden rounded-lg border">
      <TimelineRoot
        component={WrappedComponent}
        id={`preview-${name}`}
        className="w-[1920px] h-[1080px]"
      />
    </div>
  );

  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
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

      {!hideCustomizer && (
        <div className="rounded-lg bg-code px-1 pb-1">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              Customize
            </span>
            <div className="flex items-center gap-1">
              <CopyLinkButton isCopied={isCopied} onClick={handleCopyLink} />
              <ResetButton disabled={isDefault} onClick={handleReset} />
            </div>
          </div>
          <div className="rounded-md p-4 bg-background">
            <ComponentCustomizer
              controls={config.controls}
              values={values as Record<string, unknown>}
              onChange={handleCustomizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
