"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

const Popover = ({ ...props }: PopoverPrimitive.Root.Props) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

const PopoverTrigger = ({ ...props }: PopoverPrimitive.Trigger.Props) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverContent = ({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  anchor,
  collisionBoundary,
  collisionPadding,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "anchor"
    | "collisionBoundary"
    | "collisionPadding"
  >) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      anchor={anchor}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      className="isolate z-50"
    >
      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
);

/**
 * Base UI Popover has no Anchor part. This is an inert passthrough kept so
 * existing markup still renders; it does NOT reposition the popup. To anchor
 * against another element, pass `anchor` (element or ref) to `PopoverContent`.
 */
const PopoverAnchor = (props: React.ComponentProps<"div">) => (
  <div data-slot="popover-anchor" {...props} />
);

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
