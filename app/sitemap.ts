import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { CATALOG, catalogItemHref } from "@/lib/catalog";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 1,
      url: SITE.URL,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: `${SITE.URL}${ROUTES.SPONSOR}`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: `${SITE.URL}${ROUTES.ABOUT}`,
    },
    ...[ROUTES.BRAND, ROUTES.CONTACT, ROUTES.LICENSE].map((route) => ({
      changeFrequency: "yearly" as const,
      priority: 0.4,
      url: `${SITE.URL}${route}`,
    })),
    ...[ROUTES.TERMS, ROUTES.PRIVACY, ROUTES.REFUNDS].map((route) => ({
      changeFrequency: "yearly" as const,
      priority: 0.3,
      url: `${SITE.URL}${route}`,
    })),
    ...[ROUTES.COMPONENTS, ROUTES.PRICING].map((route) => ({
      changeFrequency: "weekly" as const,
      priority: 0.9,
      url: `${SITE.URL}${route}`,
    })),
    ...CATALOG.map((component) => ({
      changeFrequency: "monthly" as const,
      priority: 0.8,
      url: `${SITE.URL}${catalogItemHref(component)}`,
    })),
  ];

  const docPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
    priority: page.url === "/docs" ? 0.9 : 0.8,
    url: `${SITE.URL}${page.url}`,
  }));

  return [...staticPages, ...docPages];
}
