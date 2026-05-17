import { notFound } from "next/navigation";

import { HyperframesPlayer } from "@/components/hyperframes-player";
import { getHyperframesEntry } from "@/registry/hyperframes-index";

interface PageProps {
  params: Promise<{ name: string }>;
}

export default async function HyperframesPreviewPage({ params }: PageProps) {
  const { name } = await params;
  const entry = getHyperframesEntry(name);

  if (!entry) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{entry.title}</h1>
            <p className="mt-1 text-muted-foreground">{entry.description}</p>
          </div>
          <HyperframesPlayer src={entry.src} className="w-full" />
        </div>
      </div>
    </div>
  );
}
