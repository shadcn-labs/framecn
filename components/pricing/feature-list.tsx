import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  label: string;
}

/** Icon-led feature bullets shared by the plan columns and the Team card. */
export const FeatureList = ({
  heading,
  items,
  accent = false,
  className,
}: {
  heading?: string;
  items: Feature[];
  accent?: boolean;
  className?: string;
}) => (
  <div className={className}>
    {heading ? (
      <p className="text-muted-foreground mb-3 text-sm">{heading}</p>
    ) : null}
    <ul className="space-y-2.5 text-sm">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-start gap-2.5">
          <Icon
            aria-hidden
            className={cn(
              "mt-0.5 size-4 shrink-0",
              accent ? "text-brand" : "text-muted-foreground"
            )}
          />
          {label}
        </li>
      ))}
    </ul>
  </div>
);
