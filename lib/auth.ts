import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";

import { SITE } from "@/constants/site";
import { hasProAccess } from "@/lib/billing";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import {
  renderSignInEmail,
  SIGN_IN_CODE_EXPIRY_MINUTES,
} from "@/lib/email-templates";

/** Google is the only OAuth provider; it shows when its client is configured. */
export const isGoogleSignInEnabled = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const isEmailSignInEnabled = () =>
  Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export const getAuthConfigurationError = (): string | null => {
  if (
    !process.env.BETTER_AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET.length < 32
  ) {
    return "Authentication is not configured: set BETTER_AUTH_SECRET to a random secret of at least 32 characters.";
  }
  if (!process.env.BETTER_AUTH_URL) {
    return "Authentication is not configured: set BETTER_AUTH_URL to this site's origin.";
  }
  if (!process.env.RESEND_API_KEY && !isGoogleSignInEnabled()) {
    return "Sign-in is not configured: add RESEND_API_KEY and EMAIL_FROM, or configure a Google OAuth client.";
  }
  if (process.env.RESEND_API_KEY && !process.env.EMAIL_FROM) {
    return "Email sign-in is not configured: set EMAIL_FROM to a verified Resend sender.";
  }
  return null;
};

const createAuth = () =>
  betterAuth({
    advanced: {
      // Vercel sets x-forwarded-for to the client IP; rate limits key on it.
      ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
    },
    appName: "framecn",
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(getDb(), { provider: "sqlite", schema }),
    // Open sign-up: any email gets a code and the account is created on first
    // sign-in. Purchases are matched by email, so no claim step is needed.
    plugins: [
      emailOTP({
        allowedAttempts: 5,
        expiresIn: 60 * SIGN_IN_CODE_EXPIRY_MINUTES,
        otpLength: 6,
        sendVerificationOTP: ({ email, otp }) =>
          sendEmail({
            content: renderSignInEmail({
              code: otp,
              origin: new URL(process.env.BETTER_AUTH_URL ?? SITE.URL).origin,
            }),
            to: email,
          }),
        storeOTP: "hashed",
      }),
      // Must stay last: lets server actions set auth cookies.
      nextCookies(),
    ],
    rateLimit: {
      customRules: {
        "/email-otp/send-verification-otp": { max: 3, window: 60 },
        "/sign-in/email-otp": { max: 10, window: 60 },
      },
      enabled: true,
      storage: "database",
    },
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {},
    // Purchases are keyed by email, so deleting the account keeps Pro for a
    // later sign-in with the same address; the API key cascades away.
    user: { deleteUser: { enabled: true } },
  });

let auth: ReturnType<typeof createAuth> | undefined;

export const getAuth = () => {
  const error = getAuthConfigurationError();
  if (error) {
    throw new Error(error);
  }
  auth ??= createAuth();
  return auth;
};

export interface FrameSession {
  user: { id: string; email: string; emailVerified: boolean; name: string };
}

export const getSession = cache(async (): Promise<FrameSession | null> => {
  if (getAuthConfigurationError()) {
    return null;
  }
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }
  const { id, email, emailVerified, name } = session.user;
  return { user: { email, emailVerified, id, name } };
});

/** Pro follows the purchase email: only a verified owner of that email gets it. */
export const getProAccess = cache(async (): Promise<boolean> => {
  const session = await getSession();
  return session?.user.emailVerified ? hasProAccess(session.user.email) : false;
});
