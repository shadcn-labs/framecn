"use client";

import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
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
import { VideoPreview } from "@/components/video-preview";
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

const ComponentPreviewInner = ({
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

  const videoPreview = (
    <VideoPreview
      previewId={previewId}
      Component={Component}
      componentProps={componentProps}
    />
  );

  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      {hideCode ? (
        videoPreview
      ) : (
        <Tabs defaultValue="preview" className="gap-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            {videoPreview}
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

export const ComponentPreview = ({
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
  const entry = registry[name];
  const previewId = usePreviewId(name);

  if (!entry) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Unknown component: <code>{name}</code>
      </div>
    );
  }

  if (!entry.config) {
    return (
      <div className={cn("not-prose flex flex-col gap-4", className)}>
        <VideoPreview
          previewId={previewId}
          Component={entry.Component}
          componentProps={{}}
        />
      </div>
    );
  }

  return (
    <ComponentPreviewInner
      name={name}
      config={entry.config}
      Component={entry.Component}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
    />
  );
};
