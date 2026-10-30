import {
  BotIcon,
  BriefcaseBusinessIcon,
  CalendarSyncIcon,
  GiftIcon,
  InfinityIcon,
  KeyRoundIcon,
  LayersIcon,
  PackageOpenIcon,
  PlayIcon,
  RefreshCwOffIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TerminalIcon,
} from "lucide-react";
import Link from "next/link";

import { BillingButton } from "@/components/billing-button";
import { FeatureList } from "@/components/pricing/feature-list";
import type { Feature } from "@/components/pricing/feature-list";
import { PlanCard, PlanCta, PlanPrice } from "@/components/pricing/plan-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { CATALOG, PRO_COUNT } from "@/lib/catalog";
import { EARLY_BIRD_LIMIT } from "@/lib/plans";
import type { PlanOffer } from "@/lib/plans";

const FREE_COUNT = CATALOG.length - PRO_COUNT;

const FREE: Feature[] = [
  {
    icon: GiftIcon,
    label: `${FREE_COUNT} free components, kept forever`,
  },
  { icon: BriefcaseBusinessIcon, label: "MIT, so client work is fine" },
  { icon: SlidersHorizontalIcon, label: "Live customizer on every prop" },
  { icon: TerminalIcon, label: "One shadcn CLI command to install" },
  { icon: PlayIcon, label: "Every Pro preview, free to play" },
];

const PRO: Feature[] = [
  { icon: LayersIcon, label: `All ${PRO_COUNT} Pro components, full source` },
  { icon: SparklesIcon, label: "New Pro drops while subscribed" },
  { icon: KeyRoundIcon, label: "Private registry + personal API key" },
  { icon: BotIcon, label: "Copy prompt that brings your exact props" },
  { icon: CalendarSyncIcon, label: "Cancel whenever, keep what you shipped" },
];

const LIFETIME: Feature[] = [
  { icon: InfinityIcon, label: "Pro access that never expires" },
  { icon: SparklesIcon, label: "Every Pro component we ship next" },
  { icon: RefreshCwOffIcon, label: "No renewals, no reminder emails" },
  { icon: PackageOpenIcon, label: "Commercial and client projects" },
];

export interface PaidPlanProps {
  offer: PlanOffer;
  /** Why checkout cannot open, shown under the button. */
  unavailable: string | null;
  pro: boolean;
}

const helperText = ({ offer, unavailable }: PaidPlanProps) => {
  if (unavailable) {
    return <span className="text-destructive">{unavailable}</span>;
  }
  if (offer.earlyBirdLeft !== null) {
    return `${offer.earlyBirdLeft} of ${EARLY_BIRD_LIMIT} left at this price`;
  }
  return null;
};

const listPrice = (offer: PlanOffer) =>
  offer.earlyBirdLeft === null ? null : offer.regularPrice;

export const FreeCard = () => (
  <PlanCard
    name="Free"
    price={<PlanPrice price="$0" interval="forever" />}
    blurb="Motion that looks edited, not auto-generated. No account, no card, no catch."
    features={<FeatureList items={FREE} />}
    cta={
      <PlanCta>
        <Button
          nativeButton={false}
          render={<Link href={ROUTES.COMPONENTS} />}
          variant="outline"
          className="w-full"
        >
          Browse components
        </Button>
      </PlanCta>
    }
  />
);

export const ProCard = (props: PaidPlanProps) => (
  <PlanCard
    name="Pro"
    price={
      <PlanPrice
        price={props.offer.price}
        regularPrice={listPrice(props.offer)}
        interval="/ year"
      />
    }
    blurb="Every Pro component for a year. Good for one launch, or one very busy quarter."
    features={<FeatureList heading="Everything in Free, plus:" items={PRO} />}
    cta={
      <PlanCta helper={helperText(props)}>
        <BillingButton
          plan="annual"
          disabled={Boolean(props.unavailable) || props.pro}
        >
          {props.pro
            ? "Pro access active"
            : `Lock in ${props.offer.price}/year`}
        </BillingButton>
      </PlanCta>
    }
  />
);

export const LifetimeCard = (props: PaidPlanProps) => (
  <PlanCard
    name="Lifetime"
    highlight
    price={
      <PlanPrice
        price={props.offer.price}
        regularPrice={listPrice(props.offer)}
        interval="once"
      />
    }
    blurb="Pay once, own the whole library, and everything we add after. The one we'd buy."
    features={
      <FeatureList heading="Everything in Pro, plus:" items={LIFETIME} accent />
    }
    cta={
      <PlanCta helper={helperText(props)}>
        <BillingButton
          plan="lifetime"
          highlight
          disabled={Boolean(props.unavailable) || props.pro}
        >
          {props.pro ? "Pro access active" : `Own it for ${props.offer.price}`}
        </BillingButton>
      </PlanCta>
    }
  />
);
