"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const CodeCollapsibleWrapper = ({
  className,
  children,
  navTriggerClassName,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "className"> & {
  className?: string;
  navTriggerClassName?: string;
}) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Collapsible
      sounds
      open={isOpened}
      onOpenChange={setIsOpened}
      className={cn(
        "group/collapsible relative md:-mx-1",
        isOpened && "[&_[data-rehype-pretty-code-title]]:pr-32",
        className
      )}
      {...props}
    >
      <CollapsibleTrigger
        nativeButton={false}
        render={
          <div
            className={cn(
              "absolute top-1.5 right-9 z-10 flex items-center",
              !isOpened && "hidden",
              navTriggerClassName
            )}
          />
        }
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 rounded-md px-2"
        >
          {isOpened ? "Collapse" : "Expand"}
        </Button>
        <Separator orientation="vertical" className="mx-1.5 h-4!" />
      </CollapsibleTrigger>
      <CollapsibleContent
        keepMounted
        hidden={false}
        className="relative mt-6 data-closed:[content-visibility:auto] data-closed:[&_figure_pre]:max-h-56 data-closed:[&_figure_pre]:overflow-hidden [&>figure]:mt-0 [&>figure]:md:mx-0!"
      >
        {children}
      </CollapsibleContent>

      <div
        className={cn(
          "absolute inset-x-0 bottom-[3px] mx-[3px] flex h-20 items-center justify-center rounded-b-lg bg-linear-to-b from-card/70 to-card",
          isOpened && "hidden"
        )}
      >
        <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
          Expand
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
};
