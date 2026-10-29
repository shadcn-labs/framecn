import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-accent/50 data-popup-open:text-accent-foreground data-popup-open:hover:bg-accent data-popup-open:focus:bg-accent"
);

const NavigationMenuViewport = ({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Popup.Props &
  Pick<
    NavigationMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) => (
  <NavigationMenuPrimitive.Portal>
    <NavigationMenuPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-1.5 data-[side=bottom]:before:h-1.5"
    >
      <NavigationMenuPrimitive.Popup
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow duration-200 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-2 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
      </NavigationMenuPrimitive.Popup>
    </NavigationMenuPrimitive.Positioner>
  </NavigationMenuPrimitive.Portal>
);

const NavigationMenu = ({
  className,
  children,
  align = "start",
  viewportClassName,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align"> & {
    viewportClassName?: string;
  }) => (
  <NavigationMenuPrimitive.Root
    data-slot="navigation-menu"
    className={cn(
      "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport align={align} className={viewportClassName} />
  </NavigationMenuPrimitive.Root>
);

const NavigationMenuList = ({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props) => (
  <NavigationMenuPrimitive.List
    data-slot="navigation-menu-list"
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    {...props}
  />
);

const NavigationMenuItem = ({
  className,
  ...props
}: NavigationMenuPrimitive.Item.Props) => (
  <NavigationMenuPrimitive.Item
    data-slot="navigation-menu-item"
    className={cn("relative", className)}
    {...props}
  />
);

const NavigationMenuTrigger = ({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) => (
  <NavigationMenuPrimitive.Trigger
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDownIcon
      className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-popup-open:rotate-180"
      strokeWidth={2.5}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
);

const NavigationMenuContent = ({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) => (
  <NavigationMenuPrimitive.Content
    data-slot="navigation-menu-content"
    className={cn(
      "h-full w-auto p-2 pr-2.5 transition-[opacity,translate] data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=right]:translate-x-52 data-starting-style:data-[activation-direction=left]:-translate-x-52 data-ending-style:data-[activation-direction=right]:-translate-x-52 data-ending-style:data-[activation-direction=left]:translate-x-52",
      "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
      className
    )}
    {...props}
  />
);

const NavigationMenuLink = ({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) => (
  <NavigationMenuPrimitive.Link
    data-slot="navigation-menu-link"
    className={cn(
      "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-active:bg-accent/50 data-active:text-accent-foreground data-active:hover:bg-accent data-active:focus:bg-accent [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

/**
 * Base UI NavigationMenu has no Indicator part (nothing tracks the active
 * trigger along the list). Inert passthrough kept so existing markup renders.
 */
const NavigationMenuIndicator = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="navigation-menu-indicator"
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </div>
);

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
