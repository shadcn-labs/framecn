import Link from "next/link";

import { BillingButton } from "@/components/billing-button";
import {
  FreeCard,
  LifetimeCard,
  ProCard,
} from "@/components/pricing/plan-cards";
import { TeamPlan } from "@/components/pricing/team-plan";
import { WhatYouGet } from "@/components/pricing/what-you-get";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Frame } from "@/components/ui/frame";
import { getProAccess, getSession } from "@/lib/auth";
import {
  billingCustomerId,
  getBillingConfigurationError,
  getPlanOffers,
  missingPlanProduct,
} from "@/lib/billing";
import { CATALOG, PRO_COUNT } from "@/lib/catalog";
import { formatUsd, TEAM, teamPrice } from "@/lib/plans";
import type { PlanSlug } from "@/lib/plans";
import { FaqJsonLd } from "@/seo/json-ld";

export const metadata = {
  description: `framecn is free to use. Pro is $179 a year or $249 lifetime, with early-bird pricing of $149 a year or $199 lifetime for the first 50 buyers. Team is a one-time license for ${TEAM.minSeats} to ${TEAM.maxSeats} seats, ${formatUsd(teamPrice(TEAM.defaultSeats))} for ${TEAM.defaultSeats}.`,
  title: "Pricing — framecn",
};

const FAQ = [
  {
    answer: `The source. Every Pro component as the file it was built from, installed into components/framecn with the shadcn CLI, plus the live customizer and a Copy prompt for your agent. Right now that's ${PRO_COUNT} Pro components across text, carousels, globes, collages, charts, scroll animations and full compositions.`,
    question: "What am I actually buying?",
  },
  {
    answer:
      "Yes. Every Pro component has a live preview and customizer on its page, free and without an account. Tweak it until it's right; pay when you want the source.",
    question: "Can I try it before I buy?",
  },
  {
    answer:
      "Pro if you have one launch in sight. Lifetime if you'll make more than one video, ever. Lifetime costs less than two years of Pro and includes everything we ship after.",
    question: "Pro or Lifetime?",
  },
  {
    answer: `A seat is a person. Team is a ${formatUsd(TEAM.basePrice)} license plus ${formatUsd(TEAM.seatPrice)} a seat, ${TEAM.minSeats} to ${TEAM.maxSeats} seats, paid once. Everyone shares one team API key, usually stored in CI or your env. Over ${TEAM.maxSeats} people? Contact sales and we'll quote it.`,
    question: "How do team seats work?",
  },
  {
    answer:
      "A React project with Editframe set up and the shadcn CLI. Components are built on @editframe/react and render to MP4 with the Editframe CLI or cloud.",
    question: "What do I need installed?",
  },
  {
    answer:
      "Yes, on every plan. Free components are MIT. Pro covers commercial work and projects you build for clients.",
    question: "Can I use it for client work?",
  },
  {
    answer:
      "Dodo Payments is our merchant of record: they handle checkout, invoices, sales tax and VAT. Refunds follow our refund policy, and Pro can be cancelled anytime from billing.",
    question: "Who handles billing, tax and refunds?",
  },
  {
    answer:
      "Your videos keep rendering. Installed components are plain source files in your repo, so there's nothing to switch off.",
    question: "What happens to my videos if framecn goes away?",
  },
];

const PricingPage = async () => {
  const session = await getSession();
  const pro = await getProAccess();
  const customer = session?.user.emailVerified
    ? await billingCustomerId(session.user.email)
    : null;
  const configurationError = getBillingConfigurationError();
  const offers = await getPlanOffers();
  // Billing-wide problems hide behind disabled buttons; a missing product is called out.
  const unavailable = (slug: PlanSlug) => {
    if (configurationError) {
      return "Checkout isn't configured yet.";
    }
    return missingPlanProduct(slug)
      ? "This plan's Dodo product is not configured."
      : null;
  };

  return (
    <div className="flex flex-col">
      <FaqJsonLd items={FAQ} />
      <section className="container-page pt-8 md:pt-16">
        <h1 className="heading-display mx-auto max-w-3xl text-center">
          Don&rsquo;t let your next launch video look like{" "}
          <span className="chromatic whitespace-nowrap">
            AI slop
            <span aria-hidden data-chroma="r">
              AI slop
            </span>
            <span aria-hidden data-chroma="c">
              AI slop
            </span>
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-center text-base leading-7 text-pretty md:text-lg">
          Start with {CATALOG.length - PRO_COUNT} free components, yours
          forever. Pro is every other shot in the edit: paid once or yearly, and
          the source is yours.
        </p>
        {pro ? (
          <Frame className="mx-auto mt-10 max-w-xl">
            <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-[var(--frame-inner-radius)] border p-4">
              <div>
                <p className="font-medium">
                  You&apos;re Pro. Go make something.
                </p>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground text-sm underline underline-offset-4"
                >
                  Get your API key →
                </Link>
              </div>
              {customer ? (
                <div className="w-full sm:w-44">
                  <BillingButton variant="outline">
                    Manage billing
                  </BillingButton>
                </div>
              ) : null}
            </div>
          </Frame>
        ) : null}
        <div
          id="plans"
          className="mt-12 grid scroll-mt-16 gap-x-4 gap-y-0 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FreeCard />
          <ProCard
            offer={offers.annual}
            pro={pro}
            unavailable={unavailable("annual")}
          />
          <LifetimeCard
            offer={offers.lifetime}
            pro={pro}
            unavailable={unavailable("lifetime")}
          />
          <TeamPlan unavailable={unavailable("team")} pro={pro} />
        </div>
        {customer && !pro ? (
          <div className="mx-auto mt-6 max-w-xs">
            <BillingButton variant="outline">
              Manage existing billing
            </BillingButton>
          </div>
        ) : null}
      </section>
      <WhatYouGet proCount={PRO_COUNT} />
      <section aria-labelledby="faq-title" className="container-page section-y">
        <h2 id="faq-title" className="heading-title text-center">
          FAQs
        </h2>
        <Accordion className="mx-auto mt-10 w-full max-w-3xl">
          {FAQ.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};
export default PricingPage;
