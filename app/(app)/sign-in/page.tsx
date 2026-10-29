import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/sign-in-form";
import {
  getAuthConfigurationError,
  getAuthProviders,
  getSession,
  isEmailSignInEnabled,
} from "@/lib/auth";

export const metadata = {
  description: "Sign in to your framecn account by Shadcn Labs.",
  title: "Sign in — framecn",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: requestedNext } = await searchParams;
  const next =
    requestedNext?.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : "/pricing";
  const session = await getSession();
  if (session) {
    redirect(next);
  }
  const error = getAuthConfigurationError();
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-5 py-16">
      <div className="bg-card w-full max-w-sm rounded-xl border p-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Sign in to framecn
        </h1>
        <p className="text-muted-foreground mt-1 mb-6 text-sm">
          Unlock Pro source and manage your plan. New here? Your account is
          created when you verify your email.
        </p>
        {error ? (
          <div role="alert" className="rounded-lg border p-4 text-sm">
            <p className="mb-1 font-medium">Sign-in needs a little setup.</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <SignInForm
            emailEnabled={isEmailSignInEnabled()}
            providers={getAuthProviders()}
            next={next}
          />
        )}
        <p className="text-muted-foreground mt-6 text-xs">
          Bought Pro? Sign in with the email you paid with and your purchase is
          there.
        </p>
      </div>
      <Link
        href="/components"
        className="text-muted-foreground hover:text-foreground mt-6 text-sm"
      >
        Just browsing? Explore the free components →
      </Link>
    </section>
  );
}
