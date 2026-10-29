import Link from "next/link";

import { CodeBlockCommand } from "@/components/code-block-command";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

const INSTALL = `npx shadcn@latest add ${SITE.REGISTRY}/caption-highlight`;

export const Hero = () => (
  <section
    aria-labelledby="hero-title"
    className="container-page flex flex-col items-center pt-16 pb-16 text-center md:pt-24 md:pb-24"
  >
    <h1
      id="hero-title"
      className="max-w-3xl text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-balance md:text-6xl"
    >
      {SITE.DESCRIPTION.SHORT}.
    </h1>
    <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 text-pretty md:text-lg">
      Beautifully designed, customizable video components for React. Built on
      Editframe, installed with the shadcn CLI, rendered to MP4.
    </p>
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <Button
        nativeButton={false}
        render={<Link href={ROUTES.COMPONENTS} />}
        size="lg"
        variant="secondary"
        className="rounded-full"
      >
        Browse components
      </Button>
      <Button
        nativeButton={false}
        render={<Link href={ROUTES.PRICING} />}
        size="lg"
        variant="gradient"
        className="rounded-full"
      >
        Get Pro
      </Button>
    </div>
    <CodeBlockCommand
      className="mt-10 w-full max-w-md text-left"
      __npm__={INSTALL}
      __pnpm__={INSTALL.replace("npx", "pnpm dlx")}
      __yarn__={INSTALL.replace("npx", "yarn dlx")}
      __bun__={INSTALL.replace("npx", "bunx --bun")}
    />
  </section>
);
