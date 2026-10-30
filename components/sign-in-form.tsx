"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

const CODE_LENGTH = 6;
const SUBMIT_LABEL = {
  code: "Verify & sign in",
  email: "Send code",
};

const authErrorMessage = (
  error: { status: number; message?: string },
  rateLimited: string,
  fallback: string
) => (error.status === 429 ? rateLimited : error.message || fallback);

const GoogleIcon = () => (
  <svg aria-hidden viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);
/** Under the code step: "Use another email" (unless preset) and "Send a new code". */
const CodeStepLinks = ({
  busy,
  onChangeEmail,
  onResend,
}: {
  busy: boolean;
  onChangeEmail?: () => void;
  onResend: () => void;
}) => (
  <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
    {onChangeEmail ? (
      <>
        <Button
          type="button"
          variant="link"
          disabled={busy}
          onClick={onChangeEmail}
          className="text-muted-foreground h-auto p-0 text-xs"
        >
          Use another email
        </Button>
        <span aria-hidden>·</span>
      </>
    ) : null}
    <Button
      type="button"
      variant="link"
      disabled={busy}
      onClick={onResend}
      className="text-muted-foreground h-auto p-0 text-xs"
    >
      Send a new code
    </Button>
  </div>
);

/** The error (as an alert) or, failing that, the notice. */
const FormMessages = ({
  error,
  notice,
}: {
  error: string | null;
  notice: string | null;
}) => {
  if (error) {
    return (
      <p role="alert" className="text-destructive text-sm">
        {error}
      </p>
    );
  }
  return notice ? (
    <p role="status" className="text-muted-foreground text-sm">
      {notice}
    </p>
  ) : null;
};

/**
 * Email → six-digit code sign-in; the account is created on first sign-in.
 * With `email` preset the address is fixed, and `autoSend` emails the code
 * as soon as the form mounts (used after checkout).
 */
export const SignInForm = ({
  emailEnabled,
  googleEnabled,
  next,
  email: presetEmail,
  autoSend = false,
}: {
  emailEnabled: boolean;
  googleEnabled: boolean;
  next: string;
  email?: string;
  autoSend?: boolean;
}) => {
  const emailId = useId();
  const codeId = useId();
  const form = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState(presetEmail ?? "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">(
    presetEmail && autoSend && emailEnabled ? "code" : "email"
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const sendCode = async (address: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: address,
        type: "sign-in",
      });
      if (result.error) {
        setError(
          authErrorMessage(
            result.error,
            "Too many codes requested. Wait a minute and try again.",
            "Your sign-in code could not be sent."
          )
        );
        return false;
      }
      return true;
    } catch {
      setError("Sign-in is unavailable right now. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  // After checkout the buyer's email is known: send the code right away.
  const autoSent = useRef(false);
  useEffect(() => {
    if (autoSend && presetEmail && emailEnabled && !autoSent.current) {
      autoSent.current = true;
      void sendCode(presetEmail);
    }
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) {
      return;
    }
    if (step === "email") {
      if (await sendCode(email)) {
        setCode("");
        setStep("code");
      }
      return;
    }
    if (code.length !== CODE_LENGTH) {
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await authClient.signIn.emailOtp({ email, otp: code });
      if (result.error) {
        setError(
          authErrorMessage(
            result.error,
            "Too many attempts. Wait a minute and try again.",
            "This code could not be verified."
          )
        );
        setBusy(false);
        return;
      }
      // A full load, so server components see the new session.
      window.location.assign(next);
    } catch {
      setError("Sign-in is unavailable right now. Please try again.");
      setBusy(false);
    }
  };

  const resend = async () => {
    if (await sendCode(email)) {
      setCode("");
      setNotice("We sent a new code.");
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await authClient.signIn.social({
        callbackURL: next,
        provider: "google",
      });
      if (result.error) {
        setError(result.error.message || "Sign-in could not be started.");
      }
    } catch {
      setError("Sign-in is unavailable right now.");
    } finally {
      setBusy(false);
    }
  };

  const busyLabel = step === "email" ? "Sending…" : "Verifying…";
  const showGoogle = step === "email" && googleEnabled;

  return (
    <FieldGroup className="gap-5">
      {showGoogle ? (
        <Field>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </Field>
      ) : null}
      {showGoogle && emailEnabled ? (
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          or
        </FieldSeparator>
      ) : null}
      {emailEnabled ? (
        <form ref={form} onSubmit={submit}>
          <FieldGroup className="gap-4">
            {step === "email" ? (
              <Field>
                <FieldLabel htmlFor={emailId}>Email</FieldLabel>
                <Input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  required
                  disabled={busy || Boolean(presetEmail)}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor={codeId}>Six-digit code</FieldLabel>
                <InputOTP
                  id={codeId}
                  maxLength={CODE_LENGTH}
                  inputMode="numeric"
                  pattern="^[0-9]*$"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={setCode}
                  // Submits once the last digit lands (typed or pasted).
                  onComplete={() => form.current?.requestSubmit()}
                  disabled={busy}
                  aria-invalid={Boolean(error)}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center text-xs">
                  We sent a code to{" "}
                  <strong className="text-foreground">{email}</strong>. It
                  expires in 10 minutes.
                </FieldDescription>
              </Field>
            )}
            <Field>
              <Button
                type="submit"
                disabled={
                  busy || (step === "code" && code.length !== CODE_LENGTH)
                }
              >
                {busy ? busyLabel : SUBMIT_LABEL[step]}
              </Button>
              {step === "code" ? (
                <CodeStepLinks
                  busy={busy}
                  onResend={resend}
                  onChangeEmail={
                    presetEmail
                      ? undefined
                      : () => {
                          setStep("email");
                          setCode("");
                          setError(null);
                          setNotice(null);
                        }
                  }
                />
              ) : null}
            </Field>
          </FieldGroup>
        </form>
      ) : null}
      <FormMessages error={error} notice={notice} />
    </FieldGroup>
  );
};
