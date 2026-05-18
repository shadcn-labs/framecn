"use client";

import {
  Controls,
  FitScale,
  Preview,
  Scrubber,
  TimeDisplay,
  ToggleLoop,
  TogglePlay,
} from "@editframe/react";
import {
  CheckIcon,
  LinkIcon,
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useCustomizer } from "@/hooks/use-customizer";
import { useCustomizerTracking } from "@/hooks/use-customizer-tracking";
import { useFeedback } from "@/hooks/use-feedback";
import { usePreviewId } from "@/hooks/use-preview-id";
import type { ComponentConfig } from "@/lib/customizer-config";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import registry from "@/registry/__index__";

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

type RegistryComponent = React.ComponentType<Record<string, unknown>>;

const PreviewControls = ({ previewId }: { previewId: string }) => {
  const controlsRef = useRef<React.ComponentRef<typeof Controls>>(null);
  const [isLooping, setIsLooping] = useState(false);

  const readLoopFromControls = useCallback(() => {
    const el = controlsRef.current;
    setIsLooping(Boolean(el?.loop));
  }, []);

  const reconcileLoopFromControls = useCallback(() => {
    window.setTimeout(() => {
      readLoopFromControls();
    }, 0);
  }, [readLoopFromControls]);

  useEffect(() => {
    let cancelled = false;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          readLoopFromControls();
        }
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [previewId, readLoopFromControls]);

  return (
    <Controls
      ref={controlsRef}
      target={previewId}
      className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground"
    >
      <TogglePlay className="inline-flex">
        <Button
          type="button"
          slot="play"
          variant="ghost"
          size="icon-sm"
          aria-label="Play preview"
          title="Play preview"
        >
          <PlayIcon />
        </Button>
        <Button
          type="button"
          slot="pause"
          variant="ghost"
          size="icon-sm"
          aria-label="Pause preview"
          title="Pause preview"
        >
          <PauseIcon />
        </Button>
      </TogglePlay>

      <Scrubber className="min-w-0 flex-1 [--ef-scrubber-background:var(--border)] [--ef-scrubber-progress-color:var(--foreground)]" />

      <TimeDisplay className="min-w-22 justify-end font-mono text-xs tabular-nums text-foreground" />

      <ToggleLoop className="inline-flex">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isLooping ? "Disable loop" : "Enable loop"}
          aria-pressed={isLooping}
          title={isLooping ? "Loop is on" : "Loop is off"}
          onClick={reconcileLoopFromControls}
        >
          {isLooping ? <Repeat1Icon /> : <RepeatIcon />}
        </Button>
      </ToggleLoop>
    </Controls>
  );
};

const PreviewChrome = ({
  previewId,
  Component,
  componentProps,
}: {
  previewId: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
}) => (
  <div className="overflow-hidden rounded-lg bg-code px-1 pt-1">
    <Preview id={previewId} className="aspect-video">
      <FitScale className="rounded-md">
        <Component {...componentProps} />
      </FitScale>
    </Preview>
    <PreviewControls previewId={previewId} />
  </div>
);

const EditframePreviewInner = ({
  name,
  config,
  Component,
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  config: ComponentConfig;
  Component: RegistryComponent;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const playCopy = useFeedback({ sound: "copy" });
  const playUndo = useFeedback({ sound: "undo" });
  const previewId = usePreviewId(name);

  const { componentProps, isDefault, setValues, values } = useCustomizer(
    name,
    config
  );

  const handleCustomizeChange = useCustomizerTracking(name, setValues);

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

  const previewChrome = (
    <PreviewChrome
      previewId={previewId}
      Component={Component}
      componentProps={componentProps}
    />
  );

  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      {hideCode ? (
        previewChrome
      ) : (
        <Tabs defaultValue="preview" className="gap-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            {previewChrome}
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            {/* {source} */}
          </TabsContent>
        </Tabs>
      )}

      {!hideCustomizer && (
        <div className="rounded-lg bg-code px-1 pb-1">
          <div className="flex items-center justify-between px-2 py-1.5">
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

export const EditframePreview = ({
  name,
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const entry = registry.editframe[name];

  if (!entry) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Unknown component: <code>{name}</code>
      </div>
    );
  }

  return (
    <EditframePreviewInner
      name={name}
      config={entry.config}
      Component={entry.Component}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
    />
  );
};
