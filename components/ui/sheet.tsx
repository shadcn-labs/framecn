"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { drawerOpen, drawerClose } from "@/audio/core";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

const Sheet = ({
  onOpenChange,
  sounds = false,
  ...props
}: SheetPrimitive.Root.Props & {
  sounds?: boolean;
}) => {
  const playOpen = useFeedback({ soundDef: drawerOpen });
  const playClose = useFeedback({ soundDef: drawerClose });
  const isControlled = props.open !== undefined;
  const lastOpen = useRef(props.open ?? props.defaultOpen ?? false);

  const playStateSound = useCallback(
    (open: boolean) => {
      if (!sounds || open === lastOpen.current) {
        return;
      }

      if (open) {
        playOpen();
      } else {
        playClose();
      }

      lastOpen.current = open;
    },
    [playClose, playOpen, sounds]
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    playStateSound(props.open ?? false);
  }, [isControlled, playStateSound, props.open]);

  const handleOpenChange = useCallback(
    (open: boolean, eventDetails: SheetPrimitive.Root.ChangeEventDetails) => {
      playStateSound(open);
      onOpenChange?.(open, eventDetails);
    },
    [onOpenChange, playStateSound]
  );

  if (!sounds) {
    return (
      <SheetPrimitive.Root
        data-slot="sheet"
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  return (
    <SheetPrimitive.Root
      data-slot="sheet"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const SheetTrigger = ({ ...props }: SheetPrimitive.Trigger.Props) => (
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
);

const SheetClose = ({ ...props }: SheetPrimitive.Close.Props) => (
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />
);

const SheetPortal = ({ ...props }: SheetPrimitive.Portal.Props) => (
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
);

const SheetOverlay = ({
  className,
  ...props
}: SheetPrimitive.Backdrop.Props) => (
  <SheetPrimitive.Backdrop
    data-slot="sheet-overlay"
    className={cn(
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
);

const SheetContent = ({
  className,
  children,
  side = "right",
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
}) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Popup
      data-slot="sheet-content"
      className={cn(
        "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-closed:duration-300 data-open:duration-500",
        side === "right" &&
          "data-ending-style:translate-x-full data-starting-style:translate-x-full inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left" &&
          "data-ending-style:-translate-x-full data-starting-style:-translate-x-full inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        side === "top" &&
          "data-ending-style:-translate-y-full data-starting-style:-translate-y-full inset-x-0 top-0 h-auto border-b",
        side === "bottom" &&
          "data-ending-style:translate-y-full data-starting-style:translate-y-full inset-x-0 bottom-0 h-auto border-t",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-open:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
        <XIcon className="size-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Popup>
  </SheetPortal>
);

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sheet-header"
    className={cn("flex flex-col gap-1.5 p-4", className)}
    {...props}
  />
);

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sheet-footer"
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);

const SheetTitle = ({ className, ...props }: SheetPrimitive.Title.Props) => (
  <SheetPrimitive.Title
    data-slot="sheet-title"
    className={cn("text-foreground font-semibold", className)}
    {...props}
  />
);

const SheetDescription = ({
  className,
  ...props
}: SheetPrimitive.Description.Props) => (
  <SheetPrimitive.Description
    data-slot="sheet-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
