import {
  ArrowUpRightIcon,
  CircleCheckIcon,
  HeartIcon,
  HouseIcon,
  LayoutPanelLeftIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ExternalLinkButton } from "@/components/external-link-button";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { FeatureList } from "@/components/pricing/feature-list";
import { PlanCard, PlanPrice } from "@/components/pricing/plan-card";
import { TrafficChart } from "@/components/traffic-chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { CATALOG } from "@/lib/catalog";
import { getStargazerCount } from "@/lib/github";
import {
  ONE_TIME_SPONSOR_TIERS,
  PLACEMENTS,
  SPONSOR_TIERS,
  INDIVIDUAL_SPONSORS,
  PLACED_SPONSORS,
} from "@/lib/sponsors";
import type { PlacementSlug, SponsorTierSlug } from "@/lib/sponsors";
import { cn } from "@/lib/utils";
import { getTraffic } from "@/lib/vercel-analytics";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  description:
    "Put your logo in front of React developers making video with code. framecn traffic for the last 30 days, sponsor placements, and GitHub Sponsors tiers.",
  path: ROUTES.SPONSOR,
  title: "Sponsor",
});

// Traffic is cached by the analytics fetch; re-render at most hourly.
export const revalidate = 3600;

const compact = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const PLACEMENT_ICON: Record<PlacementSlug, LucideIcon> = {
  home: HouseIcon,
  listing: UsersIcon,
  sidebar: LayoutPanelLeftIcon,
};

/** Higher tiers get taller spots and larger logos. */
const SPOT_HEIGHT: Record<SponsorTierSlug, string> = {
  bronze: "h-20",
  gold: "h-28",
  silver: "h-24",
};
const LOGO_HEIGHT: Record<SponsorTierSlug, string> = {
  bronze: "max-h-7",
  gold: "max-h-12",
  silver: "max-h-9",
};

const tiersWith = (placement: PlacementSlug) =>
  SPONSOR_TIERS.filter((tier) =>
    (tier.placements as readonly PlacementSlug[]).includes(placement)
  );

const FAQ = [
  {
    answer:
      "Gold: the sidebar outside Carbon ad pages, plus the largest logo on the homepage, this page and the GitHub README. Silver: a logo on the homepage, this page and the README. Bronze: a logo on this page and the README. Docs and component pages stay ad-free apart from Carbon.",
    question: "Where will my logo appear?",
  },
  {
    answer:
      "After you sponsor on GitHub, email us a logo (SVG preferred, works on light and dark) and the link you want. It goes live within a few days and stays up while the sponsorship is active.",
    question: "What do you need from me?",
  },
  {
    answer:
      "No. GitHub sponsorship and framecn Pro are separate; sponsoring doesn't unlock Pro source.",
    question: "Does sponsorship include framecn Pro?",
  },
  {
    answer:
      "Yes: Coffee ($10) or Dinner ($100) once, or any custom amount on GitHub. One-time support doesn't include a placement.",
    question: "Can I give once instead?",
  },
  {
    answer:
      "Payments run through GitHub Sponsors. Change or cancel from your GitHub account; the placement comes down at the end of the paid month.",
    question: "How do I change or cancel?",
  },
];

/** A tiny sketch of where the placement sits. */
const PlacementPreview = ({ slug }: { slug: PlacementSlug }) => {
  const logo = (
    <span className="border-brand/50 bg-brand/10 text-brand flex h-6 items-center justify-center rounded border border-dashed text-[9px] font-medium tracking-wide uppercase">
      Your logo
    </span>
  );
  if (slug === "sidebar") {
    return (
      <div className="flex h-28 gap-2">
        <div className="bg-muted/60 flex w-24 flex-col gap-1.5 rounded-md p-2">
          {[60, 75, 50, 65].map((width) => (
            <span
              key={width}
              className="bg-border h-1.5 rounded-full"
              style={{ width: `${width}%` }}
            />
          ))}
          <span className="mt-auto">{logo}</span>
        </div>
        <div className="bg-muted/30 flex-1 rounded-md" />
      </div>
    );
  }
  if (slug === "home") {
    return (
      <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-md bg-muted/30 p-2">
        <span className="bg-border h-2 w-2/3 rounded-full" />
        <span className="bg-border h-1.5 w-1/2 rounded-full" />
        <span className="text-muted-foreground mt-2 text-[8px] tracking-wide uppercase">
          Backed by
        </span>
        <span className="w-20">{logo}</span>
      </div>
    );
  }
  return (
    <div className="grid h-28 grid-cols-3 content-center gap-2">
      {logo}
      <span className="bg-muted/60 h-6 rounded" />
      <span className="bg-muted/60 h-6 rounded" />
      <span className="bg-muted/60 h-6 rounded" />
      {logo}
      <span className="bg-muted/60 h-6 rounded" />
    </div>
  );
};

export default async function SponsorPage() {
  const [traffic, stars] = await Promise.all([
    getTraffic(),
    getStargazerCount(),
  ]);
  const analyticsConfigured = Boolean(
    process.env.VERCEL_ANALYTICS_TOKEN &&
    process.env.VERCEL_PROJECT_ID &&
    process.env.VERCEL_ANALYTICS_TEAM_ID
  );
  const stats = [
    {
      label: "Page views last month",
      value: traffic ? compact.format(traffic.pageviews) : null,
    },
    { label: "GitHub stars", value: stars > 0 ? compact.format(stars) : null },
    {
      label: "Components",
      value: `${Math.floor(CATALOG.length / 10) * 10}+`,
    },
  ];

  return (
    <PageTransition>
      <article className="container-page page-y">
        <PageHeader
          centered
          title="Sponsor framecn"
          description="Put your logo in front of React developers who make product videos, captions and motion with code."
        >
          <Button
            nativeButton={false}
            render={<Link href="#plans" />}
            variant="gradient"
            className="rounded-full"
          >
            See plans
          </Button>
          <ExternalLinkButton
            href={LINK.SPONSOR}
            variant="secondary"
            className="rounded-full"
          >
            <HeartIcon aria-hidden />
            GitHub Sponsors
          </ExternalLinkButton>
        </PageHeader>

        <section aria-labelledby="audience-title" className="mt-16">
          <h2 id="audience-title" className="heading-subtitle text-center">
            Audience
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Frame key={stat.label}>
                <FrameContent className="p-5">
                  <dt className="text-muted-foreground text-sm">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-mono text-3xl font-medium tracking-tight tabular-nums">
                    {stat.value ?? "Unavailable"}
                  </dd>
                </FrameContent>
              </Frame>
            ))}
          </dl>
          <Frame className="mt-4">
            <FrameContent className="min-w-0 p-5">
              {traffic ? (
                <TrafficChart traffic={traffic} />
              ) : (
                <p className="text-muted-foreground py-12 text-center text-sm">
                  {analyticsConfigured
                    ? "Traffic data is temporarily unavailable."
                    : "Traffic analytics are not configured yet."}
                </p>
              )}
            </FrameContent>
          </Frame>
          <p className="text-muted-foreground mt-3 text-center text-xs">
            {traffic
              ? "Traffic over the last 30 days from Vercel Web Analytics, our analytics platform. Updated hourly."
              : analyticsConfigured
                ? "Traffic from Vercel Web Analytics, our analytics platform, is temporarily unavailable. Updates are requested hourly."
                : "Page views and the traffic chart will appear once Vercel Web Analytics, our analytics platform, is configured."}
          </p>
        </section>

        <section aria-labelledby="placements-title" className="mt-16">
          <h2 id="placements-title" className="heading-subtitle text-center">
            Placements
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {PLACEMENTS.map((placement) => {
              const Icon = PLACEMENT_ICON[placement.slug];
              return (
                <Frame key={placement.slug} render={<li />} className="flex">
                  <FrameContent className="flex flex-1 flex-col p-5">
                    <PlacementPreview slug={placement.slug} />
                    <h3 className="mt-5 flex items-center gap-2 text-base font-medium">
                      <Icon
                        aria-hidden
                        className="text-muted-foreground size-4"
                      />
                      {placement.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-sm text-pretty">
                      {placement.description}
                    </p>
                    <div className="mt-auto flex gap-1.5 pt-4">
                      {tiersWith(placement.slug).map((tier) => (
                        <Badge
                          key={tier.slug}
                          variant={tier.slug === "gold" ? "brand" : "secondary"}
                        >
                          {tier.name}
                        </Badge>
                      ))}
                    </div>
                  </FrameContent>
                </Frame>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="sponsors-title" className="mt-16">
          <h2 id="sponsors-title" className="heading-subtitle text-center">
            Sponsors
          </h2>
          <div className="mt-6 grid w-full gap-4">
            {SPONSOR_TIERS.map((tier) => {
              const placed = PLACED_SPONSORS.filter(
                (sponsor) => sponsor.tier === tier.slug
              );
              return (
                <div key={tier.slug} className="grid gap-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-6">
                  <h3 className="text-center text-base font-medium sm:text-left">
                    {tier.name}
                  </h3>
                  <ul className="grid min-w-0 gap-3">
                    {placed.map((sponsor) => (
                      <li key={sponsor.name}>
                        <a
                          href={sponsor.href}
                          target="_blank"
                          rel="noopener sponsored"
                          title={sponsor.name}
                          className={cn(
                            "bg-card hover:border-foreground/20 flex items-center justify-center rounded-xl border p-4 transition-colors",
                            SPOT_HEIGHT[tier.slug]
                          )}
                        >
                          <Image
                            src={sponsor.logo}
                            alt={sponsor.name}
                            width={200}
                            height={48}
                            className={cn(
                              "w-auto max-w-full object-contain",
                              LOGO_HEIGHT[tier.slug]
                            )}
                            unoptimized
                          />
                        </a>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="#plans"
                        aria-label={`Take this spot: become a ${tier.name} sponsor`}
                        className={cn(
                          "group text-muted-foreground hover:text-foreground hover:border-foreground/30 focus-visible:border-foreground/30 flex items-center justify-center rounded-xl border border-dashed text-sm transition-colors",
                          SPOT_HEIGHT[tier.slug]
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5 group-hover:hidden group-focus-visible:hidden">
                          Your logo here
                          <PlusIcon aria-hidden className="size-3.5" />
                        </span>
                        <span className="hidden items-center gap-1.5 group-hover:inline-flex group-focus-visible:inline-flex">
                          Take this spot
                          <HeartIcon
                            aria-hidden
                            className="fill-brand text-brand size-3.5"
                          />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              );
            })}
            <div className="grid gap-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-6">
              <h3 className="text-center text-base font-medium whitespace-nowrap sm:text-left">
                Individual sponsors
              </h3>
              <ul className="flex min-w-0 flex-nowrap justify-start gap-2 overflow-x-auto">
                {INDIVIDUAL_SPONSORS.map((sponsor) => (
                  <li key={sponsor.login} className="shrink-0">
                    <a
                      href={`https://github.com/${sponsor.login}`}
                      target="_blank"
                      rel="noopener"
                      className="bg-card hover:border-foreground/20 flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm whitespace-nowrap transition-colors"
                    >
                      <Image
                        src={sponsor.avatar}
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 rounded-full"
                        unoptimized
                      />
                      @{sponsor.login}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="plans"
          aria-labelledby="plans-title"
          className="mt-16 scroll-mt-20"
        >
          <h2 id="plans-title" className="heading-subtitle text-center">
            Plans
          </h2>
          <div className="mt-6 grid gap-x-4 gap-y-0 lg:grid-cols-3 lg:*:mb-0">
            {SPONSOR_TIERS.map((tier) => (
              <PlanCard
                key={tier.slug}
                name={tier.name}
                highlight={tier.slug === "gold"}
                badge="Most impact"
                price={
                  <PlanPrice price={`$${tier.price}`} interval="/ month" />
                }
                features={
                  <FeatureList
                    accent={tier.slug === "gold"}
                    items={tier.perks.map((label) => ({
                      icon: CircleCheckIcon,
                      label,
                    }))}
                  />
                }
                cta={
                  <ExternalLinkButton
                    href={`${LINK.SPONSOR}/sponsorships?tier_id=${tier.tierId}`}
                    variant={tier.slug === "gold" ? "gradient" : "secondary"}
                    className="w-full"
                  >
                    Choose {tier.name} <ArrowUpRightIcon aria-hidden />
                  </ExternalLinkButton>
                }
              />
            ))}
          </div>

          {/* One-time support sits with the plans: no placement, no heading. */}
          <Frame className="mt-4">
            <FrameContent className="flex flex-row flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm">
                Prefer a one-time thank-you?{" "}
                <span className="text-muted-foreground">
                  No subscription, no placement.
                </span>
              </p>
              <div className="flex gap-2">
                {ONE_TIME_SPONSOR_TIERS.map((tier) => (
                  <ExternalLinkButton
                    key={tier.tierId}
                    href={`${LINK.SPONSOR}/sponsorships?tier_id=${tier.tierId}`}
                    variant="secondary"
                    size="sm"
                  >
                    {tier.name} · ${tier.price}
                  </ExternalLinkButton>
                ))}
              </div>
            </FrameContent>
          </Frame>
        </section>

        <section
          aria-labelledby="faq-title"
          className="mx-auto mt-16 max-w-3xl"
        >
          <h2 id="faq-title" className="heading-subtitle text-center">
            FAQs
          </h2>
          <Accordion className="mt-6">
            {FAQ.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </article>
    </PageTransition>
  );
}
