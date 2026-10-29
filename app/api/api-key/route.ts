import { createApiKey, getApiKeyInfo, revokeApiKey } from "@/lib/api-keys";
import { getProAccess, getSession } from "@/lib/auth";

export const runtime = "nodejs";

const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };

const unauthorized = () =>
  Response.json(
    { error: "Sign in to manage your API key." },
    { headers, status: 401 }
  );

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  const [key, pro] = await Promise.all([
    getApiKeyInfo(session.user.id),
    getProAccess(),
  ]);
  return Response.json({ key, pro }, { headers });
};

export const POST = async () => {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  return Response.json(await createApiKey(session.user.id), { headers });
};

export const DELETE = async () => {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  await revokeApiKey(session.user.id);
  return new Response(null, { headers, status: 204 });
};
