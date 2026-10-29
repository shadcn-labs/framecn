import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ComponentDetail } from "@/components/component-detail";
import { ComponentSource } from "@/components/component-source";
import { getProAccess } from "@/lib/auth";
import { CATALOG } from "@/lib/catalog";
import { getComponentDoc } from "@/lib/component-docs";
import { mdxComponents } from "@/mdx-components";

export const ComponentDetailPage = async ({ name }: { name: string }) => {
  const item = CATALOG.find((component) => component.id === name);
  if (!item) {
    notFound();
  }

  const canAccess = !item.pro || (await getProAccess());
  const doc = getComponentDoc(item.id);

  return (
    <ComponentDetail
      item={item}
      canAccess={canAccess}
      source={
        canAccess ? (
          <Suspense
            fallback={
              <p className="text-muted-foreground rounded-lg border p-4 text-xs">
                Loading source…
              </p>
            }
          >
            <ComponentSource
              name={item.id}
              title={`components/framecn/${item.id}.tsx`}
            />
          </Suspense>
        ) : null
      }
      docs={doc && canAccess ? <doc.Body components={mdxComponents} /> : null}
    />
  );
};
