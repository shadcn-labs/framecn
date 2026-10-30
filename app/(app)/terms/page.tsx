import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description: `The terms that apply when you use ${SITE.NAME}, its open-source components, and framecn Pro.`,
  path: ROUTES.TERMS,
  title: "Terms of Service",
});

export default function TermsPage() {
  return (
    <LegalPage
      path={ROUTES.TERMS}
      title="Terms of Service"
      updated="Oct 29, 2026"
      intro={
        <p>
          {SITE.NAME} is operated by Aniket Pawar as Shadcn Labs (
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using this website, the{" "}
          {SITE.NAME} registry, or framecn Pro, you agree to these terms. If you
          don&apos;t agree, please don&apos;t use them.
        </p>
      }
    >
      <LegalSection title="Open-source components">
        <p>
          The free {SITE.NAME} components are open source under the{" "}
          <Link href={ROUTES.LICENSE}>MIT License</Link>. Your use of that code
          is governed by the license in the{" "}
          <a href={LINK.GITHUB} target="_blank" rel="noopener">
            repository
          </a>
          , not by these terms. The code is provided &ldquo;as is&rdquo;,
          without warranty of any kind.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You can buy framecn Pro without an account; Pro belongs to the email
          you pay with, and you need an account with that email to install it.
          You can sign in with a one-time code sent to your email, or with
          Google. You&apos;re responsible for activity under your account and
          for keeping your Pro API key secret. If a key leaks, revoke it and
          create a new one from your account.
        </p>
      </LegalSection>

      <LegalSection title="framecn Pro">
        <p>
          framecn Pro is a paid license to premium compositions, installed
          through an authenticated shadcn registry with your personal API key.
          Plans are Pro Annual (a yearly subscription), Lifetime (a one-time
          payment), and Team (a one-time payment covering the number of seats
          bought, 2 to 25, whose members share one API key). What you may do
          with Pro source is described in the{" "}
          <Link href={ROUTES.LICENSE}>license</Link>. Access starts after a
          verified payment and ends if a subscription lapses or a payment is
          refunded or charged back.
        </p>
      </LegalSection>

      <LegalSection title="Payments">
        <p>
          Purchases are processed by Dodo Payments, which acts as our merchant
          of record. Dodo handles checkout, invoices, taxes, and payment
          methods, and its own terms apply to the transaction. Prices are shown
          on the <Link href={ROUTES.PRICING}>pricing page</Link> and may change
          for future purchases; changes never affect a period you&apos;ve
          already paid for. Refunds follow our{" "}
          <Link href={ROUTES.REFUNDS}>refund policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You own the videos, projects, and code you make with {SITE.NAME}. We
          don&apos;t claim any rights to them.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>Don&apos;t use {SITE.NAME} or framecn Pro to:</p>
        <ul>
          <li>
            Share, resell, or publish your API key or Pro source outside what
            your license allows.
          </li>
          <li>
            Abuse, scrape, or overload the registry, API, or sign-in endpoints,
            or try to get around access controls.
          </li>
          <li>Break the law or infringe on anyone else&apos;s rights.</li>
        </ul>
        <p>We may suspend accounts or revoke keys that break these rules.</p>
      </LegalSection>

      <LegalSection title="Disclaimers and liability">
        <p>
          The service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. To the extent the law allows, we aren&apos;t liable
          for indirect or consequential damages, and our total liability for any
          claim is limited to the amount you paid us in the 12 months before it.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms. When we do, we&apos;ll change the date at
          the top of this page. Continuing to use {SITE.NAME} after a change
          means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
