import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description:
    "How cancellations and refunds work for framecn Pro: cancel anytime, and a 14-day refund window before you install Pro source.",
  path: ROUTES.REFUNDS,
  title: "Refund Policy",
});

const refundSubject = encodeURIComponent("Refund request");

export default function RefundsPage() {
  return (
    <LegalPage
      path={ROUTES.REFUNDS}
      title="Refund Policy"
      updated="Oct 28, 2026"
      intro={
        <p>
          framecn Pro is sold by Aniket Pawar as Shadcn Labs, with Dodo Payments
          as merchant of record. Because Pro gives you source code you keep,
          refunds depend on whether you&apos;ve installed it yet.
        </p>
      }
    >
      <Alert>
        <AlertTitle>The short version</AlertTitle>
        <AlertDescription>
          Full refund within 14 days of a payment, as long as you haven&apos;t
          installed or downloaded any Pro source since that payment. Billing
          mistakes and duplicate charges are always refunded.
        </AlertDescription>
      </Alert>

      <LegalSection title="Pro Annual (subscription)">
        <ul>
          <li>
            Cancel anytime from <strong>Manage billing</strong> on the{" "}
            <Link href={ROUTES.PRICING}>pricing page</Link>. Your subscription
            won&apos;t renew, and Pro stays active until the end of the year
            you&apos;ve paid for.
          </li>
          <li>
            Cancelling doesn&apos;t refund the current period. If you ask within
            14 days of the first payment or a renewal and haven&apos;t installed
            Pro source since that payment, we&apos;ll refund it in full and end
            Pro access.
          </li>
          <li>
            Pro components you installed while subscribed stay in your projects.
            You just can&apos;t install new ones after access ends.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Lifetime and Team (one-time)">
        <ul>
          <li>
            Request a refund within 14 days of purchase. It&apos;s granted in
            full if no Pro source has been installed or downloaded with your
            account&apos;s API key (or, for Team, the shared team key).
          </li>
          <li>
            After 14 days, or once Pro source has been installed, one-time
            purchases are final.
          </li>
          <li>
            A refund ends Pro access for you, or for everyone on a Team license,
            and the API key stops installing Pro components.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How to request a refund">
        <ol>
          <li>
            Email{" "}
            <a href={`mailto:${LINK.EMAIL}?subject=${refundSubject}`}>
              {LINK.EMAIL}
            </a>{" "}
            from your account&apos;s email address, with your order or invoice
            ID from the Dodo Payments receipt (also listed under Manage
            billing).
          </li>
          <li>We reply within 3 business days.</li>
          <li>
            Approved refunds are issued through Dodo Payments to your original
            payment method and usually arrive within 5–10 business days,
            depending on your bank.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="Chargebacks">
        <p>
          Please contact us before opening a chargeback. We can usually sort
          things out faster than your bank, and a chargeback immediately removes
          Pro access while it&apos;s reviewed.
        </p>
      </LegalSection>

      <LegalSection title="Your consumer rights">
        <p>
          Nothing here limits rights you have under the consumer laws where you
          live.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
