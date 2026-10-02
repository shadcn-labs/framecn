"use client";

import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
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
import {
  UI_APPEARANCE_CONTROLS,
  UI_COMPONENT_NAMES,
} from "@/lib/ui-customization";
import {
  getUiDemo,
  hasUiDemo,
  pickHonoredProps,
  UI_DEMO_CONTROLS,
} from "@/lib/ui-demo";
import { getPreviewDurationInFrames } from "@/lib/ui-preview-durations";
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

const ComponentPreviewInnerClient = ({
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

  const demo = getUiDemo(name);
  const useDemo = hasUiDemo(name) && demo !== undefined;
  const honored = UI_DEMO_CONTROLS[name];
  const visibleControls = useMemo(() => {
    if (!honored) {
      return config.controls;
    }
    return Object.fromEntries(
      Object.entries(config.controls).filter(
        ([key]) => honored.includes(key) || key in UI_APPEARANCE_CONTROLS
      )
    ) as ComponentConfig["controls"];
  }, [config.controls, honored]);

  const previewComponent = useDemo ? demo.Component : Component;
  const sceneValues = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) =>
        !(
          config.controls[key]?.type === "color" &&
          value === config.controls[key]?.default
        )
    )
  );
  const componentPreviewProps = UI_COMPONENT_NAMES[name]
    ? sceneValues
    : componentProps;
  const previewProps = useDemo
    ? {
        ...pickHonoredProps(name, sceneValues),
        ...Object.fromEntries(
          Object.entries(sceneValues).filter(
            ([key]) => key in UI_APPEARANCE_CONTROLS
          )
        ),
      }
    : componentPreviewProps;
  const previewDuration = useDemo
    ? demo.durationInFrames
    : config.durationInFrames;
  const previewFps = useDemo ? demo.fps : config.fps;
  const previewBackdrop = useDemo
    ? demo.previewBackdrop
    : config.previewBackdrop;

  const videoPreview = (
    <VideoPreview
      previewId={previewId}
      Component={previewComponent}
      componentProps={previewProps}
      appearance={UI_COMPONENT_NAMES[name] ? previewProps : undefined}
      durationInFrames={previewDuration}
      fps={previewFps}
      previewBackdrop={previewBackdrop}
      previewScale={
        UI_COMPONENT_NAMES[name] &&
        !name.endsWith("-flow") &&
        name !== "drawer" &&
        name !== "sheet"
          ? 1.5
          : 1
      }
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

      {!hideCustomizer && Object.keys(visibleControls).length > 0 && (
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
              controls={visibleControls}
              values={values as Record<string, unknown>}
              onChange={handleCustomizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Mount query-dependent controls together: SSR defaults otherwise leave
// native select values and the Reset button out of sync with shared URLs.
const ComponentPreviewInner = dynamic(
  () => Promise.resolve(ComponentPreviewInnerClient),
  { ssr: false }
);

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

  const isUi = UI_COMPONENT_NAMES[name] === true;
  const config = isUi
    ? {
        ...(entry.config ?? {
          componentName: name,
          compositionHeight: 720,
          compositionWidth: 1280,
          controls: {},
          durationInFrames: getPreviewDurationInFrames(name),
          fps: 30,
          importPath: `@/components/framecn/${name}`,
        }),
        controls: { ...entry.config?.controls, ...UI_APPEARANCE_CONTROLS },
      }
    : entry.config;

  if (!config) {
    return (
      <div className={cn("not-prose flex flex-col gap-4", className)}>
        <VideoPreview
          previewId={previewId}
          Component={entry.Component}
          componentProps={{}}
          durationInFrames={getPreviewDurationInFrames(name)}
        />
      </div>
    );
  }

  return (
    <ComponentPreviewInner
      name={name}
      config={config}
      Component={entry.Component}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
    />
  );
};
