"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

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
import { cn } from "@/lib/utils";

import { HyperframesPlayer } from "./hyperframes-player";

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

export const HyperframesPreview = ({
  name,
  hideCode = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  className?: string;
}) => {
  const playCopy = useFeedback({ sound: "copy" });
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => playCopy(),
    timeout: 1500,
  });

  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
  }, [copyToClipboard]);

  useHotkeys("c", () => handleCopyLink(), {
    enabled: !isCopied,
    preventDefault: true,
  });

  const src = `/hyperframes/${name}/index.html`;

  const player = <HyperframesPlayer src={src} className="w-full" />;

  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      {hideCode ? (
        player
      ) : (
        <Tabs defaultValue="preview" className="gap-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            {player}
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            <div className="rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
              Source code viewer coming soon. The composition source is at{" "}
              <code className="text-foreground">{src}</code>.
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="rounded-lg bg-code px-1 pb-1">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            HyperFrames Composition
          </span>
          <div className="flex items-center gap-1">
            <CopyLinkButton isCopied={isCopied} onClick={handleCopyLink} />
          </div>
        </div>
      </div>
    </div>
  );
};
