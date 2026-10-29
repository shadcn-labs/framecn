"use client";

import { useCallback, useMemo } from "react";

import { CopyButton } from "@/components/copy-button";
import { getIconForPackageManager } from "@/components/icons";
import { Frame, FrameContent, FrameHeader } from "@/components/ui/frame";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PackageManager } from "@/hooks/use-package-manager";
import { usePackageManager } from "@/hooks/use-package-manager";
import type { Event } from "@/lib/events";
import { cn } from "@/lib/utils";

export const CodeBlockCommand = ({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
  className,
  copyEvent = "copy_npm_command",
}: {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
  className?: string;
  copyEvent?: Event["name"];
}) => {
  const [packageManager, setPackageManager] = usePackageManager();

  const commandTabs = useMemo(
    () => ({
      bun: __bun__,
      npm: __npm__,
      pnpm: __pnpm__,
      yarn: __yarn__,
    }),
    [__npm__, __pnpm__, __yarn__, __bun__]
  );

  const handlePackageManagerChange = useCallback(
    (value: string) => setPackageManager(value as PackageManager),
    [setPackageManager]
  );

  const copyValue = useMemo(
    () => commandTabs[packageManager] || "",
    [commandTabs, packageManager]
  );

  return (
    <Frame className={cn("px-0.5 pt-0 pb-0.5 text-sm", className)}>
      <Tabs
        className="gap-0"
        onValueChange={handlePackageManagerChange}
        value={packageManager}
      >
        <FrameHeader className="h-10 min-h-0 px-2 py-0">
          <TabsList className="bg-transparent [--tabs-radius:0px] [--tabs-padding:0px] [--tabs-border-width:0px] [--tabs-item-radius:var(--radius-md)] [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

            {Object.entries(commandTabs).map(([key]) => (
              <TabsTrigger
                key={key}
                className="data-active:border-input data-active:bg-card h-7 border border-transparent pt-0.5 data-active:shadow-none"
                sound="tabSwitch"
                value={key}
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton
            className="static ms-auto size-7 bg-transparent opacity-70 hover:bg-muted hover:opacity-100 focus-visible:bg-muted focus-visible:opacity-100"
            value={copyValue}
            event={copyEvent}
            tooltip="Copy install command"
          />
        </FrameHeader>
        <FrameContent className="no-scrollbar overflow-x-auto">
          {Object.entries(commandTabs).map(([key, value]) => (
            <TabsContent key={key} className="mt-0 px-4 py-3.5" value={key}>
              <pre>
                <code
                  data-slot="code-block"
                  data-language="bash"
                  className="font-mono text-sm/none"
                >
                  <span className="text-muted-foreground select-none">$ </span>
                  {value}
                </code>
              </pre>
            </TabsContent>
          ))}
        </FrameContent>
      </Tabs>
    </Frame>
  );
};
