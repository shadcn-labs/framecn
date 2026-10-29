"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@/lib/utils";

/**
 * Site-wide surface: a muted shell with a 2px inset around a bordered card body.
 * Put labels/actions in `FrameHeader`/`FrameFooter` (they sit on the muted shell) and the main content in `FrameContent`.
 */
const Frame = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("bg-muted/60 rounded-xl border p-0.5", className) },
      props
    ),
    render,
    state: { slot: "frame" },
  });

const FrameHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="frame-header"
    className={cn(
      "text-muted-foreground flex min-h-9 items-center gap-2 px-3 py-1 text-xs",
      className
    )}
    {...props}
  />
);

const FrameContent = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("bg-card rounded-lg border", className) },
      props
    ),
    render,
    state: { slot: "frame-content" },
  });

const FrameFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="frame-footer"
    className={cn(
      "text-muted-foreground flex min-h-9 items-center gap-2 px-3 py-1 text-xs",
      className
    )}
    {...props}
  />
);

export { Frame, FrameContent, FrameFooter, FrameHeader };
