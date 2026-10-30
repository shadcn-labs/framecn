import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { LINK } from "@/constants/links";
import { LABS_NAV_SECTIONS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { SITE, UTM_PARAMS } from "@/constants/site";
import { CATALOG } from "@/lib/catalog";
import { addQueryParams } from "@/lib/url";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description:
    "About framecn — open-source video components for React, built on Editframe and made by Shadcn Labs.",
  path: ROUTES.ABOUT,
  title: "About",
});

const projectCount = LABS_NAV_SECTIONS.reduce(
  (total, section) => total + section.items.length,
  0
);

const TEAM = [
  { href: LINK.PORTFOLIO, name: "Aniket Pawar", role: "Founder" },
  {
    href: "https://www.indrabuildswebsites.com",
    name: "Indranil Maiti",
    role: `Maintainer of ${SITE.NAME}`,
  },
  {
    href: "https://remvze.com",
    name: "Maze",
    role: "Logo and Graphic Designer",
  },
];

export default function AboutPage() {
  const free = CATALOG.filter((item) => !item.pro).length;
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: ROUTES.HOME },
          { name: "About", path: ROUTES.ABOUT },
        ]}
      />
      <PageTransition>
        <article className="page-y mx-auto w-full max-w-2xl px-6">
          <PageHeader title={`${SITE.DESCRIPTION.SHORT}.`} />
          <div className="typeset typeset-site mt-8">
            <p>
              {SITE.NAME} is a collection of beautifully designed, customizable
              video components for React. Animated text, captions, carousels, 3D
              globes, charts, and complete compositions you can preview in the
              browser, tweak with live controls, and drop into your project with
              the shadcn CLI.
            </p>
            <p>
              Every component is real React code built on{" "}
              <a
                href={addQueryParams(LINK.EDITFRAME, UTM_PARAMS)}
                target="_blank"
                rel="noopener"
              >
                Editframe
              </a>
              , so the same composition renders frame-accurately to MP4. Nothing
              is locked inside a black box — you own the source.
            </p>

            <dl className="not-typeset mt-10 grid grid-cols-3 divide-x rounded-xl border">
              {[
                [String(free), "Free components"],
                [String(CATALOG.length - free), "Pro components"],
                ["MIT", "License"],
              ].map(([value, label]) => (
                <div key={label} className="p-4">
                  <dt className="text-muted-foreground text-xs">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <h2>Free and Pro</h2>
            <p>
              The component library is open source and stays free. framecn Pro
              adds complete, production-ready compositions and installs them
              through an authenticated shadcn registry with your personal API
              key. <Link href={ROUTES.PRICING}>See pricing</Link>.
            </p>

            <h2>Shadcn Labs</h2>
            <p>
              At Shadcn Labs, we create open-source tools that extend
              what&apos;s possible with the shadcn/ui ecosystem.
            </p>
            <p>
              We&apos;re an independent org exploring new primitives for
              developers and AI agents to build on — from terminal UIs and
              shaders to email, PDF, editors, and beyond. Everything we make is
              free, open source, and shaped by the community.
            </p>
            <p>
              {SITE.NAME} is part of{" "}
              <a
                href={addQueryParams("https://shadcn-labs.com", UTM_PARAMS)}
                target="_blank"
                rel="noopener"
              >
                Shadcn Labs
              </a>
              , a family of {projectCount}+ open-source registries, templates,
              and skills for the shadcn ecosystem. Open the project switcher
              next to the logo in the sidebar to explore them.
            </p>
            <p>
              Made by{" "}
              <a
                href={addQueryParams(LINK.PORTFOLIO, UTM_PARAMS)}
                target="_blank"
                rel="noopener"
              >
                {SITE.AUTHOR.NAME}
              </a>
              . Follow along on{" "}
              <a href={LINK.X} target="_blank" rel="noopener">
                X
              </a>
              , join the{" "}
              <a href={LINK.DISCORD} target="_blank" rel="noopener">
                Discord
              </a>
              , or read the code on{" "}
              <a href={LINK.GITHUB} target="_blank" rel="noopener">
                GitHub
              </a>
              .
            </p>

            <h2>Team</h2>
            <ul className="not-typeset mt-4 divide-y rounded-xl border">
              {TEAM.map((member) => (
                <li
                  key={member.name}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 text-[15px]"
                >
                  <a
                    href={addQueryParams(member.href, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener"
                    className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {member.name}
                  </a>
                  <span className="text-muted-foreground text-right text-sm">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm">
              Building from Mumbai, India for the world. Not endorsed by or
              affiliated with shadcn.
            </p>

            <h2>Support the project</h2>
            <p>
              If {SITE.NAME} helps you ship, consider{" "}
              <Link href={ROUTES.SPONSOR}>sponsoring</Link> or starring the
              repository. It keeps new components coming.
            </p>
          </div>
        </article>
      </PageTransition>
    </>
  );
}
