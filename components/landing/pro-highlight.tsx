"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CatalogPreview } from "@/components/catalog-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { ROUTES } from "@/constants/routes";
import { PRO_COUNT } from "@/lib/catalog";

const NODE_REVEAL = `${ROUTES.COMPONENTS}/compositions/node-reveal`;

const FEATURES = [
  `Full source for all ${PRO_COUNT} Pro components`,
  "Every future Pro component",
  "CLI install with your Pro API key",
  "Personal and client projects",
];

export const ProHighlight = () => {
  const [active, setActive] = useState(false);

  return (
    <section
      aria-labelledby="pro-title"
      className="container-page py-16 md:py-24"
    >
      <Frame className="grid gap-0.5 md:grid-cols-[1fr_1.2fr]">
        <FrameContent className="p-6 md:p-8">
          <Badge variant="outline" className="rounded-md">
            framecn Pro
          </Badge>
          <h2
            id="pro-title"
            className="mt-4 text-3xl font-medium tracking-[-0.04em] text-balance md:text-4xl"
          >
            Compositions, ready to ship.
          </h2>
          <p className="text-muted-foreground mt-3 text-[15px] leading-7 text-pretty">
            Node Reveal splits a wordmark apart as a design node scales up
            between the two words. Swap in your brand and render.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2">
                <CheckIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Button
              nativeButton={false}
              render={<Link href={ROUTES.PRICING} />}
              variant="gradient"
              className="rounded-full"
            >
              Get Pro
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={NODE_REVEAL} />}
              variant="ghost"
              className="rounded-full"
            >
              Preview Node Reveal
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-xs">
            From $179 a year, or $249 once for lifetime access. Early birds pay
            $149 or $199.
          </p>
        </FrameContent>
        <Link
          href={NODE_REVEAL}
          aria-label="Open Node Reveal"
          onPointerEnter={() => setActive(true)}
          onPointerLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className="bg-card focus-visible:ring-ring block self-stretch overflow-hidden rounded-[var(--frame-inner-radius)] border outline-none focus-visible:ring-2 md:flex md:items-center"
        >
          <div className="w-full">
            <CatalogPreview name="node-reveal" active={active} />
          </div>
        </Link>
      </Frame>
    </section>
  );
};
