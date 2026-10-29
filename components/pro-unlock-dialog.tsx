"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";

import { BillingButton } from "@/components/billing-button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { CATALOG } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import type { PlanOffers } from "@/lib/plans";

const PRO_ITEM_COUNT = CATALOG.filter((item) => item.pro).length;

const FEATURES = [
  "Full source, installed with the CLI or MCP",
  "Customize every prop, render to MP4",
  "Commercial & client use, every future Pro item",
];

export const ProUnlockDialog = ({
  item,
  offers,
  open,
  onOpenChange,
}: {
  item: CatalogItem;
  offers: PlanOffers;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { annual, lifetime, team } = offers;
  return (
    <Dialog open={open} onOpenChange={onOpenChange} sounds>
      <DialogContent className="gap-0 p-8 text-center sm:max-w-md">
        <DialogHeader className="items-center gap-0 text-center sm:text-center">
          <Badge variant="brand">Pro</Badge>
          <DialogTitle className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
            Unlock {item.name}
          </DialogTitle>
          <DialogDescription className="mt-2">
            Pay once, keep everything — including all we add next.
          </DialogDescription>
        </DialogHeader>
        <p className="mt-8 text-6xl font-semibold tracking-[-0.04em] tabular-nums">
          {PRO_ITEM_COUNT}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Pro {PRO_ITEM_COUNT === 1 ? "item" : "items"}, {item.name} included
        </p>
        <ul className="mx-auto mt-8 grid w-fit gap-2.5 text-left text-sm">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <CheckIcon className="text-brand size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <BillingButton plan="lifetime" highlight>
            Get lifetime access – {lifetime.price}
          </BillingButton>
          {lifetime.earlyBirdLeft === null ? null : (
            <p className="text-muted-foreground mt-2 text-xs">
              Early-bird price, regularly <s>{lifetime.regularPrice}</s> ·{" "}
              {lifetime.earlyBirdLeft} left
            </p>
          )}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          <Link
            href={ROUTES.PRICING}
            className="underline-offset-4 hover:underline"
          >
            Team · 10 seats {team.price}
          </Link>
          {" · "}
          <Link
            href={ROUTES.PRICING}
            className="underline-offset-4 hover:underline"
          >
            or {annual.price}/year
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
};
