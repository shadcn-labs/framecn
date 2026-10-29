import { cn } from "@/lib/utils";

export const Step = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <h3
    className={cn(
      "relative mt-8 scroll-m-32 font-heading text-lg font-medium tracking-tight",
      className
    )}
    {...props}
  />
);

export const Steps = ({
  className,
  compact = false,
  ...props
}: React.ComponentProps<"div"> & { compact?: boolean }) => (
  <div
    className={cn(
      "steps [counter-reset:step]",
      compact
        ? "[&>h3]:step [&>h3]:before:static! [&>h3]:before:mt-0! [&>h3]:before:ml-0! [&>h3]:before:size-6! [&>h3]:before:border-0! [&>h3]:before:[box-shadow:none]! [&>h3]:before:content-[counter(step)]"
        : "md:ml-4 md:border-l md:pl-8 [&>h3]:step",
      className
    )}
    {...props}
  />
);
