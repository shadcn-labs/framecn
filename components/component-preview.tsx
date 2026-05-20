"use client";

import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useHotkeys } from "react-hotkeys-hook";

import { ComponentCustomizer } from "@/components/component-customizer";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
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
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import registry from "@/registry/__index__";
import type { BaseName } from "@/registry/bases";

const LoadingComponent = () => (
  <div className="px-1 pt-1 rounded-lg bg-code">
    <Skeleton className="aspect-video rounded-md" />
    <Skeleton className="h-8 my-1.5" />
  </div>
);

const HyperframesPlayer = dynamic(
  async () => {
    const m = await import("@/components/players/hyperframes-player");
    return { default: m.HyperframesPlayer };
  },
  { loading: LoadingComponent, ssr: false }
);

const EditframePlayer = dynamic(
  async () => {
    const m = await import("@/components/players/editframe-player");
    return { default: m.EditframePlayer };
  },
  { loading: LoadingComponent, ssr: false }
);

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

const PreviewShell = ({
  player,
  hideCode,
  code,
  className,
  children,
}: {
  player: React.ReactNode;
  code?: React.ReactNode;
  hideCode: boolean;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={cn("not-prose flex flex-col gap-4", className)}>
    <Tabs defaultValue="preview" className="gap-3">
      {!hideCode && (
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="preview" className="mt-0">
        {player}
      </TabsContent>

      {!hideCode && (
        <TabsContent value="code" className="mt-0">
          {code}
        </TabsContent>
      )}
    </Tabs>
    {children}
  </div>
);

const HyperframesPreview = ({
  name,
  hideCode = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  className?: string;
}) => {
  const entry = registry.hyperframes[name];

  const player = <HyperframesPlayer src={entry.htmlPath} className="w-full" />;

  return (
    <PreviewShell className={className} player={player} hideCode={hideCode}>
      <div className="rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Source code viewer coming soon. The composition source is at{" "}
        <code className="text-foreground">{entry.htmlPath}</code>.
      </div>
    </PreviewShell>
  );
};

const EditframePreview = ({
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
  const { config, Component } = registry.editframe[name];

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

  return (
    <PreviewShell
      hideCode={hideCode}
      className={className}
      player={
        <EditframePlayer
          previewId={previewId}
          Component={Component}
          componentProps={componentProps}
        />
      }
    >
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
              values={values}
              onChange={handleCustomizeChange}
            />
          </div>
        </div>
      )}
    </PreviewShell>
  );
};

export const ComponentPreview = ({
  name,
  base = "editframe",
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  base?: BaseName;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const entry = registry[base][name];

  if (!entry) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Unknown component: <code>{name}</code>
      </div>
    );
  }

  if (base === "hyperframes") {
    return (
      <HyperframesPreview
        name={name}
        hideCode={hideCode}
        className={className}
      />
    );
  }

  return (
    <EditframePreview
      name={name}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
    />
  );
};
