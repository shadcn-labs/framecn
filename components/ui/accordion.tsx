"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";

import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

/**
 * Card look: the root is the muted shell (Frame), each item a white card with a 2px gap.
 * Panels use `hiddenUntilFound` so closed answers stay in the HTML for search and find-in-page.
 */
const Accordion = ({
  className,
  hiddenUntilFound = true,
  ...props
}: AccordionPrimitive.Root.Props) => (
  <AccordionPrimitive.Root
    data-slot="accordion"
    hiddenUntilFound={hiddenUntilFound}
    className={cn(
      "bg-muted/60 grid gap-0.5 rounded-xl border p-0.5",
      className
    )}
    {...props}
  />
);

const AccordionItem = ({
  className,
  ...props
}: AccordionPrimitive.Item.Props) => (
  <AccordionPrimitive.Item
    data-slot="accordion-item"
    className={cn("bg-card rounded-lg border", className)}
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  onClick,
  sound,
  haptic,
  ...props
}: AccordionPrimitive.Trigger.Props & {
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });

  const handleClick: AccordionPrimitive.Trigger.Props["onClick"] = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-lg px-4 py-3.5 text-left text-[15px] font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) => (
  <AccordionPrimitive.Panel
    data-slot="accordion-content"
    className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
    {...props}
  >
    <div
      className={cn(
        "text-muted-foreground px-4 pb-4 leading-6 text-pretty",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Panel>
);

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
