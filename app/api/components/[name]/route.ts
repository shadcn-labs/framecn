import { getProAccess, getSession } from "@/lib/auth";
import { CATALOG } from "@/lib/catalog";
import { getProComponentSource, ProRegistryError } from "@/lib/pro-registry";
import { readFileFromRoot } from "@/lib/read-file";
import registry from "@/registry.json";

export const runtime = "nodejs";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) => {
  const { name } = await params;
  const item = CATALOG.find((component) => component.id === name);
  const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
  if (!item) {
    return Response.json(
      { error: "Component not found." },
      { headers, status: 404 }
    );
  }
  if (item.pro) {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { error: "Sign in to access Pro source code." },
        { headers, status: 401 }
      );
    }
    if (!(await getProAccess())) {
      return Response.json(
        { error: "An active framecn Pro plan is required." },
        { headers, status: 403 }
      );
    }
    try {
      const source = await getProComponentSource(item.id);
      return new Response(source, {
        headers: {
          ...headers,
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      if (error instanceof ProRegistryError) {
        return Response.json(
          { error: error.message },
          { headers, status: error.status }
        );
      }
      throw error;
    }
  }
  const files = registry.items.find((entry) => entry.name === item.id)?.files;
  if (!files?.length) {
    return Response.json(
      { error: "Component source is unavailable." },
      { headers, status: 404 }
    );
  }
  const sources = await Promise.all(
    files.map(async (file) => ({
      content: await readFileFromRoot(file.path),
      path: file.path,
    }))
  );
  const [onlySource] = sources;
  const source =
    sources.length === 1 && onlySource
      ? onlySource.content
      : sources.map((file) => `// ${file.path}\n${file.content}`).join("\n\n");
  return new Response(source, {
    headers: {
      ...headers,
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
