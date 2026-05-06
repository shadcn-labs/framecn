"use client";

import { Suspense } from "react";

import { ComponentPreviewClient } from "@/components/component-preview-client";
import { ComponentSource } from "@/components/component-source";
import registry from "@/registry/__index__";

const resolveRegistryName = (name: string) =>
  name.endsWith("-demo") ? name.slice(0, -"-demo".length) : name;

export const ComponentPreview = ({
  name,
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const registryName = resolveRegistryName(name);
  const entry = registry[registryName];

  if (!entry) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Unknown component: <code>{name}</code>
      </div>
    );
  }

  return (
    <ComponentPreviewClient
      name={registryName}
      config={entry.config}
      Component={entry.Component}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
      source={
        hideCode ? null : (
          <Suspense
            fallback={
              <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
            }
          >
            <ComponentSource name={registryName} />
          </Suspense>
        )
      }
    />
  );
};
