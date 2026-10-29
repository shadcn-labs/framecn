import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  description: `Get in touch with the ${SITE.NAME} team at Shadcn Labs using the contact form, email, or Discord.`,
  path: ROUTES.CONTACT,
  title: "Contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiry?: string | string[] }>;
}) {
  const { inquiry } = await searchParams;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: ROUTES.HOME },
          { name: "Contact", path: ROUTES.CONTACT },
        ]}
      />
      <PageTransition>
        <article className="mx-auto w-full max-w-2xl px-6 py-12 md:py-16">
          <PageHeader
            title="Contact"
            description="Send a message using the form, or reach out directly."
          />
          <div className="mt-8">
            <ContactForm
              inquiry={typeof inquiry === "string" ? inquiry : undefined}
            />
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Or email{" "}
            <a
              href={`mailto:${LINK.EMAIL}`}
              className="text-foreground underline underline-offset-4"
            >
              {LINK.EMAIL}
            </a>{" "}
            or{" "}
            <a
              href={LINK.DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              join our Discord
            </a>
            .
          </p>
        </article>
      </PageTransition>
    </>
  );
}
