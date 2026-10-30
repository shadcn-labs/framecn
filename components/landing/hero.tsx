import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export const Hero = () => (
  <section
    aria-labelledby="hero-title"
    className="container-page flex flex-col items-center pt-8 text-center md:pt-16"
  >
    <h1 id="hero-title" className="heading-display max-w-3xl">
      {SITE.DESCRIPTION.SHORT}.
    </h1>
    <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 text-pretty md:text-lg">
      Ready-to-use, customizable components for React.{" "}
      <br className="hidden sm:block" />
      Built with Editframe. Distributed via shadcn.
    </p>
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <Button
        nativeButton={false}
        render={<Link href={ROUTES.COMPONENTS} />}
        variant="secondary"
        className="rounded-full"
      >
        Browse components
      </Button>
      <Button
        nativeButton={false}
        render={<Link href={ROUTES.PRICING} />}
        variant="gradient"
        className="rounded-full"
      >
        Get Pro
      </Button>
    </div>
  </section>
);
