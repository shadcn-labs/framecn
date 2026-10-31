import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";

import { BrandAssetCard } from "@/components/brand-asset-card";
import { LogoMark } from "@/components/logo";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Frame, FrameContent } from "@/components/ui/frame";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description: `Logos, colors, and type for ${SITE.NAME} and Shadcn Labs.`,
  path: ROUTES.BRAND,
  title: "Brand",
});

const BRAND_GUIDELINES = `${LINK.SHADCN_LABS}/brand`;
const BRAND_ZIP = `${LINK.SHADCN_LABS}/shadcn-labs-brand.zip`;

const PALETTE = [
  { dark: "#1c1a12", light: "#f5f4ef", name: "Background" },
  { dark: "#f5f4ef", light: "#111111", name: "Foreground" },
  { dark: "#f06292", light: "#f06292", name: "Primary" },
  { dark: "#333333", light: "#e5e5e5", name: "Border" },
];

const linkClass =
  "text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground";

const BrandPage = () => (
  <>
    <BreadcrumbJsonLd
      items={[
        { name: "Home", path: ROUTES.HOME },
        { name: "Brand", path: ROUTES.BRAND },
      ]}
    />
    <PageTransition>
      <article className="page-y mx-auto w-full max-w-3xl px-6">
        <PageHeader
          title={`${SITE.NAME} brand assets.`}
          description={
            <>
              {SITE.NAME} is a Shadcn Labs project and uses the Shadcn Labs
              identity. Grab the logos below, and follow the{" "}
              <a
                href={BRAND_GUIDELINES}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Shadcn Labs brand guidelines
              </a>{" "}
              for anything not covered here.
            </>
          }
        >
          <Button
            nativeButton={false}
            render={
              <a
                href={BRAND_ZIP}
                aria-label="Download all assets"
                download
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <DownloadIcon />
            Download all assets
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={
              <a
                href={BRAND_GUIDELINES}
                aria-label="Brand guidelines"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Brand guidelines
            <ArrowUpRightIcon />
          </Button>
        </PageHeader>

        <h2 className="heading-subtitle mt-12">Logos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <BrandAssetCard asset="logomark" />
          <BrandAssetCard asset="logotype" />
        </div>

        <h2 className="heading-subtitle mt-12">Project lockup</h2>
        <p className="text-muted-foreground mt-3 text-[15px] leading-7">
          The project logo format uses the mark at 1x height with a 1x (10px)
          gap, followed by the project name in Geist Medium at -3% letter
          spacing. Total height is 7x.
        </p>
        <Frame className="mt-4">
          <Card className="items-center justify-center rounded-[var(--frame-inner-radius)] py-12 shadow-none">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-7" />
              <span className="text-[28px] leading-none font-medium tracking-[-0.03em]">
                {SITE.NAME}
              </span>
            </div>
          </Card>
        </Frame>

        <h2 className="heading-subtitle mt-12">Colors</h2>
        <p className="text-muted-foreground mt-3 text-[15px] leading-7">
          Each color has a light and a dark value. Primary pink is an accent:
          use it once, for the thing that matters most.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PALETTE.map((color) => (
            <Frame key={color.name}>
              <FrameContent className="flex h-24 overflow-hidden">
                <div
                  className="flex-1"
                  style={{ backgroundColor: color.light }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: color.dark }}
                />
              </FrameContent>
              <div className="px-2.5 pt-2 pb-1.5">
                <p className="text-sm font-medium">{color.name}</p>
                <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                  {color.light === color.dark
                    ? color.light
                    : `${color.light} / ${color.dark}`}
                </p>
              </div>
            </Frame>
          ))}
        </div>

        <h2 className="heading-subtitle mt-12">Typography</h2>
        <Frame className="mt-4">
          <Card className="gap-2 rounded-[var(--frame-inner-radius)] px-6 shadow-none">
            <p className="text-3xl font-medium tracking-[-0.03em]">
              Beautiful videos, made simple
            </p>
            <p className="text-muted-foreground text-sm">
              Geist Medium with -3% letter spacing.
            </p>
          </Card>
        </Frame>

        <p className="text-muted-foreground mt-14 text-sm leading-6">
          Please don&apos;t alter, rotate, or recolor the logos beyond the
          palette above, and don&apos;t use them in a way that suggests
          endorsement. Shadcn Labs is not endorsed by or affiliated with shadcn.
        </p>
      </article>
    </PageTransition>
  </>
);
export default BrandPage;
