import { SITE } from "@/constants/site";

export const PRO_API_KEY_ENV = "FRAMECN_API_KEY";

/** Free and Pro share the `@framecn` namespace; Pro only needs the key header. */
export const installCommand = (id: string) =>
  `npx shadcn@latest add ${SITE.REGISTRY}/${id}`;

export const proRegistryConfig = (origin: string) =>
  JSON.stringify(
    {
      registries: {
        [SITE.REGISTRY]: {
          headers: { Authorization: `Bearer \${${PRO_API_KEY_ENV}}` },
          url: `${origin.replace(/\/$/, "")}/r/{name}.json`,
        },
      },
    },
    null,
    2
  );
