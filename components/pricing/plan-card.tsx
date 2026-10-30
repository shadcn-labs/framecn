import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Frame } from "@/components/ui/frame";
import { cn } from "@/lib/utils";

/**
 * One plan as its own framed card. Cards are five subgrid rows (name, price,
 * blurb, features, CTA) of the parent grid, so features and buttons line up
 * across cards whatever the blurb holds. The parent needs `gap-y-0`.
 */
export const PlanCard = ({
  name,
  price,
  blurb,
  blurbAtBottom = false,
  features,
  cta,
  highlight = false,
}: {
  name: string;
  price: React.ReactNode;
  blurb: React.ReactNode;
  /** Sit the blurb on the row's bottom edge (Team's seat stepper). */
  blurbAtBottom?: boolean;
  features: React.ReactNode;
  cta: React.ReactNode;
  highlight?: boolean;
}) => (
  <Frame
    className={cn(
      "relative row-span-5 mb-4 grid min-w-0 grid-rows-subgrid",
      highlight && "border-brand/40 bg-brand/10"
    )}
  >
    {highlight ? (
      <Badge
        variant="brand"
        className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2"
      >
        Most popular
      </Badge>
    ) : null}
    <Card
      className={cn(
        "row-span-5 grid min-w-0 grid-rows-subgrid gap-0 rounded-[var(--frame-inner-radius)] p-6 shadow-none",
        highlight && "border-brand/40"
      )}
    >
      <h2 className="font-medium">{name}</h2>
      <div className="mt-6">{price}</div>
      <div
        className={cn(
          "text-muted-foreground mt-2 text-sm text-pretty",
          blurbAtBottom && "self-end"
        )}
      >
        {blurb}
      </div>
      <div className="mt-6">{features}</div>
      <div className="self-end pt-8">{cta}</div>
    </Card>
  </Frame>
);

export const PlanPrice = ({
  price,
  regularPrice,
  interval,
}: {
  price: string;
  /** Struck-through list price while a discount applies. */
  regularPrice?: string | null;
  interval: string;
}) => (
  <p className="flex flex-wrap items-baseline">
    <span className="text-4xl font-semibold tracking-tight tabular-nums">
      {price}
    </span>
    {regularPrice ? (
      <s className="text-muted-foreground ml-2 text-lg">{regularPrice}</s>
    ) : null}
    <span className="text-muted-foreground ml-1.5 text-sm">{interval}</span>
  </p>
);

/** The button with a reserved helper strip below, so every card's button lines up. */
export const PlanCta = ({
  children,
  helper,
}: {
  children: React.ReactNode;
  helper?: React.ReactNode;
}) => (
  <>
    {children}
    <p className="text-muted-foreground mt-2 min-h-4 text-center text-xs">
      {helper}
    </p>
  </>
);
