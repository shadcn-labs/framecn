import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Tinted notes: a 3px accent rail on the left, a soft tint of the same hue, and an icon in that hue so notes read at a glance.
const alertVariants = cva(
  "relative w-full rounded-lg border border-l-[3px] px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-1 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "bg-muted/70 border-border border-l-foreground/40 text-foreground [&>svg]:text-foreground/70",
        destructive:
          "border-destructive/25 border-l-destructive bg-destructive/[0.06] text-foreground dark:bg-destructive/10 [&>svg]:text-destructive",
        warning:
          "border-amber-500/30 border-l-amber-500 bg-amber-500/[0.08] text-foreground dark:bg-amber-400/10 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
      },
    },
  }
);

const Alert = ({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => (
  <div
    data-slot="alert"
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);

const AlertTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-title"
    className={cn("col-start-2 min-h-4 font-medium tracking-tight", className)}
    {...props}
  />
);

const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-description"
    className={cn(
      "text-foreground/75 col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
);

export { Alert, AlertDescription, AlertTitle };
