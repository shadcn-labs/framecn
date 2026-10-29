"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const CODE_LENGTH = 6;
const SUBMIT_LABEL = {
  code: "Verify & sign in",
  email: "Email me a sign-in code",
};

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

/**
 * Email → six-digit code sign-in; the account is created on first sign-in.
 * With `email` preset the address is fixed, and `autoSend` emails the code
 * as soon as the form mounts (used after checkout).
 */
export const SignInForm = ({
  emailEnabled,
  providers,
  next,
  email: presetEmail,
  autoSend = false,
}: {
  emailEnabled: boolean;
  providers: ("google" | "github")[];
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
          result.error.status === 429
            ? "Too many codes requested. Wait a minute and try again."
            : result.error.message || "Your sign-in code could not be sent."
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
          result.error.status === 429
            ? "Too many attempts. Wait a minute and try again."
            : result.error.message || "This code could not be verified."
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

  return (
    <div className="space-y-4">
      {emailEnabled ? (
        <form ref={form} onSubmit={submit} className="space-y-4">
          {step === "email" ? (
            <div className="space-y-2">
              <Label htmlFor={emailId}>Email address</Label>
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
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={codeId}>Six-digit code</Label>
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
              <p className="text-muted-foreground text-center text-xs">
                We sent a code to{" "}
                <strong className="text-foreground">{email}</strong>. It expires
                in 10 minutes.
              </p>
            </div>
          )}
          <Button
            type="submit"
            disabled={busy || (step === "code" && code.length !== CODE_LENGTH)}
            className="w-full"
          >
            {busy ? "One moment…" : SUBMIT_LABEL[step]}
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
        </form>
      ) : null}
      {emailEnabled && providers.length > 0 ? (
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="bg-border h-px flex-1" />
          or
          <span className="bg-border h-px flex-1" />
        </div>
      ) : null}
      {providers.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          disabled={busy}
          className="w-full"
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const result = await authClient.signIn.social({
                callbackURL: next,
                provider,
              });
              if (result.error) {
                setError(
                  result.error.message || "Sign-in could not be started."
                );
              }
            } catch {
              setError("Sign-in is unavailable right now.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Continue with {provider === "github" ? "GitHub" : "Google"}
        </Button>
      ))}
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      {notice && !error ? (
        <p role="status" className="text-muted-foreground text-sm">
          {notice}
        </p>
      ) : null}
    </div>
  );
};
