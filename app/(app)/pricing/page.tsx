import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";

import { BillingButton } from "@/components/billing-button";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Frame } from "@/components/ui/frame";
import { getProAccess, getSession } from "@/lib/auth";
import {
  billingCustomerId,
  getBillingConfigurationError,
  getPlanOffers,
} from "@/lib/billing";
import { EARLY_BIRD_LIMIT, PLANS } from "@/lib/plans";
import type { PlanSlug } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata = {
  description:
    "framecn is free to use. Pro is $179 a year or $249 lifetime, with early-bird pricing of $149 a year or $200 lifetime for the first 50 buyers. Team is $499 lifetime for up to 10 people.",
  title: "Pricing — framecn",
};

const FREE_FEATURES = [
  "All free components: typography, transitions, captions",
  "Install with the shadcn CLI",
  "MIT license",
  "Customization controls",
  "Copy prompt & AI-ready docs",
];

const PLAN_FEATURES: Record<PlanSlug, { heading: string; items: string[] }> = {
  annual: {
    heading: "Everything in Free",
    items: [
      "Node Reveal composition source",
      "Future Pro compositions while subscribed",
      "CLI install with your Pro API key",
      "Personal & client projects",
    ],
  },
  lifetime: {
    heading: "Everything in Pro Annual",
    items: [
      "Pro access that never expires",
      "All future Pro compositions",
      "No renewals",
    ],
  },
  team: {
    heading: "Everything in Lifetime",
    items: [
      "Covers up to 10 team members",
      "Shared team API key for CI & env",
      "One invoice for the whole team",
    ],
  },
};

const FAQ = [
  {
    a: "Every typography, transition, and caption component is free under the MIT license. Install them with the shadcn CLI, customize them, and use the copy prompt and AI-ready docs — no account needed.",
    q: "What's free?",
  },
  {
    a: "Pro unlocks the Node Reveal composition source today, plus future Pro compositions as they ship. Pro components install through the shadcn CLI using your Pro API key.",
    q: "What does Pro include?",
  },
  {
    a: "Yes. Free and Pro components can be used in personal and commercial work, including projects you build for clients.",
    q: "Can I use framecn in client projects?",
  },
  {
    a: "Team is a one-time, lifetime Pro license for up to 10 people. Your team shares a single Pro API key, typically stored in CI or environment variables. There is no per-seat management or invite system.",
    q: "How does the Team plan work?",
  },
  {
    a: "Checkout, invoices, taxes, and refunds are handled by Dodo Payments, our merchant of record. Manage your subscription or invoices from the billing portal. Access activates only after a verified payment.",
    q: "Who handles billing and refunds?",
  },
  {
    a: "Yes. You can buy Lifetime or Team at any time. If you're on Pro Annual, cancel the subscription from Manage billing so it doesn't renew.",
    q: "Can I upgrade later?",
  },
];

const Feature = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <li className={cn("flex gap-2", className)}>
    <CircleCheckIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
    {children}
  </li>
);

export default async function PricingPage() {
  const session = await getSession();
  const pro = await getProAccess();
  const customer = session?.user.emailVerified
    ? await billingCustomerId(session.user.email)
    : null;
  const configurationError = getBillingConfigurationError();
  const offers = await getPlanOffers();
  return (
    <section className="container-page flex-1 py-12 md:py-16">
      <div className="mb-10">
        <PageHeader title="Pricing" />
      </div>
      {pro ? (
        <Frame className="mb-6">
          <Card className="flex-row flex-wrap items-center justify-between gap-4 rounded-lg p-5 shadow-none">
            <div>
              <p className="font-medium">
                You're a Pro. Make something lovely.
              </p>
              <Link
                href="/components/compositions/node-reveal"
                className="text-muted-foreground text-sm underline underline-offset-4"
              >
                Open Node Reveal →
              </Link>
            </div>
            {customer ? (
              <div className="w-full sm:w-48">
                <BillingButton>Manage billing</BillingButton>
              </div>
            ) : null}
          </Card>
        </Frame>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Frame className="flex">
          <Card className="flex-1 gap-0 rounded-lg p-6 shadow-none">
            <h2 className="font-medium">Free</h2>
            <p className="mt-6">
              <span className="text-4xl font-semibold tracking-tight">$0</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Free forever. No card required.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/components" />}
              variant="outline"
              className="mt-6 w-full"
            >
              Browse components
            </Button>
            <ul className="mt-6 space-y-2.5 text-sm">
              {FREE_FEATURES.map((item) => (
                <Feature key={item}>{item}</Feature>
              ))}
            </ul>
          </Card>
        </Frame>
        {PLANS.map((plan) => {
          const highlight = plan.slug === "lifetime";
          const missingProduct = !process.env[plan.env];
          const offer = offers[plan.slug];
          const features = PLAN_FEATURES[plan.slug];
          return (
            <Frame
              key={plan.slug}
              className={cn(
                "relative flex",
                // Featured plan: pink outer shell, pink-tinted inner card, pink inner border.
                highlight && "border-brand bg-brand/10"
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
                  "flex-1 gap-0 rounded-lg p-6 shadow-none",
                  highlight && "border-brand/40"
                )}
              >
                <h2 className="font-medium">{plan.name}</h2>
                <p className="mt-6 flex items-baseline">
                  <span className="text-4xl font-semibold tracking-tight">
                    {offer.price}
                  </span>
                  {offer.earlyBirdLeft === null ? null : (
                    <s className="text-muted-foreground ml-2 text-lg">
                      {offer.regularPrice}
                    </s>
                  )}
                  <span className="text-muted-foreground ml-1.5 text-sm">
                    {plan.interval}
                  </span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {plan.note}
                </p>
                {offer.earlyBirdLeft === null ? null : (
                  <Badge variant="brand" className="mt-3">
                    Early bird · {offer.earlyBirdLeft} of {EARLY_BIRD_LIMIT}{" "}
                    left
                  </Badge>
                )}
                <div className="mt-6">
                  <BillingButton
                    plan={plan.slug}
                    highlight={highlight}
                    disabled={Boolean(
                      configurationError || missingProduct || pro
                    )}
                  >
                    {pro ? "Pro access active" : `Get ${plan.name}`}
                  </BillingButton>
                  {!configurationError && missingProduct ? (
                    <p className="text-destructive mt-2 text-xs">
                      This plan's Dodo product is not configured.
                    </p>
                  ) : null}
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  <Feature className="font-medium">{features.heading}</Feature>
                  {features.items.map((item) => (
                    <Feature key={item}>{item}</Feature>
                  ))}
                </ul>
              </Card>
            </Frame>
          );
        })}
      </div>
      {customer && !pro ? (
        <div className="mx-auto mt-6 max-w-xs">
          <BillingButton>Manage existing billing</BillingButton>
        </div>
      ) : null}
      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <Accordion className="mt-4">
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
