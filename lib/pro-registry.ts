import "server-only";
import { z } from "zod";

const manifestSchema = z.object({
  items: z.array(
    z.object({
      dependencies: z.array(z.string()).optional(),
      description: z.string().optional(),
      files: z
        .array(
          z.object({
            path: z
              .string()
              .refine(
                (path) =>
                  path.startsWith("registry/") &&
                  path
                    .split("/")
                    .every(
                      (part) => part !== "" && part !== "." && part !== ".."
                    )
              ),
            target: z.string().optional(),
            type: z.string().default("registry:component"),
          })
        )
        .min(1),
      name: z.string(),
      registryDependencies: z.array(z.string()).optional(),
      title: z.string().optional(),
      type: z.string().default("registry:component"),
    })
  ),
});

export class ProRegistryError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ProRegistryError";
  }
}

export interface ProRegistryItem {
  $schema: "https://ui.shadcn.com/schema/registry-item.json";
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string; target?: string; content: string }[];
}

export const getProRegistryItem = async (
  name: string
): Promise<ProRegistryItem> => {
  const token = process.env.FRAMECN_PRO_GITHUB_TOKEN;
  if (!token) {
    throw new ProRegistryError("Pro source is not configured.", 503);
  }

  const readPrivateFile = async (path: string) => {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(
      `https://api.github.com/repos/shadcn-labs/framecn-pro/contents/${encodedPath}?ref=main`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/vnd.github.raw+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        redirect: "error",
      }
    );
    if (!response.ok) {
      throw new ProRegistryError("Pro source is temporarily unavailable.", 502);
    }
    return response.text();
  };

  try {
    const manifest = manifestSchema.parse(
      JSON.parse(await readPrivateFile("registry.json"))
    );
    const item = manifest.items.find((entry) => entry.name === name);
    if (!item) {
      throw new ProRegistryError("Component source is unavailable.", 404);
    }
    const files = await Promise.all(
      item.files.map(async (file) => ({
        ...file,
        content: await readPrivateFile(file.path),
      }))
    );
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files,
    };
  } catch (error) {
    if (error instanceof ProRegistryError) {
      throw error;
    }
    throw new ProRegistryError("Pro source is temporarily unavailable.", 502);
  }
};

export const getProComponentSource = async (name: string): Promise<string> => {
  const { files } = await getProRegistryItem(name);
  const [onlyFile] = files;
  return files.length === 1 && onlyFile
    ? onlyFile.content
    : files.map((file) => `// ${file.path}\n${file.content}`).join("\n\n");
};
