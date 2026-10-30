import Image from "next/image";

import { sponsorsFor } from "@/lib/sponsors";
import type { SponsorTierSlug } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

/** Logo size follows the tier: Diamond is the largest. */
const LOGO_HEIGHT: Record<SponsorTierSlug, string> = {
  diamond: "h-10",
  gold: "h-7",
  silver: "h-6",
};

/** Homepage sponsor placement (Diamond and Gold); hidden until someone takes it. */
export const BackedBy = () => {
  const sponsors = sponsorsFor("home");
  if (sponsors.length === 0) {
    return null;
  }
  return (
    <section
      aria-labelledby="backed-by-title"
      className="container-page flex flex-col items-center pb-8 text-center"
    >
      <h2
        id="backed-by-title"
        className="text-muted-foreground text-xs tracking-wide uppercase"
      >
        Backed by
      </h2>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {sponsors.map((sponsor) => (
          <li key={sponsor.name}>
            <a
              href={sponsor.href}
              target="_blank"
              rel="noopener sponsored"
              className="block opacity-80 transition-opacity hover:opacity-100"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={40}
                className={cn("w-auto", LOGO_HEIGHT[sponsor.tier])}
                unoptimized
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
