import Link from "next/link";

import {
  LegalPage,
  LegalSection,
  proseLinkClass,
} from "@/components/legal-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { readFileFromRoot } from "@/lib/read-file";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description: `${SITE.NAME} components are free under the MIT License. framecn Pro is licensed for personal, commercial, and client work.`,
  path: ROUTES.LICENSE,
  title: "License",
});

export default async function LicensePage() {
  const licenseFile = await readFileFromRoot("LICENSE");
  const mitLicense = licenseFile.trim();

  return (
    <LegalPage
      path={ROUTES.LICENSE}
      title="License"
      updated="Oct 28, 2026"
      intro={
        <p>
          The {SITE.NAME} component library is open source under the MIT
          License. framecn Pro compositions are commercial and come with their
          own license, summarized below.
        </p>
      }
    >
      <LegalSection title="Free components">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">MIT</Badge>
          <span>Every caption component, and anything not marked Pro.</span>
        </div>
        <p>
          Use, copy, modify, and ship them anywhere, including commercial and
          client work. Keep the copyright notice with substantial copies of the
          code. The canonical text lives in the{" "}
          <a
            href={LINK.LICENSE}
            target="_blank"
            rel="noopener"
            className={proseLinkClass}
          >
            LICENSE file on GitHub
          </a>
          .
        </p>
        <Card className="py-0 shadow-none">
          <pre className="text-muted-foreground overflow-x-auto p-5 font-mono text-xs leading-6 whitespace-pre-wrap">
            {mitLicense}
          </pre>
        </Card>
      </LegalSection>

      <LegalSection title="framecn Pro">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Commercial</Badge>
          <span>Pro Annual, Lifetime, and Team plans.</span>
        </div>
        <p>You can:</p>
        <ul>
          <li>Use Pro components in personal projects.</li>
          <li>
            Use them in commercial products and in work you build for clients.
          </li>
          <li>
            Modify the source and ship the rendered videos and finished apps
            however you like.
          </li>
        </ul>
        <p>You can&apos;t:</p>
        <ul>
          <li>
            Redistribute or resell the Pro source as a component library,
            template, starter kit, or shadcn registry.
          </li>
          <li>
            Publish the Pro source in a public repository, or share your API key
            outside your license.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Seats and access">
        <ul>
          <li>
            <span className="text-foreground">Pro Annual</span> is for one
            person. You can install Pro while your subscription is active;
            anything installed before it ends remains licensed for the projects
            you used it in.
          </li>
          <li>
            <span className="text-foreground">Lifetime</span> is for one person,
            with Pro access that never expires, including future Pro components.
          </li>
          <li>
            <span className="text-foreground">Team</span> is a Lifetime license
            for up to 10 members, who share one team API key (for example in CI
            or environment variables).
          </li>
        </ul>
        <p>
          Refunds, chargebacks, and cancellations are covered in the{" "}
          <Link href={ROUTES.REFUNDS} className={proseLinkClass}>
            refund policy
          </Link>{" "}
          and{" "}
          <Link href={ROUTES.TERMS} className={proseLinkClass}>
            terms
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
