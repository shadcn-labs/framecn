import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";

import { hasProAccess } from "@/lib/billing";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const getAuthProviders = (): ("google" | "github")[] => {
  const providers: ("google" | "github")[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push("google");
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push("github");
  }
  return providers;
};

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
  if (!process.env.RESEND_API_KEY && getAuthProviders().length === 0) {
    return "Sign-in is not configured: add RESEND_API_KEY and EMAIL_FROM, or configure a Google or GitHub OAuth application.";
  }
  if (process.env.RESEND_API_KEY && !process.env.EMAIL_FROM) {
    return "Email sign-in is not configured: set EMAIL_FROM to a verified Resend sender.";
  }
  return null;
};

const sendSignInCode = async (email: string, otp: string) => {
  if (!isEmailSignInEnabled()) {
    throw new Error("Email sign-in is not configured");
  }
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      html: `<div style="background:#f5f4ef;padding:32px;font-family:Arial,sans-serif;color:#18181b"><div style="border:1px solid #18181b;padding:32px;max-width:460px;margin:auto"><p>SHADCN LABS / FRAMECN</p><h1>Your sign-in code</h1><p style="background:#f06292;padding:20px;font-size:36px;letter-spacing:8px">${otp}</p><p>This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p></div></div>`,
      subject: `${otp} is your framecn sign-in code`,
      text: `Your framecn sign-in code is ${otp}. It expires in 10 minutes. If you did not request this code, ignore this email.\n\nframecn by Shadcn Labs`,
      to: [email],
    }),
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(
      "The email provider could not deliver your code. Check the configured sender and try again."
    );
  }
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
        expiresIn: 60 * 10,
        otpLength: 6,
        sendVerificationOTP: ({ email, otp }) => sendSignInCode(email, otp),
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
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
    },
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
