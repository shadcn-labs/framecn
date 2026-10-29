import { notFound } from "next/navigation";

import {
  CATEGORY_LABELS,
  categoryHref,
  COMPONENT_CATEGORIES,
} from "@/lib/catalog";
import type { CatalogCategory } from "@/lib/catalog";
import { createPageMetadata } from "@/seo/metadata";

type Params = Promise<{ category: string }>;

const findCategory = async (params: Params) => {
  const { category } = await params;
  const match = COMPONENT_CATEGORIES.find((value) => value === category);
  if (!match) {
    notFound();
  }
  return match as CatalogCategory;
};

export const generateStaticParams = () =>
  COMPONENT_CATEGORIES.map((category) => ({ category }));

export const generateMetadata = async ({ params }: { params: Params }) => {
  const category = await findCategory(params);
  const label = CATEGORY_LABELS[category];
  return createPageMetadata({
    description: `${label} video components for React, built with Editframe. Preview, customize, and install with the shadcn CLI.`,
    path: categoryHref(category),
    title: `${label} components`,
  });
};

/** The gallery renders in the catalog layout; this segment only validates the category and sets metadata. */
const CategoryPage = async ({ params }: { params: Params }) => {
  await findCategory(params);
  return null;
};

export default CategoryPage;
