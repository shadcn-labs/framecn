import {
  BugIcon,
  ClapperboardIcon,
  ReceiptTextIcon,
  UsersIcon,
} from "lucide-react";

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

const POINTS = [
  {
    body: "One license, one invoice, a price we agree on. Pick Sales and tell us the headcount.",
    icon: UsersIcon,
    title: "More than 25 seats",
  },
  {
    body: "Need a PO number or a custom invoice? Ask before you pay and we'll set it up.",
    icon: ReceiptTextIcon,
    title: "Procurement paperwork",
  },
  {
    body: "Describe the shot you can't build yet. The Pro roadmap comes from requests like yours.",
    icon: ClapperboardIcon,
    title: "A component that doesn't exist",
  },
  {
    body: "Send the component name, your props (Copy prompt has them) and your Editframe version.",
    icon: BugIcon,
    title: "A render that looks wrong",
  },
];

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
        <article className="container-page page-y grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <PageHeader
              title="Contact"
              description="Pick a reason, write like a human, get a human back."
            />
            <ul className="mt-8 space-y-5 text-sm">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <Icon
                    aria-hidden
                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  />
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-muted-foreground mt-0.5 leading-6">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ContactForm
              inquiry={typeof inquiry === "string" ? inquiry : undefined}
            />
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
          </div>
        </article>
      </PageTransition>
    </>
  );
}
