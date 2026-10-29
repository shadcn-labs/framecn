"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";

interface KeyInfo {
  prefix: string;
  createdAt: number;
}

export const ApiKeyField = () => {
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "working" | "signed-out"
  >("loading");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/api-key", { cache: "no-store" });
        if (!active) {
          return;
        }
        if (response.status === 401) {
          setStatus("signed-out");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load API key.");
        }
        const data = (await response.json()) as { key: KeyInfo | null };
        setInfo(data.key);
        setStatus("ready");
      } catch {
        if (!active) {
          return;
        }
        setError("Could not load your API key.");
        setStatus("ready");
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const generate = async () => {
    setStatus("working");
    setError(null);
    try {
      const response = await fetch("/api/api-key", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to generate API key.");
      }
      const data = (await response.json()) as KeyInfo & { key: string };
      setInfo({ createdAt: data.createdAt, prefix: data.prefix });
      setNewKey(data.key);
      setCopied(false);
    } catch {
      setError("Could not generate a key. Try again.");
    } finally {
      setStatus("ready");
    }
  };

  const copy = async () => {
    if (!newKey) {
      return;
    }
    try {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
    } catch {
      setError("Copy failed. Select the key and copy it manually.");
    }
  };

  const infoLabel = info ? `${info.prefix}••••` : "No key yet";
  const prefixLabel = status === "loading" ? "Loading…" : infoLabel;
  const actionLabel = info ? "Regenerate" : "Generate key";
  const buttonLabel = status === "working" ? "Generating…" : actionLabel;

  if (status === "signed-out") {
    return (
      <p className="text-muted-foreground text-xs">
        Sign in to generate an API key.
      </p>
    );
  }

  return (
    <Frame className="text-xs">
      <FrameContent className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium">API key</p>
            <p
              className="truncate font-mono text-muted-foreground"
              aria-label={info ? "Current API key prefix" : undefined}
            >
              {prefixLabel}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={generate}
            disabled={status !== "ready"}
          >
            {buttonLabel}
          </Button>
        </div>
        {newKey ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <code
                className="min-w-0 flex-1 truncate rounded border bg-background px-2 py-1 font-mono select-all"
                aria-label="New API key"
              >
                {newKey}
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
            <p className="text-muted-foreground">
              Copy it now — it won&apos;t be shown again.
            </p>
          </div>
        ) : null}
        <p
          aria-live="polite"
          className="text-destructive empty:hidden"
          role="status"
        >
          {error}
        </p>
      </FrameContent>
    </Frame>
  );
};
