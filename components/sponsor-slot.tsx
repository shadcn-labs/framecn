import { HeartIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { sponsorsFor } from "@/lib/sponsors";
import type { PlacementSlug } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

/** A sponsor placement: placed logos, or an open "your logo here" spot. */
export const SponsorSlot = ({
  placement,
  className,
}: {
  placement: PlacementSlug;
  className?: string;
}) => {
  const sponsors = sponsorsFor(placement);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
        Sponsored by
      </p>
      {sponsors.length > 0 ? (
        sponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.href}
            target="_blank"
            rel="noopener sponsored"
            className="bg-card hover:border-foreground/20 flex h-12 items-center justify-center rounded-lg border px-3 transition-colors"
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={120}
              height={28}
              className="max-h-7 w-auto object-contain"
              unoptimized
            />
          </a>
        ))
      ) : (
        <Link
          href={`${ROUTES.SPONSOR}#plans`}
          aria-label="Take this spot: become a sponsor"
          className="group/sponsor-slot text-muted-foreground hover:text-foreground hover:border-foreground/30 focus-visible:text-foreground focus-visible:border-foreground/30 flex h-12 items-center justify-center rounded-lg border border-dashed text-xs transition-colors"
        >
          <span className="inline-flex items-center gap-1.5 group-hover/sponsor-slot:hidden group-focus-visible/sponsor-slot:hidden">
            Your logo here
            <PlusIcon aria-hidden className="size-3.5" />
          </span>
          <span className="hidden items-center gap-1.5 group-hover/sponsor-slot:inline-flex group-focus-visible/sponsor-slot:inline-flex">
            Take this spot
            <HeartIcon aria-hidden className="fill-brand text-brand size-3.5" />
          </span>
        </Link>
      )}
    </div>
  );
};
