"use client";

import {
  BuildingIcon,
  KeyRoundIcon,
  MinusIcon,
  PlusIcon,
  ReceiptTextIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TextMorph } from "torph/react";

import { BillingButton } from "@/components/billing-button";
import { FeatureList } from "@/components/pricing/feature-list";
import { PlanCard, PlanCta } from "@/components/pricing/plan-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatUsd, TEAM, teamPrice } from "@/lib/plans";

const FEATURES = [
  {
    icon: UsersIcon,
    label: `${TEAM.minSeats}–${TEAM.maxSeats} seats on one license`,
  },
  { icon: KeyRoundIcon, label: "One team API key, shared in CI and .env" },
  { icon: UserCheckIcon, label: "Seats are people, not projects" },
  { icon: ReceiptTextIcon, label: "One invoice, VAT handled by Dodo" },
  { icon: BuildingIcon, label: `Over ${TEAM.maxSeats} seats? We'll quote it` },
];

/** One past the max stands for "more than 25": the card turns into contact sales. */
const SALES_SEATS = TEAM.maxSeats + 1;

export const TeamPlan = ({
  unavailable,
  pro,
}: {
  unavailable: string | null;
  pro: boolean;
}) => {
  const [seats, setSeats] = useState<number>(TEAM.defaultSeats);
  const sales = seats === SALES_SEATS;
  const total = teamPrice(seats);

  return (
    <PlanCard
      name="Team"
      price={
        <p className="flex flex-wrap items-baseline">
          <TextMorph
            as="span"
            className="text-4xl font-semibold tracking-tight tabular-nums"
          >
            {sales ? "Let's talk" : formatUsd(total)}
          </TextMorph>
          {sales ? null : (
            <span className="text-muted-foreground ml-1.5 text-sm">once</span>
          )}
        </p>
      }
      blurbAtBottom
      blurb={
        <div className="flex items-center gap-3">
          <div className="bg-muted/60 text-foreground inline-flex items-center rounded-full border p-0.5">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="rounded-full"
              aria-label="Remove a seat"
              disabled={seats <= TEAM.minSeats}
              onClick={() => setSeats((value) => value - 1)}
            >
              <MinusIcon />
            </Button>
            <output
              aria-label="Seats"
              aria-live="polite"
              className="w-9 text-center text-sm font-medium tabular-nums"
            >
              <TextMorph as="span">
                {sales ? `${TEAM.maxSeats}+` : String(seats)}
              </TextMorph>
            </output>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="rounded-full"
              aria-label="Add a seat"
              disabled={sales}
              onClick={() => setSeats((value) => value + 1)}
            >
              <PlusIcon />
            </Button>
          </div>
          seats
        </div>
      }
      features={
        <FeatureList heading="Everything in Lifetime, plus:" items={FEATURES} />
      }
      cta={
        <PlanCta
          helper={
            unavailable && !sales ? (
              <span className="text-destructive">{unavailable}</span>
            ) : null
          }
        >
          {sales ? (
            <Button
              nativeButton={false}
              render={<Link href={`${ROUTES.CONTACT}?inquiry=sales`} />}
              className="w-full"
            >
              Contact sales
            </Button>
          ) : (
            <BillingButton
              plan="team"
              seats={seats}
              disabled={Boolean(unavailable) || pro}
            >
              {pro ? "Pro access active" : "Get it for your team"}
            </BillingButton>
          )}
        </PlanCta>
      }
    />
  );
};
