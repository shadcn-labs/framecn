"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PlanSlug } from "@/lib/plans";

/** Plan buttons open checkout for anyone; without `plan` it opens the billing portal. */
export const BillingButton = ({
  plan,
  disabled = false,
  highlight = false,
  children,
}: {
  plan?: PlanSlug;
  disabled?: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}) => {
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const variant = highlight ? "gradient" : "default";
  return (
    <div>
      <Button
        type="button"
        variant={variant}
        disabled={disabled || busy}
        className="w-full"
        onClick={async () => {
          setBusy(true);
          setErrorMessage(null);
          try {
            const response = await fetch(
              plan ? "/api/checkout" : "/api/portal",
              {
                body: JSON.stringify(plan ? { plan } : {}),
                headers: { "Content-Type": "application/json" },
                method: "POST",
              }
            );
            const data = (await response.json()) as {
              checkoutUrl?: string;
              url?: string;
              error?: string;
            };
            if (!response.ok) {
              throw new Error(data.error || "Billing is unavailable.");
            }
            const url = data.checkoutUrl || data.url;
            if (!url) {
              throw new Error("The payment provider returned no destination.");
            }
            window.location.assign(url);
          } catch (error) {
            setErrorMessage(
              error instanceof Error ? error.message : "Billing is unavailable."
            );
            setBusy(false);
          }
        }}
      >
        {busy ? "Opening…" : children}
      </Button>
      {errorMessage ? (
        <p role="alert" className="text-destructive mt-2 text-sm">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
