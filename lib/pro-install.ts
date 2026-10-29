export const PRO_REGISTRY_NAMESPACE = "@framecn-pro";

export const PRO_API_KEY_ENV = "FRAMECN_API_KEY";

export const proInstallCommand = (id: string) =>
  `npx shadcn@latest add ${PRO_REGISTRY_NAMESPACE}/${id}`;

export const proRegistryConfig = (origin: string) =>
  JSON.stringify(
    {
      registries: {
        [PRO_REGISTRY_NAMESPACE]: {
          headers: { Authorization: `Bearer \${${PRO_API_KEY_ENV}}` },
          url: `${origin.replace(/\/$/, "")}/r/pro/{name}.json`,
        },
      },
    },
    null,
    2
  );
