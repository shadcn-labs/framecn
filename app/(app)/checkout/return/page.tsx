import Link from "next/link";

import { SignInForm } from "@/components/sign-in-form";
import { Button } from "@/components/ui/button";
import {
  getAuthConfigurationError,
  getProAccess,
  getSession,
  isEmailSignInEnabled,
  isGoogleSignInEnabled,
} from "@/lib/auth";
import {
  getBillingConfigurationError,
  getCheckoutPayment,
} from "@/lib/billing";
import type { CheckoutPayment } from "@/lib/billing";

export const metadata = {
  robots: { index: false },
  title: "Your Pro access — framecn",
};

const PRO_HOME = "/components/compositions/node-reveal";

const Card = ({
  title,
  body,
  children,
}: {
  title: string;
  body: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <section className="page-y flex flex-1 flex-col items-center justify-center px-6">
    <div className="bg-card w-full max-w-sm rounded-xl border p-6">
      <h1 className="heading-subtitle">{title}</h1>
      <p className="text-muted-foreground mt-2 mb-6 text-sm">{body}</p>
      {children}
    </div>
  </section>
);

const Actions = ({ href, action }: { href: string; action: string }) => (
  <div className="flex items-center gap-2">
    <Button nativeButton={false} render={<Link href={href} />}>
      {action}
    </Button>
    <Button
      nativeButton={false}
      render={<Link href="/pricing" />}
      variant="ghost"
    >
      Billing & plans
    </Button>
  </div>
);

const lookUpPayment = async (
  paymentId: string
): Promise<CheckoutPayment | null | "unavailable"> => {
  if (getBillingConfigurationError()) {
    return "unavailable";
  }
  try {
    return await getCheckoutPayment(paymentId);
  } catch {
    return "unavailable";
  }
};

/**
 * Dodo returns here with `payment_id`. The payment is looked up server-side
 * only to greet the buyer and preset their email; Pro itself comes from the
 * webhook-written entitlement for that email, never from this URL.
 */
const CheckoutReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string | string[] }>;
}) => {
  const { payment_id: rawPaymentId } = await searchParams;
  const paymentId = typeof rawPaymentId === "string" ? rawPaymentId : null;
  const session = await getSession();
  const pro = await getProAccess();

  if (!paymentId) {
    if (pro) {
      return (
        <Card
          title="You're in. Let's make motion."
          body="Your account has active Pro access. Node Reveal is ready for you."
        >
          <Actions href={PRO_HOME} action="Open Node Reveal" />
        </Card>
      );
    }
    return session ? (
      <Card
        title="Checking your Pro access."
        body={`No active Pro purchase for ${session.user.email} yet. Payment confirmation can take a moment; Pro follows the email you paid with.`}
      >
        <Actions href="/checkout/return" action="Check again" />
      </Card>
    ) : (
      <Card
        title="Sign in to check your purchase."
        body="Sign in with the email you paid with. Your purchase is matched to that email, not to this page."
      >
        <Actions
          href={`/sign-in?next=${encodeURIComponent(PRO_HOME)}`}
          action="Sign in"
        />
      </Card>
    );
  }

  const payment = await lookUpPayment(paymentId);
  const retryHref = `/checkout/return?payment_id=${encodeURIComponent(paymentId)}`;
  if (payment === "unavailable") {
    return (
      <Card
        title="We couldn't check your payment."
        body="The payment provider is unavailable right now. If you paid, your Pro access is safe: sign in with the email you paid with."
      >
        <Actions href={retryHref} action="Check again" />
      </Card>
    );
  }
  if (!payment) {
    return (
      <Card
        title="We couldn't find that payment."
        body="This link doesn't match a framecn purchase. If you paid, sign in with the email you paid with."
      >
        <Actions
          href={`/sign-in?next=${encodeURIComponent(PRO_HOME)}`}
          action="Sign in"
        />
      </Card>
    );
  }
  if (!payment.succeeded) {
    return (
      <Card
        title="Confirming your payment."
        body="Dodo is still confirming your payment. This usually takes a few seconds."
      >
        <Actions href={retryHref} action="Check again" />
      </Card>
    );
  }
  if (
    session?.user.emailVerified &&
    session.user.email.toLowerCase() === payment.email
  ) {
    return (
      <Card
        title="Payment received. You're in."
        body={
          pro
            ? "Your account has active Pro access. Node Reveal is ready for you."
            : "Pro activates as soon as Dodo confirms the payment, usually within seconds."
        }
      >
        <Actions
          href={pro ? PRO_HOME : retryHref}
          action={pro ? "Open Node Reveal" : "Check again"}
        />
      </Card>
    );
  }
  const authError = getAuthConfigurationError();
  return (
    <Card
      title="Payment received. Thank you!"
      body={
        <>
          Pro belongs to{" "}
          <strong className="text-foreground">{payment.email}</strong>. Enter
          the code we just emailed there to sign in.
        </>
      }
    >
      {authError ? (
        <p role="alert" className="rounded-lg border p-4 text-sm">
          {authError}
        </p>
      ) : (
        <SignInForm
          emailEnabled={isEmailSignInEnabled()}
          googleEnabled={isGoogleSignInEnabled()}
          next={PRO_HOME}
          email={payment.email}
          autoSend
        />
      )}
    </Card>
  );
};

export default CheckoutReturnPage;
