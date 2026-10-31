"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { cn, formatDate } from "@/lib/utils";

/** Label + detail on the left, actions on the right, divided like a settings list. */
export const AccountRow = ({
  title,
  detail,
  children,
  className,
}: {
  title: string;
  detail?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b py-5 last:border-b-0",
      className
    )}
  >
    <div className="min-w-0">
      <p className="font-medium">{title}</p>
      {detail ? (
        <div className="text-muted-foreground mt-1 text-sm">{detail}</div>
      ) : null}
    </div>
    {children ? (
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    ) : null}
  </div>
);

interface KeyInfo {
  prefix: string;
  createdAt: number;
}

export const ApiKeyRow = ({
  initial,
  pro,
}: {
  initial: KeyInfo | null;
  pro: boolean;
}) => {
  const [info, setInfo] = useState(initial);
  const [secret, setSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/api-key", { method: "POST" });
      if (response.ok) {
        const data = (await response.json()) as KeyInfo & { key: string };
        setInfo({ createdAt: data.createdAt, prefix: data.prefix });
        setSecret(data.key);
        setCopied(false);
      } else {
        toast.error("Could not generate a key. Try again.");
      }
    } catch {
      toast.error("Could not generate a key. Try again.");
    }
    setBusy(false);
  };

  const revoke = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/api-key", { method: "DELETE" });
      if (response.ok) {
        setInfo(null);
        setSecret(null);
        toast.success("API key revoked. Installs using it stop working now.");
      } else {
        toast.error("Could not revoke the key. Try again.");
      }
    } catch {
      toast.error("Could not revoke the key. Try again.");
    }
    setBusy(false);
  };

  const copy = async () => {
    if (!secret) {
      return;
    }
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
    } catch {
      toast.error("Copy failed. Select the key and copy it manually.");
    }
  };

  let detail: React.ReactNode = pro
    ? "No key yet. Generate one to install Pro with the shadcn CLI."
    : "Generate one now; it unlocks Pro installs once you have a plan.";
  if (info) {
    detail = (
      <>
        <span className="text-foreground font-mono">{info.prefix}••••</span> ·
        created {formatDate(info.createdAt)}
      </>
    );
  }

  return (
    <div className="border-b py-5">
      <AccountRow
        title="Registry API key"
        detail={detail}
        className="border-b-0 py-0"
      >
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={busy}
          onClick={generate}
        >
          {info ? "Regenerate" : "Generate key"}
        </Button>
        {info ? (
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full"
            disabled={busy}
            onClick={revoke}
          >
            Revoke
          </Button>
        ) : null}
      </AccountRow>
      {secret ? (
        <div className="bg-muted/50 mt-3 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate font-mono text-xs select-all">
              {secret}
            </code>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={copy}
              aria-label={copied ? "API key copied" : "Copy API key"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Copy it now; it won&apos;t be shown again. Store it as
            FRAMECN_API_KEY.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export const SignOutEverywhere = () => {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const revoked = await authClient.revokeSessions();
        if (revoked.error) {
          toast.error("Could not sign out everywhere. Try again.");
          setBusy(false);
          return;
        }
        window.location.assign(ROUTES.HOME);
      }}
    >
      Log out
    </Button>
  );
};

export const DeleteAccount = () => {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm" className="rounded-full" />
        }
      >
        Delete
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            Your sessions and API key are deleted right away. Purchases stay
            tied to your email, so signing in again with it restores Pro.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const result = await authClient.deleteUser();
              if (result.error) {
                toast.error(
                  result.error.message ||
                    "Could not delete the account. Sign in again and retry."
                );
                setBusy(false);
                return;
              }
              window.location.assign(ROUTES.HOME);
            }}
          >
            {busy ? "Deleting…" : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
