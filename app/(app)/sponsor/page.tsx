import {
  ArrowUpRightIcon,
  CircleCheckIcon,
  HeartIcon,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";

import { ExternalLinkButton } from "@/components/external-link-button";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Frame, FrameContent } from "@/components/ui/frame";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { CATALOG } from "@/lib/catalog";
import { getStargazerCount } from "@/lib/github";
import {
  ONE_TIME_SPONSOR_TIERS,
  SPONSORS,
  SPONSOR_TIERS,
} from "@/lib/sponsors";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  description:
    "Support framecn through GitHub Sponsors. Meet the audience and current sponsors, compare the published tiers, and choose monthly or one-time support.",
  path: ROUTES.SPONSOR,
  title: "Sponsor",
});

const SECTIONS = [
  { id: "audience", title: "Audience" },
  { id: "placements", title: "Placements" },
  { id: "sponsors", title: "Sponsors" },
  { id: "plans", title: "Plans" },
  { id: "questions", title: "Questions" },
  { id: "faqs", title: "FAQs" },
];

const FAQ = [
  {
    answer:
      "Sponsorship supports Aniket Pawar's ongoing open-source work, including framecn's free caption components, documentation, maintenance, and developer tooling.",
    question: "What does my sponsorship support?",
  },
  {
    answer:
      "No. GitHub sponsorship and framecn Pro are separate. Sponsorship provides the benefits listed on the selected GitHub tier; it does not activate a Pro license or unlock Pro source code.",
    question: "Does sponsorship include framecn Pro?",
  },
  {
    answer:
      "The published monthly tiers include Bronze, Silver, or Gold recognition on the sponsors pages of the maintainer's major projects. Individuals can be represented by their name and avatar; companies can use their name and logo, with a link of their choice. No homepage, README, or sidebar advertising placement is included here.",
    question: "Where will my name or logo appear?",
  },
  {
    answer:
      "Yes. GitHub currently offers a $10 Coffee tier and a $100 Dinner tier, as well as custom amounts. These are one-time contributions, not monthly subscriptions. Sponsor-page recognition is a benefit of the monthly tiers.",
    question: "Can I make a one-time contribution?",
  },
  {
    answer:
      "Payments and sponsorship settings are handled by GitHub Sponsors. Manage your monthly sponsorship, billing, and cancellation from your GitHub account. There is no separate sponsorship checkout on framecn.",
    question: "How do I manage or cancel a sponsorship?",
  },
  {
    answer:
      "Yes. GitHub lets you choose whether your sponsorship is public. Private sponsors are not identified on this page, and public sponsorships are not assigned to a tier here when that information is not public.",
    question: "Can I sponsor privately?",
  },
];

export default async function SponsorPage() {
  const stars = await getStargazerCount();
  const freeComponents = CATALOG.filter((item) => !item.pro).length;
  const audience = [
    ...(stars > 0 ? [{ label: "GitHub stars", value: stars }] : []),
    { label: "Catalog components", value: CATALOG.length },
    { label: "Free caption components", value: freeComponents },
  ];

  return (
    <PageTransition>
      <article className="container-page py-12 md:py-16">
        <PageHeader
          title="Sponsor framecn"
          description="Support the work behind the components, documentation, and tools you use to make video with React."
        >
          <ExternalLinkButton href={LINK.SPONSOR} sound="heart">
            <HeartIcon aria-hidden />
            Sponsor on GitHub
            <ArrowUpRightIcon aria-hidden />
          </ExternalLinkButton>
        </PageHeader>

        <nav
          aria-label="On this page"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <section
          id="audience"
          aria-labelledby="audience-title"
          className="mt-12 scroll-mt-20"
        >
          <h2
            id="audience-title"
            className="text-2xl font-medium tracking-tight"
          >
            Audience
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            React developers building captions, product videos, and motion-rich
            compositions. They discover components in the catalog, install them
            with the shadcn CLI, and customize them in their own projects.
          </p>
          <Frame className="mt-6">
            <FrameContent
              render={<dl />}
              className="grid divide-y overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {audience.map((stat) => (
                <div key={stat.label} className="px-5 py-5">
                  <dt className="text-muted-foreground text-sm">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-mono text-3xl font-medium tabular-nums">
                    {stat.value.toLocaleString("en-US")}
                  </dd>
                </div>
              ))}
            </FrameContent>
          </Frame>
          <p className="text-muted-foreground mt-3 text-xs leading-5">
            Public repository and catalog metrics, not estimated traffic or
            guaranteed advertising reach.
          </p>
        </section>

        <section
          id="placements"
          aria-labelledby="placements-title"
          className="mt-14 scroll-mt-20 border-t pt-10"
        >
          <h2
            id="placements-title"
            className="text-2xl font-medium tracking-tight"
          >
            Placements
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            The monthly tiers currently promise sponsor-page recognition. We
            keep the placement details aligned with the benefits published on
            GitHub.
          </p>
          <Frame className="mt-6">
            <FrameContent className="p-5 sm:p-6">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Sponsor-page listing
              </p>
              <h3 className="mt-2 text-lg font-medium">
                Your name or logo, with a link of your choice
              </h3>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Bronze, Silver, and Gold recognition follows your monthly GitHub
                tier. Individuals can use a name and avatar; companies can use a
                company name and logo. Other placements are not bundled into
                these plans.
              </p>
            </FrameContent>
          </Frame>
        </section>

        <section
          id="sponsors"
          aria-labelledby="sponsors-title"
          className="mt-14 scroll-mt-20 border-t pt-10"
        >
          <h2
            id="sponsors-title"
            className="text-2xl font-medium tracking-tight"
          >
            Sponsors
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Thank you to the public GitHub sponsors supporting Aniket&apos;s
            open-source work. Private sponsors and non-public tier details are
            not shown.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {SPONSORS.map((sponsor) => (
              <Frame key={sponsor.login} render={<li />}>
                <FrameContent className="flex h-full items-center gap-3 p-5">
                  <Image
                    src={sponsor.avatar}
                    alt={`@${sponsor.login}`}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full"
                    unoptimized
                  />
                  <span className="min-w-0 truncate text-sm font-medium">
                    @{sponsor.login}
                  </span>
                </FrameContent>
              </Frame>
            ))}
            <li>
              <a
                href={LINK.SPONSOR}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:border-foreground/30 flex h-full min-h-20 items-center justify-center gap-2 rounded-xl border border-dashed p-5 text-sm transition-colors"
              >
                <PlusIcon className="size-4" aria-hidden />
                Become a sponsor
              </a>
            </li>
          </ul>
          <a
            href={LINK.SPONSOR}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1 text-sm underline underline-offset-4"
          >
            See the latest sponsor list on GitHub{" "}
            <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </a>
        </section>

        <section
          id="plans"
          aria-labelledby="plans-title"
          className="mt-14 scroll-mt-20 border-t pt-10"
        >
          <h2 id="plans-title" className="text-2xl font-medium tracking-tight">
            Plans
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            These are the published GitHub Sponsors tiers. Choose a monthly plan
            or make a one-time contribution. Every sponsorship is completed on
            GitHub.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {SPONSOR_TIERS.map((tier) => (
              <Frame key={tier.slug} className="flex">
                <FrameContent className="flex flex-1 flex-col p-5">
                  <h3 className="font-medium">{tier.name}</h3>
                  <p className="mt-4">
                    <span className="text-3xl font-semibold tracking-tight">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      per month
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {tier.description}
                  </p>
                  <ul className="mt-5 space-y-3 text-sm">
                    {[
                      `${tier.name} sponsor-page recognition`,
                      "Name and avatar, or company logo",
                      "Link to your website or profile",
                    ].map((benefit) => (
                      <li key={benefit} className="flex gap-2">
                        <CircleCheckIcon
                          className="text-muted-foreground mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <ExternalLinkButton
                      href={`${LINK.SPONSOR}/sponsorships?tier_id=${tier.tierId}`}
                      variant="outline"
                      className="w-full"
                    >
                      Choose {tier.name} <ArrowUpRightIcon aria-hidden />
                    </ExternalLinkButton>
                  </div>
                </FrameContent>
              </Frame>
            ))}
          </div>
          <h3 className="mt-8 text-lg font-medium">One-time support</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            A one-time thank-you, without a monthly subscription.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ONE_TIME_SPONSOR_TIERS.map((tier) => (
              <Frame key={tier.tierId}>
                <FrameContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <h4 className="font-medium">{tier.name}</h4>
                    <p className="text-muted-foreground mt-1 text-sm">
                      ${tier.price} once
                    </p>
                  </div>
                  <ExternalLinkButton
                    href={`${LINK.SPONSOR}/sponsorships?tier_id=${tier.tierId}`}
                    variant="outline"
                    size="sm"
                  >
                    Give ${tier.price} <ArrowUpRightIcon aria-hidden />
                  </ExternalLinkButton>
                </FrameContent>
              </Frame>
            ))}
          </div>
        </section>

        <section
          id="questions"
          aria-labelledby="questions-title"
          className="mt-14 scroll-mt-20 border-t pt-10"
        >
          <h2
            id="questions-title"
            className="text-2xl font-medium tracking-tight"
          >
            Questions
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Not sure which tier to choose? Review the current benefits, choose a
            custom amount, and manage your sponsorship directly on GitHub.
            Sponsorship is separate from a framecn Pro purchase.
          </p>
          <ExternalLinkButton
            href={LINK.SPONSOR}
            className="mt-5"
            variant="outline"
          >
            Explore options on GitHub <ArrowUpRightIcon aria-hidden />
          </ExternalLinkButton>
        </section>

        <section
          id="faqs"
          aria-labelledby="faqs-title"
          className="mt-14 scroll-mt-20 border-t pt-10"
        >
          <h2 id="faqs-title" className="text-2xl font-medium tracking-tight">
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
