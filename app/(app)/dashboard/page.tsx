import Link from "next/link";
import { redirect } from "next/navigation";

import { BillingButton } from "@/components/billing-button";
import {
  AccountRow,
  ApiKeyRow,
  DeleteAccount,
  SignOutEverywhere,
} from "@/components/dashboard/account-rows";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getApiKeyInfo } from "@/lib/api-keys";
import { getSession } from "@/lib/auth";
import { billingCustomerId, getActivePlan } from "@/lib/billing";
import type { ActivePlan } from "@/lib/billing";
import { CATALOG, PRO_COUNT } from "@/lib/catalog";
import { findPlan } from "@/lib/plans";
import { formatDate } from "@/lib/utils";

export const metadata = {
  robots: { follow: false, index: false },
  title: "Dashboard — framecn",
};

/** Headline and fine print for the plan card. */
const describePlan = (plan: ActivePlan | null) => {
  if (!plan) {
    return {
      detail: `${CATALOG.length - PRO_COUNT} free components are yours. ${PRO_COUNT} Pro components are one upgrade away.`,
      title: "Free plan",
    };
  }
  const name = findPlan(plan.slug)?.name ?? "Pro";
  if (plan.kind === "subscription") {
    return {
      detail: plan.expiresAt
        ? `Current period ends ${formatDate(plan.expiresAt)}.`
        : "Billed yearly.",
      title: `${name} plan`,
    };
  }
  if (plan.slug === "team") {
    return {
      detail: `Paid once on ${formatDate(plan.purchasedAt)}. One shared API key for the team.`,
      title: plan.seats ? `Team plan · ${plan.seats} seats` : "Team plan",
    };
  }
  return {
    detail: `Paid once on ${formatDate(plan.purchasedAt)}. Never expires.`,
    title: `${name} plan`,
  };
};

const DashboardPage = async () => {
  const session = await getSession();
  if (!session) {
    redirect(`${ROUTES.SIGN_IN}?next=${encodeURIComponent(ROUTES.DASHBOARD)}`);
  }
  const verified = session.user.emailVerified;
  const [plan, customer, key] = await Promise.all([
    verified ? getActivePlan(session.user.email) : null,
    verified ? billingCustomerId(session.user.email) : null,
    getApiKeyInfo(session.user.id),
  ]);
  const { title, detail } = describePlan(plan);
  const upgradable = !plan || plan.kind === "subscription";

  return (
    <section className="container-page page-y flex-1">
      <div className="mx-auto w-full max-w-3xl min-w-0">
        <PageHeader
          title="Account"
          description="Manage your plan, registry API key, and account settings."
          centered
        />
        <div className="bg-muted/50 mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-6 md:p-8">
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-[-0.03em]">{title}</p>
            <p className="text-muted-foreground mt-1.5 text-sm text-pretty">
              {detail}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {customer ? (
              <BillingButton variant="outline" className="rounded-full">
                Manage billing
              </BillingButton>
            ) : null}
            {upgradable ? (
              <Button
                nativeButton={false}
                render={<Link href={ROUTES.PRICING} />}
                variant={plan ? "outline" : "gradient"}
                className="rounded-full"
              >
                {plan ? "Go lifetime" : "Get Pro"}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-6">
          <ApiKeyRow initial={key} pro={Boolean(plan)} />
          <AccountRow
            title="Email"
            detail={verified ? undefined : "Not verified yet"}
          >
            <span className="text-muted-foreground text-sm">
              {session.user.email}
            </span>
          </AccountRow>
          <AccountRow
            title="Log out of all devices"
            detail="Ends every session, including this one."
          >
            <SignOutEverywhere />
          </AccountRow>
          <AccountRow
            title="Delete account"
            detail="Your sessions and API key go with it. Purchases stay with your email."
          >
            <DeleteAccount />
          </AccountRow>
        </div>
      </div>
    </section>
  );
};
export default DashboardPage;
