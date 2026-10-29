"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { modalOpen, modalClose } from "@/audio/core";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

const Dialog = ({
  onOpenChange,
  sounds = false,
  ...props
}: DialogPrimitive.Root.Props & {
  sounds?: boolean;
}) => {
  const playOpen = useFeedback({ soundDef: modalOpen });
  const playClose = useFeedback({ soundDef: modalClose });
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
    (open: boolean, eventDetails: DialogPrimitive.Root.ChangeEventDetails) => {
      playStateSound(open);
      onOpenChange?.(open, eventDetails);
    },
    [onOpenChange, playStateSound]
  );

  if (!sounds) {
    return (
      <DialogPrimitive.Root
        data-slot="dialog"
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const DialogTrigger = ({ ...props }: DialogPrimitive.Trigger.Props) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = ({ ...props }: DialogPrimitive.Close.Props) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

const DialogOverlay = ({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) => (
  <DialogPrimitive.Backdrop
    data-slot="dialog-overlay"
    className={cn(
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
);

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  overlayClassName?: string;
}) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay className={overlayClassName} />
    <DialogPrimitive.Popup
      data-slot="dialog-content"
      className={cn(
        // Same surface as the search dialog: popover fill with a soft 4px ring instead of a hard border.
        // Dark (as on ui.shadcn.com): the ring is a solid grey a step lighter than the fill, which is what defines the edge.
        "bg-popover ring-border/60 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl bg-clip-padding p-6 shadow-2xl ring-4 duration-200 sm:max-w-lg dark:ring-input",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className="ring-offset-background focus:ring-ring data-open:bg-accent data-open:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Popup>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="dialog-header"
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: DialogPrimitive.Description.Props) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
