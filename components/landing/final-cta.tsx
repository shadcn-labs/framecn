import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { ROUTES } from "@/constants/routes";

export const FinalCta = () => (
  <section
    aria-labelledby="cta-title"
    className="container-page pt-8 pb-16 md:pb-24"
  >
    <Frame>
      <FrameContent className="flex flex-col items-center px-6 py-14 text-center md:py-20">
        <h2
          id="cta-title"
          className="max-w-xl text-3xl font-medium tracking-[-0.04em] text-balance md:text-4xl"
        >
          Make your next video in code.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md text-[15px] leading-7 text-pretty">
          Pick a component, tune it in the browser, and install it with one
          command.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            nativeButton={false}
            render={<Link href={ROUTES.COMPONENTS} />}
            size="lg"
            className="rounded-full"
          >
            Browse components
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={ROUTES.DOCS} />}
            size="lg"
            variant="outline"
            className="rounded-full"
          >
            Read the docs
          </Button>
        </div>
      </FrameContent>
    </Frame>
  </section>
);
