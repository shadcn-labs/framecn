import { verifyApiKey } from "@/lib/api-keys";
import { hasProAccess } from "@/lib/billing";
import { CATALOG } from "@/lib/catalog";
import { PRO_API_KEY_ENV, PRO_REGISTRY_NAMESPACE } from "@/lib/pro-install";
import { getProRegistryItem, ProRegistryError } from "@/lib/pro-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "private, no-store" };

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) => {
  const { name } = await params;
  const id = name.endsWith(".json")
    ? name.slice(0, -".json".length)
    : undefined;
  const isComponent =
    id !== undefined &&
    CATALOG.some((component) => component.id === id && component.pro);

  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(\S+)$/i)?.[1];
  const owner = token ? await verifyApiKey(token) : null;
  if (!owner) {
    return Response.json(
      {
        error: `A valid framecn API key is required. Set ${PRO_API_KEY_ENV} in your environment and configure the ${PRO_REGISTRY_NAMESPACE} registry in components.json. See /docs/registry.`,
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

  try {
    const item = id ? await getProRegistryItem(id) : undefined;
    // Besides catalog components, serve the shared libraries they depend on.
    if (!(item && (isComponent || item.type === "registry:lib"))) {
      throw new ProRegistryError("Pro component not found.", 404);
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
