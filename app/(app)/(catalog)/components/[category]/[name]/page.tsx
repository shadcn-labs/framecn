import { notFound } from "next/navigation";

import { ComponentDetailPage } from "@/components/component-detail-page";
import { CATALOG, catalogItemHref, COMPONENT_CATEGORIES } from "@/lib/catalog";
import { createPageMetadata } from "@/seo/metadata";

type Params = Promise<{ category: string; name: string }>;

const findItem = async (params: Params) => {
  const { category, name } = await params;
  const item = CATALOG.find(
    (entry) => entry.id === name && entry.category === category
  );
  if (!item || !COMPONENT_CATEGORIES.includes(item.category)) {
    notFound();
  }
  return item;
};

export const generateStaticParams = () =>
  CATALOG.filter((item) => COMPONENT_CATEGORIES.includes(item.category)).map(
    (item) => ({
      category: item.category,
      name: item.id,
    })
  );

export const generateMetadata = async ({ params }: { params: Params }) => {
  const item = await findItem(params);
  return createPageMetadata({
    description: item.description,
    path: catalogItemHref(item),
    title: item.name,
  });
};

const ComponentPage = async ({ params }: { params: Params }) => {
  const item = await findItem(params);
  return <ComponentDetailPage name={item.id} />;
};

export default ComponentPage;
