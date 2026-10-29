"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
);

const TabsList = ({ className, ...props }: TabsPrimitive.List.Props) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      "bg-muted/60 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg border p-0.5",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({
  className,
  onClick,
  sound,
  haptic,
  ...props
}: TabsPrimitive.Tab.Props & {
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });

  const handleClick: TabsPrimitive.Tab.Props["onClick"] = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      onClick={handleClick}
      className={cn(
        "data-active:bg-card data-active:border-border data-active:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground hover:text-foreground inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:shadow-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

const TabsContent = ({ className, ...props }: TabsPrimitive.Panel.Props) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn("flex-1 outline-none", className)}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
