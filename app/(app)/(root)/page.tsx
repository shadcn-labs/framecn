import { Categories } from "@/components/landing/categories";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProHighlight } from "@/components/landing/pro-highlight";
import { Showcase } from "@/components/landing/showcase";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const dynamic = "force-static";
export const revalidate = false;

export default function IndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
      <PageTransition>
        <div className="flex flex-col">
          <Hero />
          <Showcase />
          <Categories />
          <HowItWorks />
          <ProHighlight />
          <Faq />
          <FinalCta />
        </div>
      </PageTransition>
    </>
  );
}
