import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { Separator } from "@/components/ui/separator";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const LegalSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);

export const LegalPage = ({
  children,
  intro,
  path,
  title,
  updated,
}: {
  children: React.ReactNode;
  intro?: React.ReactNode;
  path: string;
  title: string;
  updated: string;
}) => (
  <>
    <BreadcrumbJsonLd
      items={[
        { name: "Home", path: ROUTES.HOME },
        { name: title, path },
      ]}
    />
    <PageTransition>
      <article className="page-y mx-auto w-full max-w-2xl px-6">
        <PageHeader title={title} />
        {intro ? (
          <div className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-7 text-pretty">
            {intro}
          </div>
        ) : null}
        <p className="text-muted-foreground mt-4 text-xs">
          Last updated <time>{updated}</time>
        </p>
        <Separator className="my-10" />
        <div className="typeset typeset-site">
          {children}
          <LegalSection title="Contact">
            <p>
              Questions about this page? Email{" "}
              <a href={`mailto:${LINK.EMAIL}`}>{LINK.EMAIL}</a> or see the{" "}
              <Link href={ROUTES.CONTACT}>contact page</Link> for other ways to
              reach us.
            </p>
          </LegalSection>
        </div>
      </article>
    </PageTransition>
  </>
);
