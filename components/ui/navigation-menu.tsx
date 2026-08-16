"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;
const NavigationMenuContent = NavigationMenuPrimitive.Content;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuViewport = NavigationMenuPrimitive.Viewport;

const NavigationMenuViewportPosition = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuViewport>) => (
  <NavigationMenuViewport
    className={cn(
      "relative mt-2 h-0 overflow-hidden rounded-b-[var(--navigation-menu-viewport-radius)] border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height] duration-200 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2",
      className
    )}
    {...props}
  />
);

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuViewportPosition,
};
