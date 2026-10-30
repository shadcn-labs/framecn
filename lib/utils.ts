import { cn } from "cn";

import { SITE } from "@/constants/site";

export { cn };

export const absoluteUrl = (path: string) => `${SITE.URL}${path}`;

export const formatLabelFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

/** "30 Oct 2026": short, unambiguous dates for account and billing copy. */
export const formatDate = (time: number) =>
  new Date(time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
