import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Frame } from "@/components/ui/frame";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description: `Get in touch with the ${SITE.NAME} team at Shadcn Labs by email, Discord, GitHub, or X.`,
  path: ROUTES.CONTACT,
  title: "Contact",
});

const mailto = (subject: string) =>
  `mailto:${LINK.EMAIL}?subject=${encodeURIComponent(`[${SITE.NAME}] ${subject}`)}`;

const INQUIRIES = [
  { href: mailto("General"), label: "General" },
  { href: mailto("Support"), label: "Support" },
  { external: true, href: `${LINK.ISSUES}/new`, label: "Bug report" },
  { external: true, href: `${LINK.ISSUES}/new`, label: "Feature request" },
  { href: mailto("Partnership"), label: "Partnership" },
  { href: mailto("Sponsorship"), label: "Sponsorship" },
  { href: mailto("Press"), label: "Press" },
  { href: mailto("Other"), label: "Other" },
];

const CHANNELS = [
  {
    cta: "Join Discord",
    description: "Chat with the community, share what you made, get help.",
    href: LINK.DISCORD,
    title: "Discord",
  },
  {
    cta: "Open an issue",
    description: "Report bugs and request components in the open.",
    href: LINK.ISSUES,
    title: "GitHub issues",
  },
  {
    cta: "Follow @shadcnlabs",
    description: "Releases, previews, and what we're building next.",
    href: LINK.X_SHADCN_LABS,
    title: "X",
  },
];

export default function ContactPage() {
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
            title="Say hello."
            description={`${SITE.NAME} is made by a small team at Shadcn Labs. Pick whichever channel suits you; we read everything.`}
          />

          <Frame className="mt-10">
            <Card className="rounded-lg shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailIcon className="text-muted-foreground size-4" />
                  Email
                </CardTitle>
                <CardDescription>
                  Write to{" "}
                  <a
                    href={`mailto:${LINK.EMAIL}`}
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {LINK.EMAIL}
                  </a>
                  , or pick a topic to prefill the subject. Bugs and feature
                  requests go to GitHub.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {INQUIRIES.map((inquiry) => (
                  <Button
                    key={inquiry.label}
                    nativeButton={false}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    render={
                      <a
                        href={inquiry.href}
                        {...(inquiry.external
                          ? { rel: "noopener", target: "_blank" }
                          : {})}
                      />
                    }
                  >
                    {inquiry.label}
                    {inquiry.external ? (
                      <ArrowUpRightIcon className="text-muted-foreground" />
                    ) : null}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </Frame>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((channel) => (
              <Frame key={channel.title} className="flex">
                <Card className="flex-1 gap-4 rounded-lg shadow-none">
                  <CardHeader>
                    <CardTitle>{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      nativeButton={false}
                      variant="link"
                      className="h-auto px-0 text-foreground"
                      render={
                        <a href={channel.href} target="_blank" rel="noopener" />
                      }
                    >
                      {channel.cta}
                      <ArrowUpRightIcon />
                    </Button>
                  </CardContent>
                </Card>
              </Frame>
            ))}
          </div>

          <Alert className="mt-10">
            <AlertTitle>Billing or refund question?</AlertTitle>
            <AlertDescription>
              <p>
                Manage your subscription, payment method, and invoices from{" "}
                <span className="text-foreground">Manage billing</span> on the{" "}
                <Link
                  href={ROUTES.PRICING}
                  className="text-foreground underline underline-offset-4"
                >
                  pricing page
                </Link>
                . For refunds, email{" "}
                <a
                  href={mailto("Billing")}
                  className="text-foreground underline underline-offset-4"
                >
                  {LINK.EMAIL}
                </a>{" "}
                and see the{" "}
                <Link
                  href={ROUTES.REFUNDS}
                  className="text-foreground underline underline-offset-4"
                >
                  refund policy
                </Link>
                .
              </p>
            </AlertDescription>
          </Alert>
        </article>
      </PageTransition>
    </>
  );
}
