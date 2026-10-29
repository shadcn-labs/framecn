"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  LockKeyholeIcon,
  PlugIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ApiKeyField } from "@/components/api-key-field";
import { CodeBlockCommand } from "@/components/code-block-command";
import { ComponentCustomizer } from "@/components/component-customizer";
import { PANEL_EXIT_MS, usePanel } from "@/components/component-panel-shell";
import { CopyButton } from "@/components/copy-button";
import {
  ChatGptIcon,
  ClaudeIcon,
  CursorIcon,
  MarkdownDocIcon,
  V0Icon,
} from "@/components/icons";
import { ProUnlockDialog } from "@/components/pro-unlock-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Frame, FrameContent, FrameHeader } from "@/components/ui/frame";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VideoPreview } from "@/components/video-preview";
import { SITE } from "@/constants/site";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useCustomizer } from "@/hooks/use-customizer";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePreviewId } from "@/hooks/use-preview-id";
import { CATALOG, CATEGORY_LABELS, catalogItemHref } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import { componentPrompt } from "@/lib/component-prompt";
import type { ComponentConfig } from "@/lib/customizer-config";
import {
  PRO_API_KEY_ENV,
  PRO_REGISTRY_NAMESPACE,
  proRegistryConfig,
} from "@/lib/pro-install";
import { cn } from "@/lib/utils";
import registry from "@/registry/__index__";

const ENTER_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const EXIT_EASING = "cubic-bezier(0.4, 0, 0.8, 0.2)";
const ENTER_MS = 360;
const EXIT_MS = PANEL_EXIT_MS - 20;

const installCommands = (target: string) => ({
  __bun__: `bunx --bun shadcn@latest add ${target}`,
  __npm__: `npx shadcn@latest add ${target}`,
  __pnpm__: `pnpm dlx shadcn@latest add ${target}`,
  __yarn__: `yarn dlx shadcn@latest add ${target}`,
});

const EMPTY_CONFIG: ComponentConfig = {
  componentName: "",
  compositionHeight: 720,
  compositionWidth: 1280,
  controls: {},
  durationInFrames: 1,
  fps: 30,
  importPath: "",
};

/** The gallery card preview this panel morphs from/to, if it is on screen. */
const findCardPreview = (id: string) =>
  document.querySelector<HTMLElement>(
    `[data-catalog-gallery] [data-catalog-preview="${id}"]`
  );

/** FLIP transform that makes `target` appear at `source`'s box. */
const flipFrom = (source: DOMRect, target: DOMRect) =>
  `translate(${source.left - target.left}px, ${source.top - target.top}px) scale(${source.width / target.width}, ${source.height / target.height})`;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Description = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (element && !expanded) {
      setOverflowing(element.scrollHeight > element.clientHeight + 1);
    }
  }, [text, expanded]);
  return (
    <div className="relative">
      <p
        ref={ref}
        className={cn(
          "text-muted-foreground text-sm leading-6",
          !expanded && "line-clamp-4"
        )}
      >
        {text}
      </p>
      {overflowing && !expanded && (
        <div
          aria-hidden
          className="from-card pointer-events-none absolute inset-x-0 bottom-6 h-10 bg-gradient-to-t to-transparent"
        />
      )}
      {overflowing && (
        <Button
          variant="link"
          size="sm"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="text-foreground mt-1 h-auto p-0 text-xs"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};

/** Primary prompt copy plus agent-specific destinations. */
const PromptButton = ({
  item,
  prompt,
}: {
  item: CatalogItem;
  prompt: string;
}) => {
  const { copyToClipboard } = useCopyToClipboard();
  const encoded = encodeURIComponent(prompt);
  const destinations = [
    {
      href: `https://cursor.com/link/prompt?text=${encoded}`,
      icon: <CursorIcon />,
      label: "Open in Cursor",
    },
    {
      href: `https://claude.ai/new?q=${encoded}`,
      icon: <ClaudeIcon />,
      label: "Open in Claude",
    },
    {
      href: `https://chatgpt.com/?q=${encoded}`,
      icon: <ChatGptIcon />,
      label: "Open in ChatGPT",
    },
    {
      href: `https://v0.dev/chat?q=${encoded}`,
      icon: <V0Icon />,
      label: "Open in v0",
    },
  ];
  const mcpPrompt = `Use the shadcn MCP server to add ${item.pro ? PRO_REGISTRY_NAMESPACE : SITE.REGISTRY}/${item.id} to this project, then follow its usage notes.`;
  return (
    <div className="flex">
      <CopyButton
        value={prompt}
        variant="default"
        size="sm"
        showTooltip={false}
        className="h-8 rounded-r-none"
      >
        Copy prompt
      </CopyButton>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="sm"
              aria-label="More prompt options"
              className="border-primary-foreground/20 h-8 rounded-l-none border-l px-2"
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {destinations.map((destination) => (
            <DropdownMenuItem
              key={destination.label}
              render={
                // oxlint-disable-next-line jsx-a11y/anchor-has-content -- render template; content comes from the item.
                <a
                  href={destination.href}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              {destination.icon}
              {destination.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => copyToClipboard(mcpPrompt)}>
            <PlugIcon />
            Copy MCP prompt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

/** Blurred placeholder shown instead of Pro content, with an unlock CTA. */
const LockedCode = ({
  onUnlock,
  title = "Source code is part of Pro",
  description = "Get Pro to copy the code, install it with the CLI and use it in your projects.",
  lines = [72, 88, 56, 94, 40, 80, 64, 90, 48],
}: {
  onUnlock: () => void;
  title?: string;
  description?: string;
  lines?: number[];
}) => (
  <Frame>
    {/* min-h keeps the unlock overlay from clipping when there are only a few placeholder lines. */}
    <FrameContent className="relative min-h-48 overflow-hidden">
      <div aria-hidden className="space-y-2.5 p-4 blur-[3px]">
        {lines.map((width, index) => (
          <div
            key={index}
            className="bg-muted-foreground/15 h-2.5 rounded-full"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      <div className="bg-card/60 absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="bg-brand/15 text-brand flex size-9 items-center justify-center rounded-full">
          <LockKeyholeIcon className="size-4" />
        </span>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground max-w-60 text-xs leading-5">
          {description}
        </p>
        <Button
          size="sm"
          variant="gradient"
          className="mt-1 rounded-full"
          onClick={onUnlock}
        >
          Unlock with Pro
        </Button>
      </div>
    </FrameContent>
  </Frame>
);

/** The same doc sections free components show (Usage, API Reference, Notes), each locked behind Pro. */
const LOCKED_DOCS = [
  {
    description: "Import, render and compose it in your Editframe timeline.",
    lines: [64, 88, 40, 72],
    lockedTitle: "Usage is part of Pro",
    title: "Usage",
  },
  {
    description: "Every prop, its type and default value.",
    lines: [80, 60, 92, 52, 76, 68, 84],
    lockedTitle: "The API reference is part of Pro",
    title: "API Reference",
  },
  {
    description: "Timing, sizing and rendering tips from the author.",
    lines: [90, 70, 56, 82],
    lockedTitle: "Notes are part of Pro",
    title: "Notes",
  },
];

const LockedDocs = ({ onUnlock }: { onUnlock: () => void }) => (
  <>
    {LOCKED_DOCS.map((section) => (
      <section key={section.title} className="mt-10">
        <h2 className="font-heading mb-4 text-lg font-medium tracking-tight">
          {section.title}
        </h2>
        <LockedCode
          onUnlock={onUnlock}
          title={section.lockedTitle}
          description={section.description}
          lines={section.lines}
        />
      </section>
    ))}
  </>
);

/** Install via the CLI (Command) or copy the source by hand (Manual); Pro source stays locked without access. */
const Installation = ({
  item,
  canAccess,
  source,
  onUnlock,
}: {
  item: CatalogItem;
  canAccess: boolean;
  source: React.ReactNode;
  onUnlock: () => void;
}) => (
  <section className="mt-10">
    <h2 className="font-heading text-lg font-medium tracking-tight">
      Installation
    </h2>
    <Tabs defaultValue="command" className="mt-4 gap-4">
      <TabsList>
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="command" className="space-y-3 text-xs leading-5">
        {item.pro && canAccess && (
          <>
            <ApiKeyField />
            <p className="text-muted-foreground">
              Add <code className="font-mono">{PRO_API_KEY_ENV}</code> to your{" "}
              <code className="font-mono">.env</code>, then register the Pro
              registry in <code className="font-mono">components.json</code>:
            </p>
            <Frame>
              <FrameHeader>
                components.json
                <CopyButton
                  value={proRegistryConfig(SITE.URL)}
                  tooltip="Copy registry config"
                  className="static ml-auto size-7 bg-transparent"
                />
              </FrameHeader>
              <FrameContent>
                <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-5">
                  {proRegistryConfig(SITE.URL)}
                </pre>
              </FrameContent>
            </Frame>
          </>
        )}
        <CodeBlockCommand
          {...installCommands(
            `${item.pro ? PRO_REGISTRY_NAMESPACE : SITE.REGISTRY}/${item.id}`
          )}
        />
        {item.pro && !canAccess && (
          <p className="text-muted-foreground">
            Requires framecn Pro and a personal API key.
          </p>
        )}
      </TabsContent>
      <TabsContent value="manual" className="space-y-3 text-xs leading-5">
        <p className="text-muted-foreground">Install the dependency:</p>
        <CodeBlockCommand
          __bun__="bun add @editframe/react"
          __npm__="npm install @editframe/react"
          __pnpm__="pnpm add @editframe/react"
          __yarn__="yarn add @editframe/react"
        />
        <p className="text-muted-foreground">
          Copy the source into your project and update the import paths:
        </p>
        {canAccess ? (
          <div className="[&_figure]:my-0">{source}</div>
        ) : (
          <LockedCode onUnlock={onUnlock} />
        )}
      </TabsContent>
    </Tabs>
  </section>
);

interface NavTooltipPayload {
  label: string;
  shortcut?: React.ReactNode;
}

/**
 * One tooltip popup shared by every header action: hovering across the buttons moves the same popup
 * (Base UI detached triggers) instead of closing one tooltip and animating in another.
 */
const navTooltip = createTooltipHandle<NavTooltipPayload>();

/** Header action button bound to the shared header tooltip; stays hoverable when disabled. */
const NavTooltipButton = ({
  label,
  shortcut,
  ...props
}: React.ComponentProps<typeof Button> & NavTooltipPayload) => (
  <TooltipTrigger
    handle={navTooltip}
    payload={{ label, shortcut }}
    render={
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-8"
        aria-label={label}
        focusableWhenDisabled
        {...props}
      />
    }
  />
);

/** Neighbours of `item` in catalog order. */
const getSiblings = (item: CatalogItem) => {
  const index = CATALOG.findIndex((entry) => entry.id === item.id);
  return {
    next: index === -1 ? undefined : CATALOG[index + 1],
    previous: index > 0 ? CATALOG[index - 1] : undefined,
  };
};

export const ComponentDetail = ({
  item,
  canAccess,
  source,
  docs,
}: {
  item: CatalogItem;
  canAccess: boolean;
  source: React.ReactNode;
  docs: React.ReactNode;
}) => {
  const router = useRouter();
  const { close, phase, claimEnter } = usePanel();
  const isMobile = useIsMobile();
  const titleId = useId();
  const asideRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [customizing, setCustomizing] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const config = registry[item.id]?.config as ComponentConfig | undefined;
  const { componentProps, values, setValues, isDefault } = useCustomizer(
    item.id,
    config ?? EMPTY_CONFIG
  );
  const previewId = usePreviewId(item.id);
  const { previous, next } = getSiblings(item);

  const go = useCallback(
    (target?: CatalogItem) =>
      target && router.replace(catalogItemHref(target), { scroll: false }),
    [router]
  );

  // Hide the gallery card while its preview lives in the panel, so the morph reads as one object.
  useEffect(() => {
    const card = isMobile ? null : findCardPreview(item.id);
    if (!card) {
      return;
    }
    card.style.visibility = "hidden";
    return () => {
      card.style.visibility = "";
    };
  }, [isMobile, item.id]);

  // Enter: once per opening (claimEnter), slide the panel out of the sidebar edge and morph the card preview.
  useLayoutEffect(() => {
    if (!claimEnter() || prefersReducedMotion()) {
      return;
    }
    const timing = { duration: ENTER_MS, easing: ENTER_EASING };
    asideRef.current?.animate(
      [{ transform: "translateX(-100%)" }, { transform: "none" }],
      timing
    );
    const preview = previewRef.current;
    if (!preview) {
      return;
    }
    const card = findCardPreview(item.id);
    if (card) {
      preview.animate(
        [
          {
            transform: flipFrom(
              card.getBoundingClientRect(),
              preview.getBoundingClientRect()
            ),
          },
          { transform: "none" },
        ],
        timing
      );
    } else {
      preview.animate(
        [
          { opacity: 0, transform: "scale(0.96)" },
          { opacity: 1, transform: "none" },
        ],
        timing
      );
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount; claimEnter guards repeats.
  }, []);

  // Exit: reverse the motion back into the sidebar edge and the card, before the shell navigates away.
  useEffect(() => {
    if (phase !== "closing" || prefersReducedMotion()) {
      return;
    }
    const timing = {
      duration: EXIT_MS,
      easing: EXIT_EASING,
      fill: "forwards" as const,
    };
    asideRef.current?.animate(
      [{ transform: "none" }, { transform: "translateX(-100%)" }],
      timing
    );
    const preview = previewRef.current;
    if (!preview) {
      return;
    }
    const card = findCardPreview(item.id);
    if (card) {
      preview.animate(
        [
          { transform: "none" },
          {
            transform: flipFrom(
              card.getBoundingClientRect(),
              preview.getBoundingClientRect()
            ),
          },
        ],
        timing
      );
    } else {
      preview.animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "scale(0.96)" },
        ],
        timing
      );
    }
  }, [item.id, phase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable], [role=slider], [role=tablist], [role=dialog][aria-modal=true]"
        )
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        go(previous);
      }
      if (event.key === "ArrowRight") {
        go(next);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, next, previous]);

  if (!config) {
    return null;
  }

  const seconds = (config.durationInFrames / config.fps).toFixed(1);
  const prompt = componentPrompt(
    item,
    config.snippet
      ? `Render it inside an Editframe composition like this:\n\n\`\`\`tsx\n${config.snippet(values)}\n\`\`\``
      : `Import it from "${config.importPath}" and render <${config.componentName} /> inside an Editframe composition.`
  );
  const hasControls = Object.keys(config.controls).length > 0;

  const preview = (
    <VideoPreview
      previewId={previewId}
      Component={registry[item.id].Component}
      componentProps={componentProps}
      durationInFrames={config.durationInFrames}
      fps={config.fps}
      previewBackdrop={config.previewBackdrop}
    />
  );

  const customizeActions = (
    <div className="ml-auto flex items-center gap-0.5">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-xs"
        disabled={isDefault}
        onClick={() => setValues(null)}
      >
        <RotateCcwIcon /> Reset
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-7"
        aria-label="Close customize"
        onClick={() => setCustomizing(false)}
      >
        <XIcon />
      </Button>
    </div>
  );

  const controls = (
    <div className="detail-controls">
      <ComponentCustomizer
        controls={config.controls}
        values={values}
        onChange={(key, value) => setValues({ [key]: value })}
      />
    </div>
  );

  return (
    <>
      <section
        ref={asideRef}
        role="dialog"
        aria-labelledby={titleId}
        className="bg-card relative z-10 flex h-full w-full shrink-0 flex-col border-r shadow-[8px_0_32px_-12px_rgb(0_0_0/0.18)] md:w-[26rem]"
      >
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            aria-label="Close"
            data-panel-autofocus
            onClick={close}
          >
            <XIcon />
          </Button>
          <TooltipProvider delay={300}>
            <div className="flex items-center gap-0.5">
              <NavTooltipButton
                label="Previous"
                shortcut={<ArrowLeftIcon />}
                disabled={!previous}
                onClick={() => go(previous)}
              >
                <ArrowLeftIcon />
              </NavTooltipButton>
              <NavTooltipButton
                label="Next"
                shortcut={<ArrowRightIcon />}
                disabled={!next}
                onClick={() => go(next)}
              >
                <ArrowRightIcon />
              </NavTooltipButton>
              <NavTooltipButton
                label="View as Markdown"
                nativeButton={false}
                render={
                  // oxlint-disable-next-line jsx-a11y/anchor-has-content -- render template; content comes from the trigger.
                  <a
                    href={`${catalogItemHref(item)}.md`}
                    target="_blank"
                    rel="noopener"
                  />
                }
              >
                <MarkdownDocIcon />
              </NavTooltipButton>
            </div>
            <Tooltip handle={navTooltip}>
              {({ payload }) =>
                payload ? (
                  <TooltipContent className="flex items-center gap-2">
                    {payload.label}
                    {payload.shortcut && <Kbd>{payload.shortcut}</Kbd>}
                  </TooltipContent>
                ) : null
              }
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Fade content out at the bottom so text never gets sliced by the panel's rounded edge mid-scroll. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-12 [mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]">
          <header className="pt-4 pb-5">
            <div className="flex items-center gap-2">
              <h2
                id={titleId}
                className="text-xl font-semibold tracking-[-0.02em]"
              >
                {item.name}
              </h2>
              {item.pro && (
                <Badge
                  variant="brand"
                  className="rounded-md px-1.5 text-[11px] font-semibold"
                >
                  Pro
                </Badge>
              )}
            </div>
            <div className="mt-2">
              <Description text={item.description} />
            </div>
          </header>

          {isMobile && <div className="mb-5">{preview}</div>}

          <div className="flex flex-wrap items-center gap-2">
            <PromptButton item={item} prompt={prompt} />
            {hasControls && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8"
                aria-pressed={customizing}
                onClick={() => setCustomizing((value) => !value)}
              >
                <SlidersHorizontalIcon /> Customize
              </Button>
            )}
          </div>

          <Frame className="mt-6">
            <FrameContent render={<dl />} className="divide-y text-sm">
              {[
                ["Category", CATEGORY_LABELS[item.category]],
                ["Duration", `${seconds}s`],
                [
                  "Resolution",
                  `${config.compositionWidth} × ${config.compositionHeight}`,
                ],
                ["Frame rate", `${config.fps} fps`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-3 py-2"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </FrameContent>
          </Frame>

          <Installation
            item={item}
            canAccess={canAccess}
            source={source}
            onUnlock={() => setUnlockOpen(true)}
          />

          {item.pro && !canAccess ? (
            <LockedDocs onUnlock={() => setUnlockOpen(true)} />
          ) : (
            docs && (
              <section className="mt-8 text-sm [&_h2]:text-lg [&_h3]:text-base">
                {docs}
              </section>
            )
          )}
        </div>
      </section>

      {!isMobile && (
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "flex min-h-0 flex-1 items-center justify-center p-8 [container-type:size] lg:p-14",
              customizing && hasControls && "pb-6 lg:pb-6"
            )}
            onPointerDown={(event) =>
              event.target === event.currentTarget && close()
            }
          >
            {/* VideoPreview draws the card itself (white video, controls on the shell); 3rem leaves room for the controls row. */}
            <div
              ref={previewRef}
              className="w-[min(100%,calc((100cqh-3rem)*16/9))] origin-top-left rounded-xl shadow-2xl"
            >
              {preview}
            </div>
          </div>
          {customizing && hasControls && (
            // Bottom sheet: spans the preview area edge to edge, only the top corners rounded, capped at ~a third.
            <Frame className="animate-in slide-in-from-bottom fade-in-0 flex max-h-[34%] shrink-0 flex-col rounded-b-none border-x-0 border-b-0 duration-300">
              <FrameHeader className="text-foreground text-sm font-medium">
                Customize
                {customizeActions}
              </FrameHeader>
              <FrameContent className="min-h-0 overflow-y-auto rounded-b-none border-b-0 p-4">
                {controls}
              </FrameContent>
            </Frame>
          )}
        </div>
      )}

      {isMobile && hasControls && (
        <Drawer open={customizing} onOpenChange={setCustomizing}>
          <DrawerContent>
            <DrawerHeader className="flex-row items-center justify-between">
              <DrawerTitle>Customize</DrawerTitle>
              {customizeActions}
            </DrawerHeader>
            <div className="max-h-[60svh] overflow-y-auto px-4 pb-4">
              {controls}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {item.pro && !canAccess && (
        <ProUnlockDialog
          item={item}
          open={unlockOpen}
          onOpenChange={setUnlockOpen}
        />
      )}
    </>
  );
};
