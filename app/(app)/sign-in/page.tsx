import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/sign-in-form";
import { SignInWall } from "@/components/sign-in-wall";
import { ROUTES } from "@/constants/routes";
import {
  getAuthConfigurationError,
  getSession,
  isEmailSignInEnabled,
  isGoogleSignInEnabled,
} from "@/lib/auth";

export const metadata = {
  description: "Sign in to your framecn account by Shadcn Labs.",
  title: "Sign in — framecn",
};

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) => {
  const { next: requestedNext } = await searchParams;
  const next =
    requestedNext?.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : ROUTES.DASHBOARD;
  const session = await getSession();
  if (session) {
    redirect(next);
  }
  const error = getAuthConfigurationError();
  return (
    <section className="grid flex-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="heading-title">Sign in to framecn</h1>
            <p className="text-muted-foreground mt-2 text-sm text-balance">
              Get your API key, manage your plan, and install Pro components
              from the CLI.
            </p>
          </div>
          {error ? (
            <div role="alert" className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-medium">Sign-in needs a little setup.</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <SignInForm
              emailEnabled={isEmailSignInEnabled()}
              googleEnabled={isGoogleSignInEnabled()}
              next={next}
            />
          )}
          <p className="text-muted-foreground mt-8 text-center text-xs">
            <Link
              href={ROUTES.TERMS}
              className="hover:text-foreground underline underline-offset-4"
            >
              Terms
            </Link>
            {" · "}
            <Link
              href={ROUTES.PRIVACY}
              className="hover:text-foreground underline underline-offset-4"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
      <SignInWall />
    </section>
  );
};
export default SignInPage;
