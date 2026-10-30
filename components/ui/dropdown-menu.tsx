"use client";

import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = ({ ...props }: DropdownMenuPrimitive.Root.Props) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
);

const DropdownMenuPortal = ({
  ...props
}: DropdownMenuPrimitive.Portal.Props) => (
  <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
);

const DropdownMenuTrigger = ({
  ...props
}: DropdownMenuPrimitive.Trigger.Props) => (
  <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
);

const DropdownMenuContent = ({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  collisionBoundary,
  collisionPadding,
  ...props
}: DropdownMenuPrimitive.Popup.Props &
  Pick<
    DropdownMenuPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionBoundary"
    | "collisionPadding"
  >) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      className="isolate z-50 outline-none"
    >
      <DropdownMenuPrimitive.Popup
        data-slot="dropdown-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto [--menu-radius:var(--radius-md)] [--menu-padding:calc(var(--spacing)*1)] [--menu-border-width:1px] [--menu-inner-radius:max(0px,calc(var(--menu-radius)-var(--menu-padding)-var(--menu-border-width)))] rounded-[var(--menu-radius)] border-[length:var(--menu-border-width)] p-[var(--menu-padding)] shadow-md outline-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Positioner>
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuGroup = ({ ...props }: DropdownMenuPrimitive.Group.Props) => (
  <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) => (
  <DropdownMenuPrimitive.Item
    data-slot="dropdown-menu-item"
    data-inset={inset}
    data-variant={variant}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: DropdownMenuPrimitive.CheckboxItem.Props) => (
  <DropdownMenuPrimitive.CheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.CheckboxItemIndicator>
        <CheckIcon className="size-4" />
      </DropdownMenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);

const DropdownMenuRadioGroup = ({
  ...props
}: DropdownMenuPrimitive.RadioGroup.Props) => (
  <DropdownMenuPrimitive.RadioGroup
    data-slot="dropdown-menu-radio-group"
    {...props}
  />
);

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuPrimitive.RadioItem.Props) => (
  <DropdownMenuPrimitive.RadioItem
    data-slot="dropdown-menu-radio-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.RadioItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </DropdownMenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
);

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.GroupLabel
    data-slot="dropdown-menu-label"
    data-inset={inset}
    className={cn(
      "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
      className
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuPrimitive.Separator.Props) => (
  <DropdownMenuPrimitive.Separator
    data-slot="dropdown-menu-separator"
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props}
  />
);

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    data-slot="dropdown-menu-shortcut"
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className
    )}
    {...props}
  />
);

const DropdownMenuSub = ({
  ...props
}: DropdownMenuPrimitive.SubmenuRoot.Props) => (
  <DropdownMenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
);

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.SubmenuTrigger
    data-slot="dropdown-menu-sub-trigger"
    data-inset={inset}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground flex cursor-default items-center rounded-[var(--menu-inner-radius)] px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubmenuTrigger>
);

const DropdownMenuSubContent = ({
  className,
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) => (
  <DropdownMenuContent
    data-slot="dropdown-menu-sub-content"
    align={align}
    alignOffset={alignOffset}
    side={side}
    sideOffset={sideOffset}
    className={cn("min-w-[8rem] overflow-hidden shadow-lg", className)}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
