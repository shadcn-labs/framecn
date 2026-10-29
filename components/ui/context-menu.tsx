"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { useCallback } from "react";

import { dropdownClose, dropdownOpen } from "@/audio/core";
import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

const ContextMenu = ({
  onOpenChange,
  sounds = false,
  ...props
}: ContextMenuPrimitive.Root.Props & {
  sounds?: boolean;
}) => {
  const playOpen = useFeedback({ soundDef: dropdownOpen });
  const playClose = useFeedback({ soundDef: dropdownClose });

  const handleOpenChange = useCallback(
    (
      open: boolean,
      eventDetails: ContextMenuPrimitive.Root.ChangeEventDetails
    ) => {
      if (sounds) {
        if (open) {
          playOpen();
        } else {
          playClose();
        }
      }
      onOpenChange?.(open, eventDetails);
    },
    [onOpenChange, playOpen, playClose, sounds]
  );

  return (
    <ContextMenuPrimitive.Root
      data-slot="context-menu"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const ContextMenuTrigger = ({
  ...props
}: ContextMenuPrimitive.Trigger.Props) => (
  <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
);

const ContextMenuGroup = ({ ...props }: ContextMenuPrimitive.Group.Props) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
);

const ContextMenuPortal = ({ ...props }: ContextMenuPrimitive.Portal.Props) => (
  <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
);

const ContextMenuSub = ({
  ...props
}: ContextMenuPrimitive.SubmenuRoot.Props) => (
  <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
);

const ContextMenuRadioGroup = ({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) => (
  <ContextMenuPrimitive.RadioGroup
    data-slot="context-menu-radio-group"
    {...props}
  />
);

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.SubmenuTrigger
    data-slot="context-menu-sub-trigger"
    data-inset={inset}
    className={cn(
      "flex cursor-default items-center rounded-[var(--menu-inner-radius)] px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto" />
  </ContextMenuPrimitive.SubmenuTrigger>
);

const ContextMenuContent = ({
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  collisionBoundary,
  collisionPadding,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionBoundary"
    | "collisionPadding"
  >) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      className="isolate z-50 outline-none"
    >
      <ContextMenuPrimitive.Popup
        data-slot="context-menu-content"
        className={cn(
          "z-50 max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto [--menu-radius:var(--radius-md)] [--menu-padding:calc(var(--spacing)*1)] [--menu-border-width:1px] [--menu-inner-radius:max(0px,calc(var(--menu-radius)-var(--menu-padding)-var(--menu-border-width)))] rounded-[var(--menu-radius)] border-[length:var(--menu-border-width)] bg-popover p-[var(--menu-padding)] text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Positioner>
  </ContextMenuPrimitive.Portal>
);

const ContextMenuSubContent = ({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) => (
  <ContextMenuContent
    data-slot="context-menu-sub-content"
    align={align}
    alignOffset={alignOffset}
    side={side}
    sideOffset={sideOffset}
    className={cn("overflow-hidden shadow-lg", className)}
    {...props}
  />
);

const ContextMenuItem = ({
  className,
  inset,
  variant = "default",
  onClick,
  sound,
  haptic,
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });

  const handleClick: ContextMenuPrimitive.Item.Props["onClick"] = (event) => {
    play();
    onClick?.(event);
  };

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  );
};

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props) => (
  <ContextMenuPrimitive.CheckboxItem
    data-slot="context-menu-checkbox-item"
    className={cn(
      "relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.CheckboxItemIndicator>
        <CheckIcon className="size-4" />
      </ContextMenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
);

const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: ContextMenuPrimitive.RadioItem.Props) => (
  <ContextMenuPrimitive.RadioItem
    data-slot="context-menu-radio-item"
    className={cn(
      "relative flex cursor-default items-center gap-2 rounded-[var(--menu-inner-radius)] py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.RadioItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </ContextMenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
);

const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.GroupLabel
    data-slot="context-menu-label"
    data-inset={inset}
    className={cn(
      "px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8",
      className
    )}
    {...props}
  />
);

const ContextMenuSeparator = ({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) => (
  <ContextMenuPrimitive.Separator
    data-slot="context-menu-separator"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
);

const ContextMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    data-slot="context-menu-shortcut"
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
);

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
