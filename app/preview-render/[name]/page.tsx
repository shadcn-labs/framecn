import { notFound } from "next/navigation";

import { PreviewRenderStage } from "@/components/preview-render-stage";
import { CATALOG } from "@/lib/catalog";

export const metadata = {
  robots: { follow: false, index: false },
  title: "Preview export",
};

const PreviewRenderPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ theme?: string }>;
}) => {
  // Export tooling is local-only; production must never expose a rendering endpoint.
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  const { name } = await params;
  const { theme } = await searchParams;
  if (
    !CATALOG.some((item) => item.id === name) ||
    (theme !== "light" && theme !== "dark")
  ) {
    notFound();
  }
  return <PreviewRenderStage name={name} theme={theme} />;
};

export default PreviewRenderPage;
