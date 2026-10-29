import { getAuth, getAuthConfigurationError } from "@/lib/auth";

export const runtime = "nodejs";

const handle = (request: Request) => {
  const error = getAuthConfigurationError();
  if (error) {
    return Response.json({ error }, { status: 503 });
  }
  return getAuth().handler(request);
};

export const GET = handle;
export const POST = handle;
