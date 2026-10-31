import { verifyApiKey } from "@/lib/api-keys";
import { hasProAccess } from "@/lib/billing";
import { CATALOG } from "@/lib/catalog";
import { PRO_API_KEY_ENV } from "@/lib/pro-install";
import { getProRegistryItem, ProRegistryError } from "@/lib/pro-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pro source must never land in a shared cache, and responses differ per key.
const headers = { "Cache-Control": "private, no-store", Vary: "Authorization" };

/**
 * `@framecn` registry, Pro half. Free items are static files in public/r and
 * are served before this route, with or without a token. Every name reaching
 * here is treated as Pro: the key and plan are checked before the name is even
 * looked up, so unauthenticated callers can't probe which items exist.
 */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) => {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(?<token>\S+)$/iu)?.groups?.token;
  const owner = token ? await verifyApiKey(token) : null;
  if (!owner) {
    return Response.json(
      {
        error: `This is a framecn Pro component. Add your API key as ${PRO_API_KEY_ENV} and send it from the @framecn registry in components.json. See https://framecn.dev/docs/registry#framecn-pro.`,
      },
      { headers, status: 401 }
    );
  }
  if (!(owner.emailVerified && (await hasProAccess(owner.email)))) {
    return Response.json(
      { error: "An active framecn Pro plan is required." },
      { headers, status: 403 }
    );
  }

  const { name } = await params;
  const id = name.endsWith(".json")
    ? name.slice(0, -".json".length)
    : undefined;
  const isComponent =
    id !== undefined &&
    CATALOG.some((component) => component.id === id && component.pro);
  try {
    const item = id ? await getProRegistryItem(id) : undefined;
    // Besides catalog components, serve the shared libraries they depend on.
    if (!(item && (isComponent || item.type === "registry:lib"))) {
      throw new ProRegistryError("Component not found.", 404);
    }
    return Response.json(item, { headers });
  } catch (error) {
    if (error instanceof ProRegistryError) {
      return Response.json(
        { error: error.message },
        { headers, status: error.status }
      );
    }
    throw error;
  }
};
