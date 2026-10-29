"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

/** Lets `Tooltip`/`TooltipTrigger` join an outer provider instead of creating their own, so grouped tooltips share open/skip delays. */
const InsideProvider = createContext(false);

/** Creates a handle that lets several detached `TooltipTrigger`s share one `Tooltip` popup. */
const createTooltipHandle = TooltipPrimitive.createHandle;

const TooltipProvider = ({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) => (
  <InsideProvider.Provider value>
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  </InsideProvider.Provider>
);

const Tooltip = <Payload,>({
  ...props
}: TooltipPrimitive.Root.Props<Payload>) => {
  const root = <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
  return useContext(InsideProvider) ? (
    root
  ) : (
    <TooltipProvider>{root}</TooltipProvider>
  );
};

const TooltipTrigger = <Payload,>({
  ...props
}: TooltipPrimitive.Trigger.Props<Payload>) => {
  const trigger = (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
  );
  // Detached (`handle`) triggers can live outside any `Tooltip`; give them the default provider delay too.
  return useContext(InsideProvider) ? (
    trigger
  ) : (
    <TooltipProvider>{trigger}</TooltipProvider>
  );
};

const TooltipContent = ({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  collisionBoundary,
  collisionPadding,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionBoundary"
    | "collisionPadding"
  >) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      className="isolate z-50"
    >
      <TooltipPrimitive.Popup
        data-slot="tooltip-content"
        className={cn(
          "bg-foreground text-background data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[instant]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-[var(--tooltip-radius)] px-3 py-1.5 text-xs text-balance [--tooltip-radius:var(--radius-md)] has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-[max(0px,calc(var(--tooltip-radius)-var(--spacing)*1.5))]",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
);

export {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
